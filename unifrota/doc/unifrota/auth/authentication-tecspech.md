# TECHSPEC - Autenticação e Autorização de Usuários

## 1. Objetivo técnico

Definir como o backend do UniFrota autenticará usuários e aplicará autorização por perfil e escopo, de modo coerente com o PRD e com uma organização arquitetural orientada a casos de uso, separação de responsabilidades e testabilidade.

## 2. Escopo desta TechSpec

Esta especificação cobre:

* autenticação de usuários
* representação técnica de perfis e escopos
* autorização de rotas e casos de uso
* resolução de permissões quando um usuário acumula papéis
* proteção de recursos por unidade/campus
* estrutura mínima de endpoints de autenticação
* estratégia de testes do módulo

## 3. Fora do escopo

Esta especificação não cobre:

* cadastro completo de usuários
* recuperação de senha
* integração com SSO externo
* auditoria formal avançada
* IAM corporativo
* MFA

> **Observação:** o PRD exige autenticação e autorização, mas **não define** provedor externo de identidade, SSO, MFA, refresh token ou política de recuperação de senha. Portanto, esses pontos permanecem **em aberto** e não devem ser assumidos como decididos.

## 4. Requisitos de entrada derivados do PRD

### 4.1 Requisitos funcionais cobertos

* **RF01**: autenticação de usuários
* **RF02**: distinção de permissões por perfil
* suporte indireto a RF07, RF08, RF09, RF11, RF12, RF13 e RF14 por meio de proteção de acesso

### 4.2 Requisitos não funcionais cobertos

* **RNF02**: exigir autenticação e aplicar autorização conforme perfil
* **RNF05**: separação de responsabilidades
* **RNF06**: testabilidade
* **RNF08**: suporte a múltiplas unidades/campi

### 4.3 Regras de negócio impactadas

* um mesmo usuário pode acumular mais de um papel
* um gestor pode autorizar viagens se possuir essa atribuição
* requisitante comum solicita viagem apenas em sua própria unidade
* gestores locais atuam no âmbito de sua unidade
* gestor global possui visão institucional consolidada, sem prioridade operacional automática sobre a frota local
* chefia e gestor autorizado podem aprovar ou rejeitar solicitações da unidade competente.

## 5. Visão geral da solução

A solução adotará **autenticação por credencial e senha** com emissão de **token de acesso**, e **autorização híbrida** baseada em:

* **papéis** do usuário
* **escopo organizacional** do papel
* **regras contextuais** do recurso acessado

Em termos arquiteturais, a organização recomendada é compatível com **Clean Architecture**: regras de autorização e casos de uso no núcleo da aplicação; adaptadores HTTP, persistência e mecanismo de token fora do núcleo. Isso é aderente à diretriz de que o centro da aplicação são os **casos de uso**, e não banco de dados ou framework.

## 6. Premissas e decisões propostas

### 6.1 Decisões consolidadas nesta TechSpec

1. A autenticação será **local ao sistema**, sem pressupor SSO.
2. A senha será armazenada **apenas como hash**, nunca em texto puro.
3. O acesso às rotas protegidas ocorrerá por **Bearer Token**.
4. A autorização não será apenas RBAC puro; ela combinará:

   * papel
   * unidade/campus
   * vínculo com o recurso
   * permissões adicionais, quando necessário
5. Quando um usuário possuir múltiplos papéis, a permissão efetiva será a **união controlada** de seus papéis válidos no escopo correto.
6. A checagem de autorização deve ocorrer **antes** da execução do caso de uso, mas a regra de negócio final continua pertencendo ao caso de uso e ao domínio.

### 6.2 Decisões em aberto

* identificador de login: e-mail, matrícula, username ou outro
* uso ou não de refresh token
* política de expiração do token
* política de bloqueio por tentativas inválidas
* necessidade futura de MFA
* logout com revogação explícita ou simples expiração do token

## 7. Arquitetura da solução

## 7.1 Estilo arquitetural

* **Application / Use Cases** como centro da solução
* **Interface Adapters** para HTTP, persistência e token
* **Domain** para representar usuário, papéis e invariantes essenciais.

