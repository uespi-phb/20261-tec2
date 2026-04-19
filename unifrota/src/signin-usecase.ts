import type { AccessToken } from '#src/access-token'
import type { GenerateAccessToken } from '#src/generate-access-token'
import { InvalidCredentialsError } from '#src/invalid-credentials-error'
import type { LoadUserByEmail } from '#src/load-user-by-email'
import type { PasswordComparer } from '#src/password-comparer'
import type { UseCase } from '#src/usecase'

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
