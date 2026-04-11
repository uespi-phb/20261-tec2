export function validateCpf(cpf: string) {
  const cpfNumberOfDigits = 11

  if (cpf === null || cpf === undefined) return false

  cpf = removeAllNonDigits(cpf)

  if (cpf.length !== cpfNumberOfDigits) return false
  if (allDigitsTheSame(cpf)) return false

  const firstCheckDigit = calculateCheckDigit(cpf, 9).toString()
  const secondCheckDigit = calculateCheckDigit(cpf, 10).toString()
  const calculatedCheckDigits = `${firstCheckDigit}${secondCheckDigit}`
  const cpfCheckDigits = cpf.slice(-2)

  return cpfCheckDigits === calculatedCheckDigits
}

function removeAllNonDigits(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

function allDigitsTheSame(cpf: string): boolean {
  return cpf.split('').every((cpfDigit) => cpfDigit === cpf[0])
}

// 12345678901
function calculateCheckDigit(cpf: string, numberOfDigits: number): number {
  let factor = numberOfDigits + 1
  let sumOfFactors = 0
  for (const digit of cpf.substring(0, numberOfDigits)) {
    sumOfFactors += parseInt(digit) * factor--
  }
  const remainder = sumOfFactors % 11
  return remainder >= 2 ? 11 - remainder : 0
}
