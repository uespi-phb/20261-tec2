import { describe, test, expect } from 'vitest'
import { mock } from 'vitest-mock-extended'
//
// PRODUCTION CODE
//
interface LoadUserByEmail {
  load: (email: string) => void
}

type SignInInput = {
  email: string
  password: string
}

class SignInUseCase {
  private loadUserByEmail: LoadUserByEmail

  constructor(loadUserByEmail: LoadUserByEmail) {
    this.loadUserByEmail = loadUserByEmail
  }
  execute(input: SignInInput): void {
    this.loadUserByEmail.load(input.email)
  }
}
//
//

describe('SignInUseCase', () => {
  test('Should call LoadUserByEmail with provided email', () => {
    // Arrange
    const input = {
      email: 'john.doe@email.com',
      password: 'any_plain_password',
    }
    const loadUserByEmailSpy = mock<LoadUserByEmail>()
    const signInUseCase = new SignInUseCase(loadUserByEmailSpy)
    // Act
    signInUseCase.execute(input)
    // Assert
    expect(loadUserByEmailSpy.load).toHaveBeenCalledWith(input.email)
  })
})
