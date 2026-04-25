# Roteiro de Testes para o Módulo SignIn

## 1. `SignInUseCase`

Esta é a classe central do fluxo. Ela orquestra autenticação, carregamento do usuário e geração do token.

### 1.1

**`should call LoadUserByEmail with provided email`**
Deve verificar se o caso de uso chama a dependência `LoadUserByEmail` com o e-mail recebido na entrada.

### 1.2

**`should call PasswordComparer with provided password and stored hash`**
Deve verificar se o caso de uso envia para o comparador de senha a senha informada pelo usuário e o hash recuperado da conta carregada.

### 1.3

**`should throw when user is not found`**
Deve garantir que o caso de uso falha adequadamente quando nenhum usuário é encontrado para o e-mail informado.

### 1.4

**`should throw when password does not match`**
Deve garantir que o caso de uso rejeita a autenticação quando a senha informada não corresponde à senha armazenada.

### 1.5

**`should call AccessTokenGenerator with correct payload`**
Deve verificar se, após autenticação válida, o caso de uso chama o gerador de token com o identificador do usuário autenticado.

### 1.6

**`should return access token when credentials are valid`**
Deve verificar se, quando credenciais válidas são fornecidas, o caso de uso retorna a saída esperada contendo o token de acesso.

### 1.7

**`should propagate error from LoadUserByEmail`**
Deve verificar se erros lançados pela dependência de carregamento do usuário não são silenciosamente engolidos pelo caso de uso.

### 1.8

**`should propagate error from PasswordComparer`**
Deve garantir que falhas internas na comparação de senha sejam propagadas corretamente.

### 1.9

**`should propagate error from AccessTokenGenerator`**
Deve garantir que falhas na geração do token sejam propagadas corretamente ao chamador.

### 1.10

**`should not call AccessTokenGenerator when credentials are invalid`**
Deve verificar que o gerador de token não é acionado quando a autenticação falha.

### 1.11

**`should not authenticate when email input is invalid`**
Deve garantir que o fluxo não prossiga normalmente quando a entrada contém um e-mail inválido, caso a validação esteja a cargo do próprio fluxo ou de objetos de domínio usados por ele.

### 1.12

**`should not authenticate when password input is invalid`**
Deve garantir que o fluxo não prossiga normalmente quando a entrada contém uma senha inválida, caso a validação esteja a cargo do próprio fluxo ou de objetos de domínio usados por ele.

## 2. `BCryptAdapter`

Esta classe adapta a biblioteca BCrypt à interface `PasswordComparer`.

### 2.1

**`should return true when plain password matches hash`**
Deve verificar se o adapter retorna verdadeiro quando a senha em texto puro corresponde ao hash informado.

### 2.2

**`should return false when plain password does not match hash`**
Deve verificar se o adapter retorna falso quando a senha em texto puro não corresponde ao hash informado.

### 2.3

**`should call bcrypt compare with provided values`**
Deve verificar se o adapter delega corretamente à biblioteca BCrypt, usando exatamente os valores recebidos.

### 2.4

**`should propagate bcrypt errors`**
Deve garantir que erros oriundos da biblioteca BCrypt sejam propagados corretamente pelo adapter.

## 3. `PostgresAdapter`

Pelo diagrama, esta classe faz a ponte com o PostgreSQL. Ela tende a ser uma infraestrutura compartilhada de acesso ao banco.

### 3.1

**`should connect to PostgreSQL successfully`**
Deve verificar se o adapter consegue estabelecer conexão com o banco PostgreSQL.

### 3.2

**`should execute query and return rows`**
Deve verificar se o adapter executa uma consulta e devolve os dados retornados pelo banco no formato esperado.

### 3.3

**`should return empty result when query finds no rows`**
Deve garantir que o adapter trate corretamente consultas sem registros retornados.

### 3.4

**`should propagate database errors`**
Deve garantir que erros do banco ou da biblioteca de acesso sejam propagados corretamente.

