import { SystemError } from '#src/shared/errors/system-error'

export abstract class DomainError extends SystemError {
  constructor(message: string, code: string) {
    super(message, code, new.target.name, new.target.prototype)
  }
}
