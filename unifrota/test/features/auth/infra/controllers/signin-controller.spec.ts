import { mock } from 'vitest-mock-extended'

import type { SignInUseCaseInterface } from '#src/features/auth/app/usecases/signin-usecase'
import { SignInController } from '#src/features/auth/infra/controllers/singin-controller'

describe('SignInController', () => {
  const email = 'john.doe@email.com'
  const password = 'any_plain_password'
  const request = {
    body: {
      email,
      password,
    },
  }
  const accessToken = 'any_access_token'
  const signInUseCase = mock<SignInUseCaseInterface>()
  signInUseCase.execute.mockResolvedValue({ accessToken })

  const sut = new SignInController(signInUseCase)

  test('Should call SignInUseCase with email and password from request body', async () => {
    await sut.handle(request)

    expect(signInUseCase.execute).toHaveBeenCalledWith({ email, password })
  })

  test('Should call SignInUseCase only with accepted sign in input fields', async () => {
    const role = 'admin'
    const badRequest = {
      body: {
        email,
        password,
        role,
      },
    }

    await sut.handle(badRequest)

    expect(signInUseCase.execute).toHaveBeenCalledWith({ email, password })
  })

  test('Should return 200 and access token when credentials are valid', async () => {
    const response = await sut.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({ accessToken })
  })

  test('Should return 400 when request body is missing ou null', async () => {
    const badRequest = {}
    const response = await sut.handle(badRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toBeUndefined()
  })
})
