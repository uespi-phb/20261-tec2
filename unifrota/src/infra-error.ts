import { SystemError } from '#src/system-error'

export abstract class InfraError extends SystemError {
  constructor(message: string, code: string) {
    super(message, code, new.target.name, new.target.prototype)
  }
}