## 7.2 Camadas e responsabilidades

### Domain

Responsável por:

* entidade `User`
* valor `Role`
* valor `UnitScope`
* invariantes sobre ativação/bloqueio
* composição válida de papéis, quando necessário

### Application

Responsável por:

* `AuthenticateUser`
* `GetCurrentUser`
* `AuthorizeAction`
* orquestração de carregamento de usuário, verificação de senha e montagem do principal autenticado

### Infrastructure

Responsável por:

* repositório de usuários e papéis
* serviço de hash/verificação de senha
* emissor e validador de token
* armazenamento eventual de revogação, se adotado

### Interface / Delivery

Responsável por:

* controller HTTP
* middleware de autenticação
* guard/policy check por rota
* serialização de respostas e erros

## 8. Modelagem técnica mínima

### 8.1 Entidades

#### User

Campos mínimos:

* `id`
* `identifier`
* `name`
* `passwordHash`
* `isActive`
* `homeUnitId`
* `authVersion`

#### UserRoleAssignment

Representa um papel atribuído ao usuário.

Campos mínimos:

* `userId`
* `role`
* `scopeType` (`LOCAL` ou `GLOBAL`)
* `unitId?`
* `canAuthorizeTrips`
* `isActive`

> `authVersion` é recomendado para invalidar tokens antigos quando houver mudança relevante de papéis ou bloqueio de conta.

### 8.2 Value Objects

* `UserId`
* `UnitId`
* `Role`
* `ScopeType`
* `PasswordHash`

### 8.3 Enum de papéis

* `REQUESTER`
* `DRIVER`
* `UNIT_MANAGER`
* `UNIT_HEAD`
* `GLOBAL_MANAGER`

## 9. Política de autorização

## 9.1 Estratégia

A autorização será avaliada por uma política do tipo:

`authorized = role check + scope check + contextual rule`

### 9.2 Regras-base por papel

#### Requisitante

Pode:

* criar solicitação
* consultar próprias solicitações
* cancelar solicitação antes do início, quando permitido
* atuar como condutor autorizado apenas nas condições do PRD

Restrição central:

* atua apenas em sua própria unidade, salvo regra futura explícita.

#### Motorista

Pode:

* consultar viagens atribuídas
* realizar check-in
* realizar check-out
* registrar dados operacionais da viagem atribuída

#### Chefia da unidade

Pode:

* consultar solicitações da unidade
* aprovar ou rejeitar solicitações da unidade
* definir prioridade entre solicitações concorrentes da unidade.

#### Gestor local

Pode:

* gerenciar veículos e motoristas da unidade
* consultar histórico e relatórios da unidade
* realizar alocação operacional da unidade
* autorizar viagens da unidade apenas quando `canAuthorizeTrips = true`.

#### Gestor global

Pode:

* consultar dados de todas as unidades
* administrar cadastros globais
* consultar relatórios globais

Restrição central:

* não recebe, por padrão, prevalência operacional automática sobre a frota local.

## 9.3 Regras contextuais obrigatórias

Mesmo com papel compatível, a autorização deve considerar:

* unidade do recurso
* dono do recurso, quando aplicável
* atribuição formal da viagem ao motorista
* sinalizador `canAuthorizeTrips`
* estado da solicitação/viagem, quando a ação depender do estado

## 10. Casos de uso

### 10.1 AuthenticateUser

**Entrada**

* `identifier`
* `password`

**Fluxo**

1. localizar usuário pelo identificador
2. verificar se a conta está ativa
3. validar senha
4. carregar papéis ativos e escopos
5. emitir token de acesso
6. retornar principal autenticado

**Saída**

* `accessToken`
* `tokenType`
* `expiresAt` ou `expiresIn`
* `user`
* `roles`

### 10.2 GetCurrentUser

Retorna o principal autenticado já resolvido a partir do token:

* `userId`
* `name`
* `homeUnitId`
* `roleAssignments`
* `capabilities` resumidas

### 10.3 AuthorizeAction

Caso de uso interno, policy service ou componente equivalente para decidir se o usuário autenticado pode executar determinada ação sobre determinado recurso.

