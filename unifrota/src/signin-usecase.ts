import type { AccessToken } from './access-token'
import type { GenerateAccessToken } from './generate-access-token'
import { InvalidCredentialsError } from './invalid-credentials-error'
import type { LoadUserByEmail } from './load-user-by-email'
import type { PasswordComparer } from './password-comparer'
import type { UseCase } from './usecase'

export type SignInInput = {
  email: string
  password: string
}

export type SignInOutput = AccessToken

export type AccessTokenPayload = {
  userId: string
  userEmail: string
}

export class SignInUseCase implements UseCase<SignInInput, SignInOutput> {
  constructor(
    private readonly loadUserByEmail: LoadUserByEmail,
    private readonly passwordComparer: PasswordComparer,
    private readonly generateAccessToken: GenerateAccessToken<AccessTokenPayload>,
  ) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    const userData = await this.loadUserByEmail.load(input.email)
    if (userData === null) {
      throw new InvalidCredentialsError()
    }
    const isCredentialsValid = await this.passwordComparer.compare(input.password, userData.passwordHash)
    if (!isCredentialsValid) {
      throw new InvalidCredentialsError()
    }
    const payload: AccessTokenPayload = {
      userId: userData.userId,
      userEmail: input.email,
    }
    const accessToken = await this.generateAccessToken.generate(payload)
    return {
      accessToken,
    }
  }
}
