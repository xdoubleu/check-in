import { type APIResponse } from "api-wrapper"
import {
  type Location,
  type User,
  type State
} from "api-wrapper/types/apiTypes"

export const DefaultLocation: Location = {
  id: "locationId",
  name: "location",
  normalizedName: "location",
  available: 2,
  capacity: 10,
  timeZone: "America/Los_Angeles",
  userId: "userId",
  yesterdayFullAt: "",
  availableYesterday: 0,
  capacityYesterday: 0
}

export async function noUserMock(): Promise<APIResponse<User>> {
  return Promise.resolve({
    ok: false
  })
}

export async function defaultUserMock(): Promise<APIResponse<User>> {
  return Promise.resolve({
    ok: true,
    data: {
      id: "userId",
      username: "default",
      role: "default",
      location: DefaultLocation
    }
  })
}

export async function managerUserMock(): Promise<APIResponse<User>> {
  return Promise.resolve({
    ok: true,
    data: {
      id: "userId",
      username: "manager",
      role: "manager"
    }
  })
}

export async function adminUserMock(): Promise<APIResponse<User>> {
  return Promise.resolve({
    ok: true,
    data: {
      id: "userId",
      username: "admin",
      role: "admin"
    }
  })
}

export async function stateMock(): Promise<APIResponse<State>> {
  return Promise.resolve({
    ok: true,
    data: {
      isMaintenance: false,
      isDatabaseActive: true
    }
  })
}
