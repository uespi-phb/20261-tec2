import { describe, test } from 'vitest'
import { validateCpf } from '@src/validate-cpf'

describe('validateCpf', () => {
  test.each([
    // prettier-ignore
    '262.939.260-05',
    '230.735.11083',
    '563977530-00',
    '442.79671087',
    '442-796-710-87',
    '442_796_710_87',
    '64858470067',
  ])('Should validate a valid CPF: "%s"', (validCpf: string) => {
    // Act
    const isValidCpf = validateCpf(validCpf)
    // Assert
    expect(isValidCpf).toBe(true)
  })

  test.each([
    // prettier-ignore
    '',
    '  ',
    null,
    undefined,
  ])('Should not validate empty/null CPF: "%s"', (validCpf: unknown) => {
    // Act
    const isValidCpf = validateCpf(validCpf as string)
    // Assert
    expect(isValidCpf).toBe(false)
  })

  test.each([
    // prettier-ignore
    '12345678901',
    '1234567890',
    '123456789012',
  ])('Should not validate invalid CPF: "%s"', (invalidCpf: string) => {
    // Act
    const isValidCpf = validateCpf(invalidCpf)
    // Assert
    expect(isValidCpf).toBe(false)
  })

  test.each([
    // prettier-ignore
    '00000000000',
    '55555555555',
    '99999999999',
  ])('Should not validate same digits CPF: "%s"', (invalidCpf: string) => {
    // Act
    const isValidCpf = validateCpf(invalidCpf)
    // Assert
    expect(isValidCpf).toBe(false)
  })
})
