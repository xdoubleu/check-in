import { User } from "types"
import { fetchHandler } from "./fetchHandler"

const USERS_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`

export async function getUserInfo(): Promise<User | null> {
  const response = await fetchHandler(`${USERS_URL}/me`)
  if (response === null) {
    return null
  }

  return (await response.json()) as User
}