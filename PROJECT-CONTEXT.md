# Documento de Contexto do Projeto

## 1. Visão Geral

Este projeto é um backend em Node.js/TypeScript para uma aplicação fintech, usando Express, Prisma e PostgreSQL. A arquitetura segue o padrão em camadas: rotas → controllers → services → banco de dados.

O backend já implementa autenticação por JWT, cadastro e login de usuários, gestão de categorias e um módulo completo de transações financeiras com filtros e resumo por período.

## 2. Arquitetura

- Rotas: definidas em src/routes.ts.
- Controllers: recebem a requisição, extraem os dados e delegam a execução para o service correspondente.
- Services: concentram a lógica de negócio, validam regras, acessam o banco via Prisma e retornam os dados ao controller.
- Middlewares: usados para validação de schemas e autenticação de rotas protegidas.
- Prisma: gerencia o acesso ao banco PostgreSQL e a conexão é compartilhada por toda a aplicação.

Fluxo típico:
- Router recebe a requisição.
- Controller instancia e chama o service.
- O service utiliza prismaClient para consultar ou alterar o banco.
- O controller retorna a resposta ao cliente.

## 3. Organização de Pastas

- src/
  - controllers/
    - user/
      - CreateUserController.ts
      - AuthUserController.ts
      - DetailUserController.ts
    - category/
      - CreateCategoryController.ts
      - ListCategoryController.ts
    - transaction/
      - CreateTransactionController.ts
      - ListTransactionController.ts
      - ListTransactionsByCategoryController.ts
      - DeleteTransactionController.ts
      - SummaryTransactionController.ts
  - services/
    - user/
      - CreateUserService.ts
      - AuthUserService.ts
      - DetailUserService.ts
    - category/
      - CreateCategoryService.ts
      - ListCategoryService.ts
    - transaction/
      - CreateTransactionService.ts
      - ListTransactionService.ts
      - ListTransactionsByCategoryService.ts
      - DeleteTransactionService.ts
      - SummaryTransactionService.ts
  - middlewares/
    - validateSchema.ts
    - isAuthenticatd.ts
  - schemas/
    - userSchema.ts
    - categorySchema.ts
    - transactionSchema.ts
  - prisma/
    - index.ts
- prisma/
  - schema.prisma
  - migrations/

## 4. Dependências e Versões

### Dependências
- @prisma/adapter-pg: ^7.8.0
- @prisma/client: ^7.8.0
- bcryptjs: ^3.0.3
- cors: ^2.8.6
- dotenv: ^17.4.2
- express: ^5.2.1
- jsonwebtoken: ^9.0.3
- pg: ^8.21.0
- tsx: ^4.22.4
- zod: ^4.4.3

### DevDependencies
- @types/cors: ^2.8.19
- @types/express: ^5.0.6
- @types/jsonwebtoken: ^9.0.10
- @types/node: ^25.9.3
- prisma: ^7.8.0
- typescript: ^6.0.3

## 5. Configurações Principais

- src/server.ts
  - usa express.json() para parsear JSON no body das requisições.
  - habilita CORS para permitir integrações com frontend.
  - registra as rotas da aplicação.
  - possui middleware global de tratamento de erro.
- src/prisma/index.ts
  - importa o PrismaClient gerado em src/generated/prisma.
  - usa o adaptador PrismaPg e a variável DATABASE_URL.
  - exporta uma instância única do cliente prismaClient.

## 6. Endpoints do Projeto

Base URL sugerida: http://localhost:3333

### Usuários
- POST /users
  - Cria um novo usuário.
  - Validação: createUserSchema.
  - Body:
    - name: string, mínimo 3 caracteres.
    - email: string, formato de e-mail válido.
    - password: string, mínimo 6 caracteres.
  - Resposta: retorna id, name, email, role e createdAt.

- POST /session
  - Autentica um usuário e retorna um token JWT.
  - Validação: authUserSchema.
  - Body:
    - email: string.
    - password: string.
  - Resposta: retorna id, name, email e token.

- GET /me
  - Retorna os dados do usuário autenticado.
  - Requer header Authorization: Bearer <token>.
  - Resposta: retorna id, name, email, role e createdAt.

### Categorias
- POST /category
  - Cria uma categoria para o usuário autenticado.
  - Requer autenticação.
  - Body:
    - name: string, mínimo 2 caracteres.
  - Regras: o nome é convertido para lowercase antes de salvar e deve ser único por usuário.
  - Resposta: retorna id, name e createdAt.

- GET /category
  - Lista todas as categorias do usuário autenticado.
  - Requer autenticação.
  - Resposta: array de categorias com id, name, createdAt e updatedAt.

### Transações
- POST /transaction
  - Cria uma nova transação vinculada a uma categoria do usuário autenticado.
  - Requer autenticação.
  - Body:
    - name: string.
    - value: number inteiro, representando centavos.
    - description: string.
    - category_id: string UUID.
    - type: ENTRADA ou SAIDA.
  - Regras: a categoria informada deve pertencer ao usuário autenticado.
  - Resposta: retorna a transação criada com id, name, value, description, category_id, type e createdAt.

