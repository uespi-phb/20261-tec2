import { InvalidEmailError } from '#src/invalid-email-error'

export class Email {
  constructor(public readonly value: string) {
    if (value) {
      this.value = value.trim()
    }
    Email.validate(this.value)
  }

  isEqual(email: Email) {
    return this.value === email.value
  }

  static validate(email: string) {
    if (!Email.isValid(email)) {
      throw new InvalidEmailError()
    }
  }

  static isValid(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
