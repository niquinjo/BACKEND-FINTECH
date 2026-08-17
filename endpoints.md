# Endpoints do Projeto Financeiro

Este arquivo reúne todos os endpoints do backend, incluindo método HTTP, autenticação, estrutura de requisição, parâmetros, exemplos e respostas esperadas.

## Base URL

http://localhost:3333

## Cabeçalhos comuns

- Content-Type: application/json
- Authorization: Bearer <token> (nas rotas protegidas)

---

## 1. Usuários

### POST /users
Cria um novo usuário.

#### Propriedades
- Autenticação: não é necessária.
- Body:
  - name: string, obrigatório, mínimo 3 caracteres.
  - email: string, obrigatório, formato de e-mail válido.
  - password: string, obrigatório, mínimo 6 caracteres.

#### Exemplo de requisição
```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456"
}
```

#### Exemplo de resposta (201/200)
```json
{
  "id": "7d6f0a4d-0b2e-4f91-b97a-9e0ff8df12b3",
  "name": "Maria Silva",
  "email": "maria@email.com",
  "role": "USER",
  "createdAt": "2026-07-13T10:00:00.000Z"
}
```

#### Possíveis erros
- 400: e-mail inválido, senha curta ou nome curto.
- 400: usuário já existe.

---

### POST /session
Autentica um usuário e gera um token JWT.

#### Propriedades
- Autenticação: não é necessária.
- Body:
  - email: string, obrigatório.
  - password: string, obrigatório.

