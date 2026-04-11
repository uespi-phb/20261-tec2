import { validateCpf } from '../src/validate-cpf'

describe('validateCpf', () => {
  const validCpfs = ['177.594.490-54', '515070430-07', '78437331080']
  const invalidCpfs = ['1234567890', '123456789000']
  const nullOrEmptyCpfs = [null, undefined, '', ' ', '   ']
  const nonNumericCpf = ['abc.def.ghi-jk', '123.456.789-xx', '123456789a0', ' 12345678900 ', '1234 5678900']

  const generateCpfsWithRepeatedDigits = (): string[] => {
    return Array.from({ length: 10 }, (_, digit) => String(digit).repeat(11))
  }

  test.each(validCpfs)('Should validate a valid CPF: "%s"', (cpf: string) => {
    // Arrange
    // Act
    const isValidCpf = validateCpf(cpf)
    // Assert
    expect(isValidCpf).toBe(true)
  })

  test.each(invalidCpfs)('Should not validate an invalid CPF: "%s"', (cpf: string) => {
    // Arrange
    // Act
    const isValidCpf = validateCpf(cpf)
    // Assert
    expect(isValidCpf).toBe(false)
  })

  test.each(nullOrEmptyCpfs)('Should not validate null/undefined CPF: "%s"', (cpf: unknown) => {
    // Arrange
    // Act
    const isValidCpf = validateCpf(cpf as string)
    // Assert
    expect(isValidCpf).toBe(false)
  })

  test.each(nonNumericCpf)('Should not validate a CPF with non-numeric characters: "%s"', (cpf: string) => {
    const isValidCpf = validateCpf(cpf)

    expect(isValidCpf).toBe(false)
  })

  // prettier-ignore
  test.each(generateCpfsWithRepeatedDigits())
  ('Should not validate a CPF if all digits the same: %s',
    (cpf: string) => {
      // Arrange
      // Act
      const isValidCpf = validateCpf(cpf)
      // Assert
      expect(isValidCpf).toBe(false)
    },
  )
})
