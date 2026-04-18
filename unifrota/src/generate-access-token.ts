export interface GenerateAccessToken<P> {
  generate: (payload: P) => Promise<string>
}
