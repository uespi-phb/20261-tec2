export class InvalidPasswordError extends Error {
  constructor(message: string = 'Invalid password') {
    super(message)
  }
}
