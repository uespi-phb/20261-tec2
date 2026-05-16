import type { SignInUseCaseInterface } from '#src/features/auth/app/usecases/signin-usecase.js'
import type { Controller, Request, Response } from '#src/shared/contracts/controller'

type RequestBody = {
  email: string
  password: string
}

type ResponseBody = {
  accessToken: string
}

export class SignInController implements Controller<RequestBody, ResponseBody> {
  constructor(private readonly signInUseCase: SignInUseCaseInterface) {}

  async handle(request: Request<RequestBody>): Promise<Response<ResponseBody>> {
    if (request.body === undefined) return { statusCode: 400 }

    const input = {
      email: request.body.email,
      password: request.body.password,
    }
    const { accessToken } = await this.signInUseCase.execute(input)
    return {
      statusCode: 200,
      body: {
        accessToken,
      },
    }
  }
}