- GET /transaction
  - Lista as transações do usuário autenticado.
  - Requer autenticação.
  - Query params:
    - disable: opcional, valores true ou false.
  - Resposta: array de transações com dados da categoria associada.

- GET /category/transaction
  - Lista as transações de uma categoria específica.
  - Requer autenticação.
  - Query params:
    - category_id: obrigatório, UUID da categoria.
  - Resposta: array de transações da categoria.

- DELETE /transaction
  - Realiza soft delete de uma transação.
  - Requer autenticação.
  - Query params:
    - transaction_id: obrigatório, UUID da transação.
  - Resposta: mensagem de confirmação de desativação.

- GET /transaction/summary
  - Retorna um resumo financeiro do usuário autenticado.
  - Requer autenticação.
  - Query params opcionais:
    - startDate: data inicial para filtro.
    - endDate: data final para filtro.
  - Resposta: objeto com entradas, saidas e saldo.

## 7. Validação de Schema

A validação usa zod e o middleware validateSchema em src/middlewares/validateSchema.ts.

- createUserSchema valida:
  - name: string, mínimo 3 caracteres.
  - email: string, formato válido de e-mail.
  - password: string, mínimo 6 caracteres.

- authUserSchema valida:
  - email: string, formato válido de e-mail.
  - password: string, obrigatório.

- createCategorySchema valida:
  - name: string, mínimo 2 caracteres.

- createTransactionSchema valida:
  - name: string, obrigatório.
  - value: número inteiro positivo, representando centavos.
  - description: string, obrigatório.
  - category_id: string, obrigatório.
  - type: enum com ENTRADA ou SAIDA.

- listTransactionSchema valida o parâmetro disable da query.
- listTransactionsByCategorySchema valida o parâmetro category_id como UUID.
- deleteTransactionSchema valida o parâmetro transaction_id como UUID.

O middleware parseia body, query e params e retorna 400 com detalhes quando houver erro de validação.

## 8. Middleware

### isAuthenticated
- Verifica o header Authorization.
- Se não houver token, retorna 401.
- Espera o formato Bearer <token>.
- Usa jsonwebtoken.verify com process.env.JWT_SECRET.
- Define req.user_id com o sub do payload.
- Se o token for inválido, retorna 401.

### Tratamento de erros global
- Em src/server.ts, o middleware final captura erros e retorna 400 ou 500 conforme o contexto.

## 9. Modelagem do Banco de Dados

Definida em prisma/schema.prisma com PostgreSQL.

### Modelos

#### User
- id: String, UUID, primary key.
- name: String.
- email: String, único.
- password: String.
- role: Enum Role (USER, ADMIN), default USER.
- createdAt: DateTime, default now().
- updatedAt: DateTime, @updatedAt.
- Relacionamentos: transactions e categories.

#### Category
- id: String, UUID, primary key.
- name: String.
- user_id: String, relação com User.
- user: relação com onDelete: Cascade.
- createdAt: DateTime, default now().
- updatedAt: DateTime, @updatedAt.
- transactions: Transaction[].
- @@unique([name, user_id]) garante nomes únicos por usuário.

#### Transaction
- id: String, UUID, primary key.
- name: String.
- value: Int, representando centavos.
- description: String?.
- type: Enum TransactionType (ENTRADA, SAIDA).
- disable: Boolean, default false.
- category_id: String, relação com Category.
- category: relação com onDelete: Cascade.
- user_id: String, relação com User.
- user: relação com onDelete: Cascade.
- createdAt: DateTime, default now().
- updatedAt: DateTime, @updatedAt.

### Enums
- Role: USER, ADMIN.
- TransactionType: ENTRADA, SAIDA.

## 10. Regras de Negócio Importantes

- O projeto usa Express 5 no modo CommonJS.
- O PrismaClient é instanciado com um adaptador PrismaPg e a variável DATABASE_URL.
- JWT_SECRET deve estar definido no arquivo .env.
- Os controllers não fazem hash nem comparação de senha; essa responsabilidade é dos services.
- A criação de categoria normaliza o nome para lowercase antes de salvar.
- As categorias são únicas por usuário através do índice composto @@unique([name, user_id]).
- A criação de transação exige que a categoria informada pertença ao usuário autenticado.
- As transações usam soft delete, ou seja, são marcadas com disable: true em vez de serem removidas fisicamente.
- O resumo financeiro soma entradas e saídas e calcula o saldo com base nas transações ativas.

## 11. Comandos úteis

- npm run dev — inicia o servidor em modo watch com tsx.
- npx prisma migrate dev — cria e aplica migrações do banco.
- npx prisma generate — gera o client Prisma.

---

Este documento resume a estrutura atual do backend, incluindo arquitetura, rotas, validações, middlewares, regras de negócio e modelagem de dados.