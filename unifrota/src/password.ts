import { InvalidPasswordError } from './invalid-password-error.js'

export class Password {
  static readonly minimunLength = 8

  constructor(public readonly value: string) {
    Password.validate(value)
  }

  static validate(value: string): void {
    Password.checkFalsy(value)
    Password.checkMinLength(value)
    Password.checkUpperLetter(value)
    Password.checkLowerLetter(value)
    Password.checkNumericDigit(value)
  }

  isEqual(other: Password): boolean {
    return this.value === other.value
  }

  static isValid(password: string): boolean {
    try {
      Password.validate(password)
    } catch {
      return false
    }
    return true
  }

  private static checkFalsy(password: string | undefined | null): void {
    if (password === null || password === undefined) {
      throw new InvalidPasswordError(`password cannot be empty`)
    }
  }

  private static checkMinLength(password: string): void {
    if (password.length < Password.minimunLength) {
      throw new InvalidPasswordError(
        `password should have at least ${Password.minimunLength.toString()} characters long`,
      )
    }
  }

  private static checkUpperLetter(password: string): void {
    const regex = /^(?=.*[A-Z]).+/
    if (!regex.test(password)) {
      throw new InvalidPasswordError('password should have at least one upper letter')
    }
  }

  private static checkLowerLetter(password: string): void {
    const regex = /^(?=.*[a-z]).+/
    if (!regex.test(password)) {
      throw new InvalidPasswordError('password should have at least one lower letter')
    }
  }

  private static checkNumericDigit(password: string): void {
    const regex = /^(?=.*[0-9]).+/
    if (!regex.test(password)) {
      throw new InvalidPasswordError('password should have at least one numeric digit')
    }
  }
}
