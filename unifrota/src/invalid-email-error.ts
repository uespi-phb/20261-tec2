export class InvalidEmailError extends Error {
  constructor(message: string = 'Invalid e-mail') {
    super(message)
  }
}
