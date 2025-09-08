# API Documentation - Sistema de Autenticação e Gerenciamento de salas

## Endpoints de Autenticação

### POST /auth/login
Realiza o login do usuário e retorna um token JWT.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "João",
    "lastName": "Silva",
    "email": "usuario@exemplo.com",
    "accountType": "customer",
    "address": {
      "zipcode": "41260005",
      "city": "Salvador",
      "state": "Bahia",
      "street": "Rua Nova Cidade I",
      "number": "68",
      "district": "Canabrava",
      "complement": "CJ N Cidade"
    }
  }
}
```

### GET /auth/profile
Retorna o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

## Endpoints de Usuários

### POST /users
Cria um novo usuário (público).

### GET /users
Lista todos os usuários (apenas admins).

### GET /users/:id
Busca um usuário por ID (próprio usuário ou admin).

### PUT /users/:id
Atualiza um usuário (próprio usuário ou admin).

## Endpoints de Salas

### GET /rooms/available
Lista salas disponíveis (requer autenticação).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "number": "101",
    "availability": true,
    "createdAt": "2025-09-08T10:00:00.000Z",
    "updatedAt": "2025-09-08T10:00:00.000Z"
  }
]
```

### POST /rooms
Cria um novo sala (apenas admins).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "number": "101"
}
```

**Response (201):**
```json
{
  "id": 1,
  "number": "101",
  "availability": true,
  "createdAt": "2025-09-08T10:00:00.000Z",
  "updatedAt": "2025-09-08T10:00:00.000Z"
}
```

### GET /rooms
Lista todos os salas (requer autenticação).

**Headers:**
```
Authorization: Bearer <token>
```

### GET /rooms/:id
Busca um sala específico por ID (requer autenticação).

**Headers:**
```
Authorization: Bearer <token>
```

### PUT /rooms/:id
Atualiza um sala completamente (apenas admins).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "number": "102",
  "availability": false
}
```

### PATCH /rooms/:id/availability
Atualiza apenas a disponibilidade do sala (apenas admins).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "availability": false
}
```

### DELETE /rooms/:id
Remove um sala (apenas admins).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Room deleted successfully"
}
```

## Exemplos de uso com curl

```bash
# Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@exemplo.com",
    "accountType": "admin",
    "password": "senha123"
  }'

# Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'

# Criar sala (admin)
curl -X POST http://localhost:3000/rooms \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "101"
  }'

# Listar salas disponíveis
curl -X GET http://localhost:3000/rooms/available \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar disponibilidade do sala
curl -X PATCH http://localhost:3000/rooms/1/availability \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": false
  }'
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **401**: Não autorizado (token inválido/expirado)
- **403**: Acesso negado (sem permissão)
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor