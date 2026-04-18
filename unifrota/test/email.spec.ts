import { describe, expect, test } from 'vitest'

import { Email } from '#src/email'
import { InvalidEmailError } from '#src/invalid-email-error'

describe('Email', () => {
  test('Should create an Email when e-mail is valid', () => {
    // Arrange
    const validEmail: string = 'valid.email@email.com'
    // Act
    const email = new Email(validEmail)
    // Assert
    expect(email.value).toBe(validEmail)
  })

  test('Should trim email string when necessary', () => {
    // Arrange
    const validEmail: string = '  valid.email@email.com    '
    // Act
    const email = new Email(validEmail)
    // Assert
    expect(email.value).toBe(validEmail.trim())
  })

  test.each(['invalid_email', 'user@domain', '@', '  ', '', undefined, null])(
    'Should throw InvalidEmailError if e-mail is invalid: "%s"',
    (invalidEmail: unknown) => {
      // Act / Assert
      expect(() => new Email(invalidEmail as string)).toThrow(InvalidEmailError)
    },
  )

  test('Should compare equal emails by value', () => {
    // Arrange
    const validEmail1 = 'valid.email@email.com   '
    const validEmail2 = '  valid.email@email.com'
    // Act
    const email1 = new Email(validEmail1)
    const email2 = new Email(validEmail2)
    // Assert
    expect(email1.isEqual(email2)).toBe(true)
  })
})