#### Exemplo de requisição
```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

#### Exemplo de resposta
```json
{
  "id": "7d6f0a4d-0b2e-4f91-b97a-9e0ff8df12b3",
  "name": "Maria Silva",
  "email": "maria@email.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Possíveis erros
- 400: e-mail inválido.
- 400: email/senha incorretos.

---

### GET /me
Retorna os dados do usuário autenticado.

#### Propriedades
- Autenticação: obrigatória.
- Header:
  - Authorization: Bearer <token>

#### Exemplo de requisição
```http
GET /me
Authorization: Bearer <token>
```

#### Exemplo de resposta
```json
{
  "id": "7d6f0a4d-0b2e-4f91-b97a-9e0ff8df12b3",
  "name": "Maria Silva",
  "email": "maria@email.com",
  "role": "USER",
  "createdAt": "2026-07-13T10:00:00.000Z"
}
```

#### Possíveis erros
- 401: token não fornecido.
- 401: token inválido.

---

## 2. Categorias

### POST /category
Cria uma nova categoria para o usuário autenticado.

#### Propriedades
- Autenticação: obrigatória.
- Body:
  - name: string, obrigatório, mínimo 2 caracteres.

#### Exemplo de requisição
```json
{
  "name": "Alimentação"
}
```

#### Exemplo de resposta
```json
{
  "id": "aef2df6b-876c-4a21-b9e0-9bd9a2dd10fc",
  "name": "alimentação",
  "createdAt": "2026-07-13T10:05:00.000Z"
}
```

#### Regras de negócio
- O nome é convertido para lowercase antes de salvar.
- Não pode existir outra categoria igual para o mesmo usuário.

#### Possíveis erros
- 401: token inválido.
- 400: nome inválido.
- 400: categoria já existe para o usuário.

---

### GET /category
Lista as categorias do usuário autenticado.

#### Propriedades
- Autenticação: obrigatória.

#### Exemplo de requisição
```http
GET /category
Authorization: Bearer <token>
```

#### Exemplo de resposta
```json
[
  {
    "id": "aef2df6b-876c-4a21-b9e0-9bd9a2dd10fc",
    "name": "alimentação",
    "createdAt": "2026-07-13T10:05:00.000Z",
    "updatedAt": "2026-07-13T10:05:00.000Z"
  }
]
```

---

## 3. Transações

### POST /transaction
Cria uma nova transação vinculada a uma categoria do usuário autenticado.

#### Propriedades
- Autenticação: obrigatória.
- Body:
  - name: string, obrigatório.
  - value: number inteiro, obrigatório, representa centavos.
  - description: string, obrigatório.
  - category_id: string UUID, obrigatório.
  - type: string, obrigatório, valores aceitos: ENTRADA ou SAIDA.

#### Exemplo de requisição
```json
{
  "name": "Supermercado",
  "value": 1250,
  "description": "Compras da semana",
  "category_id": "aef2df6b-876c-4a21-b9e0-9bd9a2dd10fc",
  "type": "SAIDA"
}
```

#### Exemplo de resposta
```json
{
  "id": "0c79f224-8200-4688-9f67-bf0e9fdc4ca5",
  "name": "Supermercado",
  "value": 1250,
  "description": "Compras da semana",
  "category_id": "aef2df6b-876c-4a21-b9e0-9bd9a2dd10fc",
  "type": "SAIDA",
  "createdAt": "2026-07-13T10:10:00.000Z"
}
```

#### Regras de negócio
- A categoria informada deve pertencer ao usuário autenticado.
- O valor é tratado em centavos.

#### Possíveis erros
- 401: token inválido.
- 400: categoria não encontrada.
- 400: dados inválidos de validação.

---

### GET /transaction
Lista as transações do usuário autenticado.

#### Propriedades
- Autenticação: obrigatória.
- Query params:
  - disable: opcional, valores true ou false.

#### Exemplo de requisição
```http
GET /transaction?disable=false
Authorization: Bearer <token>
```

#### Exemplo de resposta
```json
[
  {
    "id": "0c79f224-8200-4688-9f67-bf0e9fdc4ca5",
    "name": "Supermercado",
    "value": 1250,
    "description": "Compras da semana",
    "type": "SAIDA",
    "disable": false,
    "category_id": "aef2df6b-876c-4a21-b9e0-9bd9a2dd10fc",
    "createdAt": "2026-07-13T10:10:00.000Z",
    "updatedAt": "2026-07-13T10:10:00.000Z",
    "category": {
      "name": "alimentação"
    }
  }
]
```

---

### GET /category/transaction
Lista as transações de uma categoria específica.

#### Propriedades
- Autenticação: obrigatória.
- Query params:
  - category_id: obrigatório, UUID da categoria.

#### Exemplo de requisição
```http
GET /category/transaction?category_id=aef2df6b-876c-4a21-b9e0-9bd9a2dd10fc
Authorization: Bearer <token>
```

#### Exemplo de resposta
```json
[
  {
    "id": "0c79f224-8200-4688-9f67-bf0e9fdc4ca5",
    "name": "Supermercado",
    "value": 1250,
    "description": "Compras da semana",
    "type": "SAIDA",
    "disable": false,
    "category_id": "aef2df6b-876c-4a21-b9e0-9bd9a2dd10fc",
    "createdAt": "2026-07-13T10:10:00.000Z",
    "updatedAt": "2026-07-13T10:10:00.000Z"
  }
]
```

---

### DELETE /transaction
Realiza soft delete de uma transação.

#### Propriedades
- Autenticação: obrigatória.
- Query params:
  - transaction_id: obrigatório, UUID da transação.

#### Exemplo de requisição
```http
DELETE /transaction?transaction_id=0c79f224-8200-4688-9f67-bf0e9fdc4ca5
Authorization: Bearer <token>
```

#### Exemplo de resposta
```json
{
  "message": "Transação desativada com sucesso!"
}
```

#### Regras de negócio
- A transação é marcada com disable: true, não sendo removida fisicamente do banco.

#### Possíveis erros
- 401: token inválido.
- 400: transação não encontrada ou sem permissão.

---

### GET /transaction/summary
Retorna um resumo financeiro do usuário autenticado.

#### Propriedades
- Autenticação: obrigatória.
- Query params opcionais:
  - startDate: data inicial do filtro.
  - endDate: data final do filtro.

#### Exemplo de requisição
```http
GET /transaction/summary?startDate=2026-01-01&endDate=2026-12-31
Authorization: Bearer <token>
```

#### Exemplo de resposta
```json
{
  "entradas": 5000,
  "saidas": 3200,
  "saldo": 1800
}
```

---

## 4. Códigos de erro comuns

- 400: erro de validação de schema.
- 401: token ausente ou inválido.
- 500: erro interno do servidor.

Exemplo de resposta de erro:
```json
{
  "error": "Erro de validação",
  "details": [
    {
      "mensagem": "O nome deve conter no mínimo 3 caracteres"
    }
  ]
}
```

---

## 5. Observações de uso

- Todas as rotas protegidas exigem o header Authorization.
- O valor de transações é armazenado em centavos.
- O resumo financeiro soma apenas as transações ativas (disable: false).
- As categorias são únicas por usuário.
