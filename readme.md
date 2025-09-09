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

## Endpoints de Agendamentos

### GET /schedules/upcoming
Lista próximos agendamentos (máximo 10).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "scheduleDate": "2025-09-15T14:00:00.000Z",
    "userId": 1,
    "roomId": 1,
    "status": "confirmed",
    "createdAt": "2025-09-08T10:00:00.000Z",
    "updatedAt": "2025-09-08T10:00:00.000Z"
  }
]
```

### GET /schedules/my-schedules
Lista agendamentos do usuário logado.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filtrar por status (pending, confirmed, cancelled)
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)

### POST /schedules
Cria um novo agendamento.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "scheduleDate": "2025-09-15T14:00:00.000Z",
  "roomId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "scheduleDate": "2025-09-15T14:00:00.000Z",
  "userId": 1,
  "roomId": 1,
  "status": "pending",
  "createdAt": "2025-09-08T10:00:00.000Z",
  "updatedAt": "2025-09-08T10:00:00.000Z"
}
```

**Validações:**
- Data deve ser no futuro
- Sala deve existir e estar disponível
- Não pode haver conflito de horário

### GET /schedules
Lista agendamentos (com filtros opcionais).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filtrar por status (pending, confirmed, cancelled)
- `roomId` - Filtrar por sala
- `userId` - Filtrar por usuário (apenas admin)
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)

**Exemplo:**
```
GET /schedules?status=confirmed&startDate=2025-09-01&endDate=2025-09-30
```

### GET /schedules/:id
Busca um agendamento específico por ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Permissões:** Apenas próprio usuário ou admin

### PUT /schedules/:id
Atualiza um agendamento.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "scheduleDate": "2025-09-16T15:00:00.000Z",
  "roomId": 2
}
```

**Restrições:**
- Apenas próprio usuário ou admin
- Não pode atualizar agendamento confirmado (apenas admin)

### PATCH /schedules/:id/status
Atualiza status do agendamento (apenas admins).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Status válidos:** `pending`, `confirmed`, `cancelled`

### PATCH /schedules/:id/cancel
Cancela um agendamento.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Schedule cancelled successfully",
  "schedule": {
    "id": 1,
    "status": "cancelled"
  }
}
```

### DELETE /schedules/:id
Remove um agendamento.

**Headers:**
```
Authorization: Bearer <token>
```

**Restrições:**
- Apenas próprio usuário ou admin
- Não pode deletar agendamento confirmado (apenas admin)

## Endpoints de Logs

⚠️ **Nota**: Apenas administradores podem visualizar logs. Usuários comuns podem criar logs, mas não visualizá-los.

### GET /logs/summary
Retorna resumo dos logs (total, por módulo, últimos 7 dias) - **Apenas Admins**.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "summary": {
    "totalLogs": 125,
    "recentLogs": 45,
    "byModule": [
      { "module": "Auth", "count": "50" },
      { "module": "Schedule", "count": "35" },
      { "module": "Account", "count": "40" }
    ]
  }
}
```

### GET /logs/my-logs
Lista logs do admin logado - **Apenas Admins**.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `module` - Filtrar por módulo (Auth, Schedule, Account)
- `activityType` - Filtrar por tipo de atividade (Login, Logout, Criar Agendamento, etc.)
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)
- `limit` - Limite de resultados (padrão: 50)

### GET /logs/module/:module
Lista logs por módulo específico - **Apenas Admins**.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Parâmetros válidos:** `Auth`, `Schedule`, `Account`

**Query Parameters:**
- `activityType` - Filtrar por tipo de atividade específica
- `userId` - Filtrar por usuário
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)
- `limit` - Limite de resultados (padrão: 50)

### POST /logs
Cria um novo log de atividade - **Todos os usuários autenticados**.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "module": "Auth",
  "activityType": "Login"
}
```

**Response (201):**
```json
{
  "message": "Log created successfully",
  "log": {
    "id": 1,
    "userId": 1,
    "module": "Auth",
    "activityType": "Login",
    "activityDate": "2025-09-09T10:00:00.000Z",
    "createdAt": "2025-09-09T10:00:00.000Z",
    "updatedAt": "2025-09-09T10:00:00.000Z"
  }
}
```

**Módulos válidos:** `Auth`, `Schedule`, `Account`

**Exemplos de activityType:**
- **Auth**: "Login", "Logout", "Atualização de E-mail", "Atualização de Senha"
- **Schedule**: "Criar Agendamento", "Atualizar Agendamento", "Cancelar Agendamento", "Alterar Status do Agendamento"
- **Account**: "Criar Usuário", "Atualizar Perfil", "Alterar Tipo de Conta"

### GET /logs
Lista todos os logs (com filtros) - **Apenas Admins**.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `module` - Filtrar por módulo (Auth, Schedule, Account)
- `activityType` - Filtrar por tipo de atividade (Login, Logout, Criar Agendamento, etc.)
- `userId` - Filtrar por usuário
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)
- `limit` - Limite de resultados (padrão: 50)

**Permissões:**
- **Usuários**: Podem apenas criar logs
- **Admins**: Podem ver todos os logs e filtrar por usuário

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

# Criar agendamento
curl -X POST http://localhost:3000/schedules \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduleDate": "2025-09-15T14:00:00.000Z",
    "roomId": 1
  }'

# Listar meus agendamentos
curl -X GET http://localhost:3000/schedules/my-schedules \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Confirmar agendamento (admin)
curl -X PATCH http://localhost:3000/schedules/1/status \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'

# Cancelar agendamento
curl -X PATCH http://localhost:3000/schedules/1/cancel \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Listar agendamentos com filtros
curl -X GET "http://localhost:3000/schedules?status=confirmed&startDate=2025-09-01&endDate=2025-09-30" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Próximos agendamentos
curl -X GET http://localhost:3000/schedules/upcoming \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Criar log de atividade
curl -X POST http://localhost:3000/logs \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "module": "Auth",
    "activityType": "Login"
  }'

# Listar meus logs
curl -X GET http://localhost:3000/logs/my-logs \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Resumo dos logs
curl -X GET http://localhost:3000/logs/summary \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Logs por módulo com filtro de atividade
curl -X GET "http://localhost:3000/logs/module/Auth?activityType=Login" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Listar logs com filtros (admin)
curl -X GET "http://localhost:3000/logs?module=Schedule&activityType=Criar%20Agendamento&startDate=2025-09-01&endDate=2025-09-30&limit=100" \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **401**: Não autorizado (token inválido/expirado)
- **403**: Acesso negado (sem permissão)
- **404**: Recurso não encontrado
- **409**: Conflito (recurso já existe ou conflito de horário)
- **500**: Erro interno do servidor

## Sistema de Agendamentos

### Status de Agendamento

| Status | Descrição |
|--------|-----------|
| `pending` | Agendamento criado, aguardando confirmação |
| `confirmed` | Agendamento confirmado pelo admin |
| `cancelled` | Agendamento cancelado |

### Regras de Negócio

1. **Conflito de Horário**: Não é possível agendar o mesmo sala para o mesmo horário
2. **Data Futura**: Agendamentos só podem ser feitos para datas futuras
3. **Disponibilidade**: Só é possível agendar salas disponíveis
4. **Confirmação**: Apenas admins podem confirmar agendamentos
5. **Edição**: Agendamentos confirmados só podem ser editados por admins
6. **Cancelamento**: Usuários podem cancelar seus próprios agendamentos

### Permissões por Tipo de Usuário

#### Customer (Usuário comum):
- ✅ Criar agendamentos
- ✅ Ver seus próprios agendamentos
- ✅ Atualizar seus agendamentos (se não confirmados)
- ✅ Cancelar seus agendamentos
- ❌ Ver agendamentos de outros usuários
- ❌ Confirmar agendamentos

#### Admin (Administrador):
- ✅ Todas as permissões de customer
- ✅ Ver todos os agendamentos
- ✅ Confirmar/cancelar qualquer agendamento
- ✅ Atualizar qualquer agendamento
- ✅ Deletar agendamentos confirmados

## Estrutura do Banco de Dados

### Users
- `id` (Primary Key)
- `firstName` (String)
- `lastName` (String)
- `email` (String, Unique)
- `accountType` (Enum: 'customer', 'admin')
- `address` (JSON)
- `password` (String, Hash)

### Rooms
- `id` (Primary Key)
- `number` (String, Unique)
- `availability` (Boolean)

### Schedules
- `id` (Primary Key)
- `scheduleDate` (DateTime)
- `userId` (Foreign Key → Users)
- `roomId` (Foreign Key → Rooms)
- `status` (Enum: 'pending', 'confirmed', 'cancelled')

### Logs
- `id` (Primary Key)
- `userId` (Foreign Key → Users)
- `module` (Enum: 'Account', 'Schedule', 'Auth')
- `activityType` (String - Descrição específica da atividade)
- `activityDate` (DateTime)

## Sistema de Logs

### Módulos de Log

| Módulo | Descrição |
|--------|-----------|
| `Auth` | Logs de autenticação (login, logout, etc.) |
| `Schedule` | Logs de agendamentos (criar, editar, cancelar) |
| `Account` | Logs de conta (criação, edição de perfil) |

### Características dos Logs

- **Apenas Criação**: Logs são apenas criados, nunca editados ou deletados
- **Automático**: Podem ser criados automaticamente pelo sistema através de middlewares
- **Auditoria**: Permitem rastreamento detalhado de atividades dos usuários
- **Filtros**: Podem ser filtrados por módulo, tipo de atividade, usuário, data
- **Permissões**: Apenas admins podem visualizar logs, usuários podem apenas criar
- **ActivityType**: Campo livre para descrever especificamente a ação realizada

### Log Automático por Middleware

O sistema possui middleware que cria logs automaticamente para ações importantes:

- **Login/Logout**: Registra automaticamente tentativas de autenticação
- **CRUD Operations**: Registra criação, edição e exclusão de recursos
- **Status Changes**: Registra mudanças de status em agendamentos

**Exemplos de activityType automáticos:**
- `"Login"` - Usuario fez login no sistema
- `"Logout"` - Usuario fez logout
- `"Criar Agendamento"` - Novo agendamento foi criado
- `"Atualizar Agendamento"` - Agendamento foi modificado
- `"Cancelar Agendamento"` - Agendamento foi cancelado
- `"Criar Quarto"` - Novo quarto foi criado
- `"Atualizar Quarto"` - Quarto foi modificado
- `"Alterar Disponibilidade do Quarto"` - Disponibilidade foi alterada

## Tecnologias Utilizadas

- **Node.js** com Express.js
- **Sequelize** (ORM)
- **MySQL** (Banco de dados)
- **JWT** (Autenticação)
- **bcryptjs** (Hash de senhas)
- **Jest** (Testes)

## Instalação e Execução

1. Clone o repositório e instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Execute o servidor:
```bash
npm run dev
```

4. Execute os testes:
```bash
npm test
```