### Cálculo do valor final de uma compra com desconto por faixa

Por exemplo:

- compras até `R$ 99,99` → sem desconto
- compras de `R$ 100,00` até `R$ 199,99` → `10%` de desconto
- compras a partir de `R$ 200,00` → `20%` de desconto
- valor negativo → erro

#### Primeiro ciclo

Escreva apenas este teste:

> deve retornar o mesmo valor quando não houver desconto

```ts
expect(applyDiscount(50)).toBe(50)
```

A implementação mínima pode ser:

```ts
export function applyDiscount(amount: number): number {
  return amount
}
```

#### Segundo ciclo

Adicione:

> deve aplicar 10% de desconto para compras a partir de 100

```ts
expect(applyDiscount(100)).toBe(90)
```

Agora o código precisa evoluir.

#### Terceiro ciclo

Adicione:

> deve aplicar 20% de desconto para compras a partir de 200

#### Quarto ciclo

Adicione:

> deve lançar erro para valor negativo

### Quinto ciclo

Refatore nomes, extraia validação e melhore a legibilidade.

### Exemplo de testes

```ts
import { describe, expect, test } from 'vitest'
import { applyDiscount } from './apply-discount'

describe('applyDiscount', () => {
  test('should return the same amount when purchase is below 100', () => {
    expect(applyDiscount(50)).toBe(50)
  })

  test('should apply 10 percent discount for purchases from 100', () => {
    expect(applyDiscount(100)).toBe(90)
  })

  test('should apply 10 percent discount for purchases below 200', () => {
    expect(applyDiscount(150)).toBe(135)
  })

  test('should apply 20 percent discount for purchases from 200', () => {
    expect(applyDiscount(200)).toBe(160)
  })

  test('should throw an error for negative amount', () => {
    expect(() => applyDiscount(-1)).toThrow()
  })
})
```

## Implementação final possível

```ts
export function applyDiscount(amount: number): number {
  validateAmount(amount)

  if (amount >= 200) {
    return amount * 0.8
  }

  if (amount >= 100) {
    return amount * 0.9
  }

  return amount
}

function validateAmount(amount: number): void {
  if (amount < 0) {
    throw new Error('Invalid amount')
  }
}
```
