import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Res
} from "@nestjs/common"
import { CheckInsService } from "./checkins.service"
import { SchoolsService } from "../schools/schools.service"
import { CreateCheckInDto, DATE_FORMAT, Role } from "types-custom"
import { Roles } from "../auth/decorators/roles.decorator"
import { type LocationEntity, UserEntity, type CheckInEntity } from "mikro-orm-config"
import { ReqUser } from "../auth/decorators/user.decorator"
import { LocationsService } from "../locations/locations.service"
import { endOfDay, format, startOfDay } from "date-fns"
import {
  convertDatetime,
  convertDayData,
  convertRangeData
} from "../helpers/dataConverters"
import { Parser } from "json2csv"
import { Response } from "express"

@Controller("checkins")
export class CheckInsController {
  private readonly checkInsService: CheckInsService
  private readonly schoolsService: SchoolsService
  private readonly locationsService: LocationsService

  public constructor(
    checkInsService: CheckInsService,
    schoolsService: SchoolsService,
    locationsService: LocationsService
  ) {
    this.checkInsService = checkInsService
    this.schoolsService = schoolsService
    this.locationsService = locationsService
  }

  @Get("range/:locationId")
  public async getDataForRangeChart(
    @ReqUser() user: UserEntity,
    @Param("locationId") locationId: string,
    @Query("startDate") queryStartDate: string,
    @Query("endDate") queryEndDate: string
  ): Promise<unknown[]> {
    const location = await this.locationsService.getById(locationId)
    if (!location || !this.isAdminOrOwner(location, user)) {
      throw new NotFoundException("Location not found")
    }

    const startDate = startOfDay(new Date(queryStartDate))
    const endDate = endOfDay(new Date(queryEndDate))

    return convertRangeData(
      await this.checkInsService.getAll(location, startDate, endDate),
      await this.schoolsService.getAll()
    )
  }

  @Get("csv/range/:locationId")
  public async getCsvForRangeChart(
    @Res() res: Response,
    @ReqUser() user: UserEntity,
    @Param("locationId") locationId: string,
    @Query("startDate") queryStartDate: string,
    @Query("endDate") queryEndDate: string
  ): Promise<void> {
    const data = await this.getDataForRangeChart(
      user,
      locationId,
      queryStartDate,
      queryEndDate
    )

    const json = convertDatetime(data, DATE_FORMAT)
    const parser = new Parser({
      fields: Object.getOwnPropertyNames(data[0])
    })
    const csv = parser.parse(json)

    res.header("Content-Type", "text/csv")
    res.attachment(`Range-${format(new Date(), "yyyyMMddHHmmss")}.csv`)
    res.send(csv)
  }

  @Get("day/:locationId")
  public async getDataForDayChart(
    @ReqUser() user: UserEntity,
    @Param("locationId") locationId: string,
    @Query("date") queryDate: string
  ): Promise<unknown[]> {
    const location = await this.locationsService.getById(locationId)
    if (!location || !this.isAdminOrOwner(location, user)) {
      throw new NotFoundException("Location not found")
    }

    const startDate = startOfDay(new Date(queryDate))
    const endDate = endOfDay(new Date(queryDate))

    return convertDayData(
      await this.checkInsService.getAll(location, startDate, endDate),
      await this.schoolsService.getAll()
    )
  }

  @Get("csv/day/:locationId")
  public async getCsvForDayChart(
    @Res() res: Response,
    @ReqUser() user: UserEntity,
    @Param("locationId") locationId: string,
    @Query("date") queryDate: string
  ): Promise<void> {
    const data = await this.getDataForDayChart(user, locationId, queryDate)

    const json = convertDatetime(data, "yyyy-MM-dd-HH-mm")
    const parser = new Parser({
      fields: Object.getOwnPropertyNames(data[0])
    })
    const csv = parser.parse(json)

    res.header("Content-Type", "text/csv")
    res.attachment(`Day-${format(new Date(), "yyyyMMddHHmmss")}.csv`)
    res.send(csv)
  }

  @Roles(Role.User)
  @Post()
  public async create(
    @ReqUser() user: UserEntity,
    @Body() createCheckInDto: CreateCheckInDto
  ): Promise<CheckInEntity> {
    if (!user.location) {
      throw new BadRequestException()
    }

    const school = await this.schoolsService.getById(createCheckInDto.schoolId)
    if (!school) {
      throw new NotFoundException("School not found")
    }

    const checkin = await this.checkInsService.create(user.location, school)
    if (!checkin) {
      throw new InternalServerErrorException("Could not create CheckIn")
    }

    return checkin
  }

  private isAdminOrOwner(location: LocationEntity, user: UserEntity): boolean {
    return !user.roles.includes(Role.Admin) && location.user.id !== user.id
  }
}
