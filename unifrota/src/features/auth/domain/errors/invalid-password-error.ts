import { DomainError } from '#src/shared/errors/domain-error'

export class InvalidPasswordError extends DomainError {
  constructor(message: string = 'Invalid password') {
    super(message, 'INVALID_PASSWORD')
  }
}
