export interface User {
  _id: string
  name: string
  email: string
  role: number
}

export interface Jwt {
  user: User,
  token: string
}
