export type UserAuthData = {
  userId: string
  userName: string
  passwordHash: string
}

export interface LoadUserByEmail {
  load: (email: string) => Promise<UserAuthData | null>
}
