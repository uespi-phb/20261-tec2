import { SystemError } from '#src/shared/errors/system-error'

export abstract class ApplicationError extends SystemError {
  constructor(message: string, code: string) {
    super(message, code, new.target.name, new.target.prototype)
  }
}
