export class InvalidCredentialsError extends Error {
  constructor(message: string = 'Invalid user credentials') {
    super(message)
  }
}
