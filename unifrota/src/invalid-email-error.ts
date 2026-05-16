import { DomainError } from '#src/domain-error'

export class InvalidEmailError extends DomainError {
  constructor(message: string = 'Invalid e-mail') {
    super(message, 'INVALID_EMAIL')
  }
}
