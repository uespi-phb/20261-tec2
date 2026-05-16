import { DomainError } from '#src/shared/errors/domain-error'

export class InvalidEmailError extends DomainError {
  constructor(message: string = 'Invalid e-mail') {
    super(message, 'INVALID_EMAIL')
  }
}
