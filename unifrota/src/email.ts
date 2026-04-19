import { InvalidEmailError } from '#src/invalid-email-error'

export class Email {
  constructor(public readonly value: string) {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (value) {
      this.value = value.trim()
    }
    if (!emailRegex.test(this.value)) {
      throw new InvalidEmailError()
    }
  }

  isEqual(email: Email) {
    return this.value === email.value
  }
}