**Entrada**

* principal autenticado
* ação
* recurso
* contexto do recurso

**Saída**

* permitido / negado
* motivo técnico da negação

## 11. Endpoints REST mínimos

### `POST /auth/signin`

**Request**

```json
{
  "identifier": "user@example.edu",
  "password": "plain-password"
}
```

**Response 200**

```json
{
  "accessToken": "token",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "homeUnitId": "uuid"
  },
  "roles": [
    {
      "role": "UNIT_MANAGER",
      "scopeType": "LOCAL",
      "unitId": "uuid",
      "canAuthorizeTrips": true
    }
  ]
}
```

### `GET /auth/me`

Retorna o usuário autenticado a partir do token atual.

## 12. Middleware e guards

### 12.1 Authentication Middleware

Responsabilidades:

* extrair token Bearer
* validar assinatura/estrutura
* rejeitar token ausente ou inválido
* montar `AuthenticatedPrincipal`

### 12.2 Authorization Guard

Responsabilidades:

* receber a ação requerida pela rota
* consultar o policy service
* negar com `403` quando o principal não possuir permissão suficiente

## 13. Contratos e interfaces

### 13.1 Portas de aplicação

```ts
interface LoadUserByIdentifier {
  load(identifier: string): Promise<User | null>
}

interface LoadUserRoleAssignments {
  loadByUserId(userId: string): Promise<UserRoleAssignment[]>
}

interface PasswordHasher {
  compare(plainText: string, hash: string): Promise<boolean>
}

interface AccessTokenIssuer {
  issue(input: AuthenticatedPrincipal): Promise<AccessToken>
}

interface AccessTokenValidator {
  validate(token: string): Promise<AuthenticatedPrincipal | null>
}
```

## 14. Estratégia de persistência

A modelagem mínima recomendada é:

* `users`
* `user_role_assignments`

Estruturas auxiliares, se necessárias:

* `revoked_tokens`
* `auth_audit_log`

> `auth_audit_log` é útil, mas não deve ser confundido com módulo formal de auditoria, que está fora do escopo do PRD.

## 15. Códigos de resposta HTTP

* `200 OK` - autenticação válida
* `400 Bad Request` - payload inválido
* `401 Unauthorized` - credenciais inválidas ou token inválido/ausente
* `403 Forbidden` - autenticado, porém sem permissão
* `409 Conflict` - estado inconsistente para a ação
* `422 Unprocessable Entity` - regra contextual não atendida

## 16. Estratégia de testes

A disciplina enfatiza testes unitários e de integração, com separação clara de camadas e uso criterioso de doubles. Para este módulo, isso recomenda: testes unitários no núcleo de autenticação/autorização e testes de integração nas rotas protegidas e adaptadores de persistência/token.

### 16.1 Testes unitários

Cobrir:

* verificação de senha
* união de papéis
* resolução de escopo local/global
* regra `canAuthorizeTrips`
* autorização por papel
* autorização por papel + unidade
* negação por conta inativa

### 16.2 Testes de integração

Cobrir:

* `POST /auth/signin`
* `GET /auth/me`
* rota protegida com token válido
* rota protegida sem token
* rota protegida com token inválido
* rota protegida com papel insuficiente
* rota protegida com papel válido e escopo inválido

## 17. Riscos e cuidados

* modelar papéis sem escopo de unidade produzirá autorização incorreta
* concentrar autorização apenas no controller tende a espalhar regra e degradar a manutenção
* confiar apenas em claims estáticas no token pode gerar permissão obsoleta após alteração de papéis
* conceder poder global irrestrito ao gestor global violaria o PRD
* misturar autenticação com regras operacionais de viagem aumentará acoplamento

## 18. Síntese final

A solução recomendada para o UniFrota é:

* autenticação por credencial + senha hash
* token Bearer para acesso autenticado
* autorização baseada em **papéis + escopo + contexto**
* suporte nativo a **múltiplos papéis por usuário**
* diferenciação explícita entre **escopo local** e **escopo global**
* validação centralizada por policy service/guard
* implementação aderente a Clean Architecture e fortemente testável.
