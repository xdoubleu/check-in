import { EntityRepository } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { Injectable } from "@nestjs/common"
import { SchoolEntity } from "../entities/school"

@Injectable()
export class SchoolsService {
  private readonly schoolsRepository: EntityRepository<SchoolEntity>

  public constructor(
    @InjectRepository(SchoolEntity)
    schoolsRepository: EntityRepository<SchoolEntity>
  ) {
    this.schoolsRepository = schoolsRepository
  }

  public async getTotalCount(): Promise<number> {
    return this.schoolsRepository.count({
      id: {
        $ne: 1
      }
    })
  }

  public async getAll(): Promise<SchoolEntity[]> {
    return await this.schoolsRepository.findAll()
  }

  public async getAllForLocation(locationId: string): Promise<SchoolEntity[]> {
    const schools = await this.schoolsRepository.findAll({
      populate: ["checkIns"],
      orderBy: {
        name: "asc"
      }
    })

    schools.sort((a, b) => {
      let aLocationCheckIns = 0
      let bLocationCheckIns = 0

      if (a.id !== 1) {
        aLocationCheckIns = a.checkIns
          .toArray()
          .filter((checkIn) => checkIn.location.id === locationId).length
      }

      if (b.id !== 1) {
        bLocationCheckIns = b.checkIns
          .toArray()
          .filter((checkIn) => checkIn.location.id === locationId).length
      }

      return aLocationCheckIns < bLocationCheckIns ? 1 : -1
    })

    return schools
  }

  public async getAllPaged(
    page: number,
    pageSize: number
  ): Promise<SchoolEntity[]> {
    return this.schoolsRepository.find(
      {
        id: {
          $ne: 1
        }
      },
      {
        orderBy: {
          name: "asc"
        },
        limit: pageSize,
        offset: (page - 1) * pageSize
      }
    )
  }

  public async getById(id: number): Promise<SchoolEntity | null> {
    return await this.schoolsRepository.findOne({
      id: id
    })
  }

  public async getByName(name: string): Promise<SchoolEntity | null> {
    return await this.schoolsRepository.findOne({
      name: name
    })
  }

  public async create(name: string): Promise<SchoolEntity> {
    const school = new SchoolEntity(name)
    await this.schoolsRepository.persistAndFlush(school)
    return school
  }

  public async update(
    school: SchoolEntity,
    name: string
  ): Promise<SchoolEntity> {
    school.name = name
    await this.schoolsRepository.flush()
    return school
  }

  public async delete(school: SchoolEntity): Promise<SchoolEntity> {
    await this.schoolsRepository.removeAndFlush(school)
    return school
  }
}
