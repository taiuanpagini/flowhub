# FlowHub - Sistema de Gestão de Equipamentos para Eventos

Sistema completo de gestão de equipamentos para eventos, com foco em rastreamento via QR Code, controle de estoque, solicitações de serviço e comunicação em tempo real.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Módulos e Perfis de Usuário](#módulos-e-perfis-de-usuário)
- [Credenciais de Acesso](#credenciais-de-acesso)
- [Fluxos Principais](#fluxos-principais)
- [APIs e Endpoints](#apis-e-endpoints)
- [Comunicação em Tempo Real](#comunicação-em-tempo-real)
- [Próximas Melhorias](#próximas-melhorias)

---

## 🎯 Sobre o Projeto

O **FlowHub** é uma solução desenvolvida para gerenciar equipamentos (champanheiras e cuspideiras) em eventos de degustação de vinhos. O sistema utiliza QR Codes para rastreamento de equipamentos e oferece dashboards específicos para diferentes perfis de usuários, incluindo expositores, operadores, supervisores, garçons e administradores.

### Características Principais

- ✅ **Gestão de Equipamentos com QR Code**: Rastreamento completo via leitura de QR Code
- ✅ **Múltiplos Perfis de Usuário**: Dashboards específicos para cada função
- ✅ **Comunicação em Tempo Real**: Atualizações instantâneas via SignalR
- ✅ **Interface Moderna e Responsiva**: Design profissional com Material-UI
- ✅ **Internacionalização**: Suporte a Português e Inglês
- ✅ **Geração Dinâmica de QR Codes**: Criação automática de códigos para clientes e equipamentos

---

## 🚀 Funcionalidades

### Módulo Expositor
- Visualização de kits contratados (champanheiras e cuspideiras)
- Solicitação de serviço de reposição de taças
- Acompanhamento de status das solicitações em tempo real
- Dashboard com indicadores de equipamentos disponíveis e retirados

### Módulo Operador
- Scanner de QR Code para registro de retirada e devolução de equipamentos
- Fluxo guiado de leitura de crachá e equipamento
- Validação de disponibilidade e regras de negócio
- Página de visualização/impressão de QR Codes para testes

### Módulo Supervisor (Cozinha)
- Painel Kanban para gestão de solicitações (Pendentes, Em Coleta, Hoje)
- Atribuição de garçons para solicitações
- Marcação de solicitações como concluídas
- Visualização de estatísticas em tempo real

### Módulo Garçom
- Lista de solicitações atribuídas
- Marcação de status (Em Coleta, Concluído)
- Atualizações automáticas via SignalR
- Indicadores visuais de prioridade

### Módulo Administrador
- Gestão de clientes e equipamentos
- Geração em lote de clientes mockados
- Geração em lote de equipamentos com QR Codes
- Limpeza de base de dados
- Visualização de estatísticas gerais

---

## 🛠 Tecnologias Utilizadas

### Backend
- **.NET 8** - Framework principal
- **ASP.NET Core** - Web API
- **SignalR** - Comunicação em tempo real
- **C#** - Linguagem de programação
- **JSON File Storage** - Persistência de dados (mock)

### Frontend
- **React 19.2.4** - Biblioteca UI
- **Vite** - Build tool e dev server
- **Material-UI (MUI)** - Biblioteca de componentes
- **Emotion** - CSS-in-JS
- **React Router Dom** - Roteamento
- **i18next** - Internacionalização
- **Axios** - Cliente HTTP
- **SignalR Client** - Cliente WebSocket
- **html5-qrcode** - Scanner de QR Code
- **react-qr-code** - Gerador de QR Code

### Ferramentas e Utilitários
- **npm** - Gerenciador de pacotes (frontend)
- **dotnet CLI** - Build e execução (backend)
- **PowerShell** - Scripts de automação

---

## 🏗 Arquitetura

### Arquitetura Geral

```
┌─────────────┐      HTTP/HTTPS      ┌─────────────┐
│   Frontend  │ ◄──────────────────► │   Backend   │
│   (React)   │      SignalR         │  (.NET 8)   │
└─────────────┘                      └─────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │  Mock Data  │
                                     │    (JSON)   │
                                     └─────────────┘
```

### Padrões Utilizados

- **RESTful API**: Endpoints organizados por recursos
- **Hub Pattern**: SignalR para comunicação bidirecional
- **Service Layer**: Isolamento de lógica de negócio
- **Component-Based**: React com componentes reutilizáveis
- **Context API**: Gerenciamento de estado global (autenticação)
- **Responsive Design**: Mobile-first com Material-UI

---

## 📦 Pré-requisitos

### Obrigatórios

- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)

### Recomendados

- **Visual Studio Code** - Editor de código
- **PowerShell** (Windows) - Para executar scripts
- Navegador moderno (Chrome, Firefox, Edge)
- Dispositivo com câmera (para testar scanner de QR Code)

---

## 💾 Instalação

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd FlowHub
```

### 2. Instale Dependências do Backend

```bash
cd backend
dotnet restore
```

### 3. Instale Dependências do Frontend

```bash
cd frontend
npm install
```

---

## ▶️ Como Executar

### Opção 1: Execução Automática (Recomendado - Windows)

Execute o script na raiz do projeto:

```bash
.\RUN_PROJECT.bat
```

Este script irá:
1. Iniciar o backend na porta 5024
2. Iniciar o frontend na porta 5173
3. Abrir o navegador automaticamente

### Opção 2: Execução Manual

#### Terminal 1 - Backend
```bash
cd backend
dotnet run
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### URLs de Acesso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5024/api
- **Swagger**: http://localhost:7042/swagger

---

## 📁 Estrutura do Projeto

```
FlowHub/
├── backend/
│   ├── Controllers/          # Controladores da API
│   │   ├── AuthController.cs
│   │   ├── CustomersController.cs
│   │   ├── EquipmentsController.cs
│   │   └── ServiceRequestsController.cs
│   ├── Data/
│   │   └── mock-data.json    # Dados mockados
│   ├── Hubs/
│   │   └── FlowHubHub.cs     # Hub SignalR
│   ├── Models/               # Modelos de dados
│   │   ├── Customer.cs
│   │   ├── Equipment.cs
│   │   ├── ServiceRequest.cs
│   │   ├── User.cs
│   │   └── Event.cs
│   ├── Services/
│   │   └── MockDataService.cs
│   └── Program.cs
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Layout.jsx
│   │   │   └── shared/
│   │   │       └── Card.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── i18n/
│   │   │   ├── i18n.js
│   │   │   └── locales/
│   │   │       ├── pt-BR.json
│   │   │       └── en-US.json
│   │   ├── modules/
│   │   │   ├── administrador/
│   │   │   │   └── pages/
│   │   │   │       └── Dashboard.jsx
│   │   │   ├── cozinha/
│   │   │   │   └── pages/
│   │   │   │       ├── PainelKanban.jsx
│   │   │   │       └── MinhasSolicitacoes.jsx
│   │   │   ├── expositor/
│   │   │   │   └── pages/
│   │   │   │       └── Dashboard.jsx
│   │   │   └── operador/
│   │   │       └── pages/
│   │   │           ├── Scanner.jsx
│   │   │           └── QRCodeGenerator.jsx
│   │   ├── pages/
│   │   │   └── Login.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/
│   │   │   ├── api.service.js
│   │   │   └── signalr.service.js
│   │   ├── theme/
│   │   │   └── theme.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                  # Variáveis de ambiente
│   └── package.json
│
├── RUN_PROJECT.bat          # Script de execução
└── README.md
```

---

## 👥 Módulos e Perfis de Usuário

### 1. Expositor
**Responsabilidade**: Cliente do evento que solicita serviços

**Funcionalidades**:
- Visualizar kits contratados
- Solicitar reposição de taças
- Acompanhar status das solicitações

**Rota**: `/expositor/dashboard`

---

### 2. Operador
**Responsabilidade**: Controlar entrada e saída de equipamentos

**Funcionalidades**:
- Registrar retirada de equipamentos via QR Code
- Registrar devolução de equipamentos
- Gerar e visualizar QR Codes para testes

**Rotas**: 
- `/operador/scanner`
- `/operador/qrcodes`

---

### 3. Supervisor (Cozinha)
**Responsabilidade**: Gerenciar solicitações e atribuir garçons

**Funcionalidades**:
- Visualizar painel Kanban de solicitações
- Atribuir garçons para solicitações
- Marcar solicitações como concluídas
- Ver estatísticas em tempo real

**Rota**: `/cozinha/painel`

---

### 4. Garçom
**Responsabilidade**: Executar solicitações de serviço

**Funcionalidades**:
- Ver solicitações atribuídas
- Marcar como "Em Coleta"
- Marcar como "Concluído"
- Receber notificações em tempo real

**Rota**: `/cozinha/minhas-solicitacoes`

---

### 5. Administrador
**Responsabilidade**: Gerenciar dados mestres do sistema

**Funcionalidades**:
- Gerenciar clientes
- Gerenciar equipamentos
- Gerar clientes e equipamentos em lote
- Limpar base de dados
- Ver estatísticas gerais

**Rota**: `/admin/dashboard`

---

## 🔐 Credenciais de Acesso

| Perfil | Usuário | Senha |
|--------|---------|-------|
| **Expositor** | `expositor` | `123456` |
| **Operador** | `operador` | `123456` |
| **Supervisor** | `supervisor` | `123456` |
| **Garçom** | `garcom` | `123456` |
| **Administrador** | `admin` | `123456` |

---

## 🔄 Fluxos Principais

### Fluxo 1: Retirada de Equipamento

```
1. Operador → Clica em "Registrar Retirada"
2. Sistema → Abre câmera para escanear crachá do expositor
3. Operador → Escaneia QR Code do crachá
4. Sistema → Valida cliente e exibe informações
5. Sistema → Abre câmera para escanear equipamento
6. Operador → Escaneia QR Code do equipamento
7. Sistema → Valida disponibilidade e saldo do cliente
8. Operador → Confirma retirada
9. Sistema → Registra retirada e atualiza saldo
10. Sistema → Notifica dashboards via SignalR
```

### Fluxo 2: Devolução de Equipamento

```
1. Operador → Clica em "Registrar Devolução"
2. Sistema → Abre câmera para escanear crachá
3. Operador → Escaneia QR Code do crachá
4. Sistema → Lista equipamentos do cliente
5. Operador → Clica em "Escanear Equipamento"
6. Sistema → Abre câmera para escanear equipamento
7. Operador → Escaneia QR Code do equipamento
8. Sistema → Valida que equipamento pertence ao cliente
9. Operador → Confirma devolução
10. Sistema → Registra devolução e atualiza saldo
```

### Fluxo 3: Solicitação de Serviço

```
1. Expositor → Solicita reposição de taças
2. Sistema → Cria solicitação com status "Pending"
3. Sistema → Notifica Supervisor via SignalR
4. Supervisor → Visualiza no painel Kanban (coluna Pendentes)
5. Supervisor → Atribui garçom à solicitação
6. Sistema → Notifica garçom via SignalR
7. Garçom → Visualiza em "Minhas Solicitações"
8. Garçom → Marca como "Em Coleta"
9. Sistema → Move para coluna "Em Coleta" no Kanban
10. Garçom → Marca como "Concluído"
11. Sistema → Move para coluna "Hoje" (concluídos)
12. Sistema → Notifica expositor da conclusão
```

---

## 🔌 APIs e Endpoints

### Auth
- `POST /api/auth/login` - Autenticação de usuário

### Customers
- `GET /api/customers` - Listar todos os clientes
- `GET /api/customers/{id}` - Buscar cliente por ID
- `POST /api/customers` - Criar novo cliente
- `PUT /api/customers/{id}` - Atualizar cliente
- `DELETE /api/customers/{id}` - Deletar cliente
- `POST /api/customers/generate-mock` - Gerar 3 clientes de teste
- `DELETE /api/customers/clear-all` - Limpar todos os clientes

### Equipments
- `GET /api/equipments` - Listar todos os equipamentos
- `GET /api/equipments/{id}` - Buscar equipamento por ID
- `GET /api/equipments/customer/{customerId}` - Listar equipamentos de um cliente
- `POST /api/equipments/pickup` - Registrar retirada
- `POST /api/equipments/return` - Registrar devolução
- `POST /api/equipments/generate` - Gerar equipamentos em lote
- `DELETE /api/equipments/clear-all` - Limpar todos os equipamentos

### Service Requests
- `GET /api/servicerequests` - Listar todas as solicitações
- `GET /api/servicerequests/{id}` - Buscar solicitação por ID
- `GET /api/servicerequests/customer/{customerId}` - Listar solicitações de um cliente
- `GET /api/servicerequests/waiter/{waiterId}` - Listar solicitações de um garçom
- `POST /api/servicerequests` - Criar nova solicitação
- `POST /api/servicerequests/{id}/assign` - Atribuir garçom
- `POST /api/servicerequests/{id}/pickup` - Marcar como "Em Coleta"
- `POST /api/servicerequests/{id}/complete` - Marcar como "Concluído"

---

## 📡 Comunicação em Tempo Real

O sistema utiliza **SignalR** para comunicação bidirecional entre servidor e clientes.

### Eventos SignalR

#### Enviados pelo Servidor:

1. **NewServiceRequest**
   - Disparado quando uma nova solicitação é criada
   - Recebido por: Supervisor, Dashboard do Expositor

2. **ServiceRequestAssigned**
   - Disparado quando um garçom é atribuído
   - Recebido por: Garçom atribuído, Supervisor

3. **ServiceRequestUpdated**
   - Disparado quando status da solicitação muda
   - Recebido por: Expositor, Garçom, Supervisor

4. **ServiceRequestCompleted**
   - Disparado quando solicitação é concluída
   - Recebido por: Expositor, Garçom, Supervisor

### Configuração SignalR

**Backend** (`Program.cs`):
```csharp
builder.Services.AddSignalR();
// ...
app.MapHub<FlowHubHub>("/hubs/flowhub");
```

**Frontend** (`signalr.service.js`):
```javascript
const connection = new HubConnectionBuilder()
  .withUrl(`${API_URL}/hubs/flowhub`)
  .withAutomaticReconnect()
  .build();
```

---

## 🧪 Como Testar

### 1. Configurar Base de Dados

1. Faça login como **Admin** (`admin` / `123456`)
2. Na aba "Customers", clique em **"Limpar Todos"** (se houver dados)
3. Clique em **"Gerar 3 Clientes"**
4. Na aba "Equipments", clique em **"Limpar Todos"** (se houver dados)
5. Clique em **"Gerar Equipamentos"**:
   - Selecione **Champagne**
   - Quantidade: **10**
   - Clique em **"Gerar"**
6. Repita o passo 5 para **Spittoon** (Cuspideira)

### 2. Visualizar QR Codes

1. Faça login como **Operador** (`operador` / `123456`)
2. Clique no botão **"QR Codes"** no cabeçalho
3. Visualize os QR Codes gerados:
   - Aba "Crachás dos Clientes": QR Codes dos expositores
   - Aba "Equipamentos": QR Codes dos equipamentos

**Dica**: Abra esta página no celular para simular leitura real com a câmera!

### 3. Testar Scanner de QR Code

1. Com a página de QR Codes aberta em um dispositivo
2. Faça login como **Operador** em outro dispositivo
3. Acesse **Scanner**
4. Clique em **"Registrar Retirada"**
5. Aponte a câmera para um QR Code de crachá
6. Depois aponte para um QR Code de equipamento
7. Confirme a retirada

### 4. Testar Fluxo de Solicitação

1. Faça login como **Expositor** (`expositor` / `123456`)
2. Clique em **"Solicitar Serviço"**
3. Informe a quantidade de taças
4. Envie a solicitação

5. Em outra aba/janela, faça login como **Supervisor** (`supervisor` / `123456`)
6. Veja a solicitação aparecer automaticamente no painel Kanban
7. Clique em **"Atribuir Garçom"** e selecione um garçom

8. Em outra aba/janela, faça login como **Garçom** (`garcom` / `123456`)
9. Veja a solicitação aparecer automaticamente em "Minhas Solicitações"
10. Clique em **"Marcar como Em Coleta"**
11. Depois clique em **"Marcar como Concluído"**

12. Observe as atualizações em tempo real em todas as telas abertas!

---

## 🎨 Paleta de Cores

O sistema utiliza uma paleta personalizada focada em elegância e profissionalismo:

```css
--primary: #B61E3F       /* Vinho escuro */
--secondary: #779C65     /* Verde oliva */
--accent: #E94B62        /* Vermelho rosado */
--background: #FFFFFF    /* Branco */
--surface: #EEEEEE       /* Cinza claro */
--text: #000000          /* Preto */
--text-secondary: #5C5C5C /* Cinza médio */
```

---

## 🔮 Próximas Melhorias

### Funcionalidades
- [ ] Autenticação JWT completa
- [ ] Banco de dados real (SQL Server / PostgreSQL)
- [ ] Histórico de movimentações
- [ ] Relatórios e dashboards analíticos
- [ ] Notificações push
- [ ] Múltiplos eventos simultâneos
- [ ] Sistema de permissões granular
- [ ] Impressão de etiquetas QR Code

### Técnicas
- [ ] Testes unitários e de integração
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Logging estruturado
- [ ] Monitoramento e observabilidade
- [ ] Cache distribuído (Redis)
- [ ] API Rate Limiting
- [ ] Documentação OpenAPI/Swagger completa

### UX/UI
- [ ] Modo escuro
- [ ] Animações e transições
- [ ] Tutorial interativo (onboarding)
- [ ] Acessibilidade (WCAG 2.1)
- [ ] PWA (Progressive Web App)
- [ ] Suporte offline

---

## 📝 Licença

Este projeto é um POC (Proof of Concept) desenvolvido para fins de demonstração.

---

## 👨‍💻 Autor

Desenvolvido como parte de um projeto de POC para gestão de equipamentos em eventos.

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Consulte os logs do backend e frontend
3. Verifique se as portas 5024 e 5173 estão disponíveis
4. Certifique-se de que as dependências foram instaladas corretamente

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026
