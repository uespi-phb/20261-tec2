export abstract class SystemError extends Error {
  public readonly code: string

  protected constructor(message: string, code: string, className: string, prototype: object) {
    super(message)
    this.code = code
    this.name = className
    Object.setPrototypeOf(this, prototype)
  }
}