### 3.5

**`should release connection after query execution`**
Deve verificar se a conexão, cursor ou recurso equivalente é corretamente liberado após o uso, quando isso fizer parte da responsabilidade da classe.

### 3.6

**`should use provided query parameters`**
Deve verificar se o adapter utiliza corretamente parâmetros recebidos, evitando montagem inadequada da query.

## 4. `UserLoader`

Pelo diagrama, `UserLoader` depende de `PostgresAdapter` e implementa a interface `LoadUserByEmail`.

### 4.1

**`should query user by email`**
Deve verificar se o carregador consulta o banco usando o e-mail fornecido.

### 4.2

**`should return user account when email exists`**
Deve verificar se a classe retorna uma conta de usuário corretamente montada quando o e-mail existe no banco.

### 4.3

**`should return null when email does not exist`**
Deve garantir que a classe retorne `null` ou equivalente quando não houver usuário correspondente.

### 4.4

**`should map database row to user account model`**
Deve verificar se os dados brutos retornados do banco são corretamente convertidos para o modelo de conta esperado pela aplicação.

### 4.5

**`should propagate database errors`**
Deve garantir que falhas vindas do adapter de banco sejam propagadas corretamente.

### 4.6

**`should not alter loaded password hash`**
Deve garantir que o hash da senha recuperado seja preservado exatamente como veio da fonte persistida, sem transformação indevida.

## 5. `JwtAdapter`

Esta classe adapta a biblioteca de JWT à interface `AccessTokenGenerator`.

### 5.1

**`should generate token for provided user id`**
Deve verificar se o adapter gera um token a partir do identificador do usuário informado.

### 5.2

**`should call jwt sign with expected payload`**
Deve verificar se o adapter delega à biblioteca JWT usando o payload esperado.

### 5.3

**`should use configured secret key`**
Deve garantir que o adapter utilize a chave secreta configurada para assinatura do token.

### 5.4

**`should use configured expiration time`**
Deve verificar se o adapter aplica corretamente a configuração de expiração, quando essa responsabilidade lhe pertencer.

### 5.5

**`should return generated token as string`**
Deve garantir que o resultado da geração seja devolvido no formato esperado pela aplicação, tipicamente uma string.

### 5.6

**`should propagate jwt errors`**
Deve garantir que falhas da biblioteca JWT sejam propagadas corretamente.

## 6. `Email`

`Email` aparece no diagrama como objeto de domínio. Sendo um value object, seus testes devem focar invariantes e comportamento próprio.

### 6.1

**`should create Email when address is valid`**
Deve verificar se o objeto `Email` é criado corretamente quando recebe um endereço válido.

### 6.2

**`should throw when email is invalid`**
Deve garantir que o objeto rejeite e-mails com formato inválido.

### 6.3

**`should normalize email when normalization is required`**
Deve verificar se o objeto normaliza o valor recebido, por exemplo removendo espaços externos (trim).

### 6.4

**`should compare equal emails by value`**
Deve verificar igualdade por valor, caso o objeto implemente comparação semântica entre instâncias.

## 7. `Password`

Também é um objeto de domínio. Os testes devem assegurar validade, invariância e representação da senha segundo as regras do domínio.

### 7.1

**`should create Password when value is valid`**
Deve verificar se o objeto `Password` é criado corretamente quando recebe uma senha válida segundo as regras definidas.

### 7.2

**`should throw when password is too short`**
Deve garantir rejeição de senha com comprimento inferior ao mínimo exigido.

### 7.3

**`should throw when password does not satisfy complexity rules`**
Deve verificar se o objeto rejeita senhas que não atendem às regras de complexidade, caso tais regras pertençam ao domínio.

### 7.4

**`should preserve original password value when valid`**
Deve garantir que, sendo válida, a senha seja armazenada de forma coerente com a semântica do objeto.

### 7.5

**`should compare equal passwords by value`**
Deve verificar igualdade por valor, caso essa semântica exista no objeto.
