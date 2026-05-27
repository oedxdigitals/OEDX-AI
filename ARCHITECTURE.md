# OEDX AI - Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                    │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────┐           │
│  │   Chat UI    │  │ Sidebar  │  │   Settings   │           │
│  └──────────────┘  └──────────┘  └──────────────┘           │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                    │                                         │
│           ┌────────▼────────┐                               │
│           │   Zustand Store │                               │
│           │   (Chat State)  │                               │
│           └────────┬────────┘                               │
│                    │                                         │
│           ┌────────▼────────┐                               │
│           │  API Client     │                               │
│           │  (Axios)        │                               │
│           └────────┬────────┘                               │
└────────────────────┼──────────────────────────────────────┘
                     │ HTTP/WebSocket
                     │
          ┌──────────▼──────────┐
          │  CORS Middleware    │
          └──────────┬──────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│               Backend (Python FastAPI)                     │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────┐         │
│  │ Health Check │  │ Chat API │  │ Conversation │         │
│  └──────────────┘  └──────────┘  └──────────────┘         │
│         │                │                │                │
│         └────────────────┴────────────────┘                │
│                    │                                       │
│           ┌────────▼────────┐                             │
│           │  AI Service     │                             │
│           │  (OpenAI)       │                             │
│           └────────┬────────┘                             │
│                    │                                       │
│           ┌────────▼────────┐                             │
│           │ Database Service│                             │
│           │ (SQLAlchemy)    │                             │
│           └────────┬────────┘                             │
└────────────────────┼─────────────────────────────────────┘
                     │
        ┌────────────┬────────────┐
        │            │            │
    ┌───▼───┐  ┌────▼─────┐  ┌───▼────┐
    │OpenAI │  │ SQLite   │  │ Render │
    │  API  │  │Database  │  │ FileIO │
    └───────┘  └──────────┘  └────────┘
```

## Component Architecture

### Frontend Components

```
App (Layout)
├── Header
│   └── Logo & Title
├── Sidebar
│   ├── New Chat Button
│   ├── Conversation List
│   └── Settings
├── Main Content
│   ├── MessagesContainer
│   │   ├── Message (User)
│   │   ├── Message (Assistant)
│   │   └── Streaming Indicator
│   └── ChatInput
└── Footer
    └── Status Bar
```

### State Management

```
Zustand Store (useChatStore)
├── Conversations
│   ├── List
│   ├── Current ID
│   └── Actions
├── Messages
│   ├── Current Messages
│   └── Streaming State
└── UI State
    ├── Loading
    ├── Error
    └── Sidebar Open
```

### Data Flow

```
User Input
    │
    ├─► ChatInput Component
    │       │
    │       └─► onSubmit() handler
    │               │
    │               ├─► addMessage() to store (User)
    │               │
    │               └─► API Call
    │                   │
    │                   ├─► /api/chat/completions/stream
    │                   │
    │                   ├─► onToken() callback
    │                   │   └─► Update streaming content
    │                   │
    │                   └─► onEnd() callback
    │                       └─► Add complete message to store
    │
    └─► MessagesContainer re-renders
        └─► Displays all messages
```

## Data Models

### Conversation
```python
{
    "id": "uuid",
    "title": "What is AI?",
    "model": "gpt-4-turbo-preview",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
}
```

### Message
```python
{
    "id": "uuid",
    "conversation_id": "uuid",
    "role": "user|assistant|system",
    "content": "Hello, world!",
    "tokens": 5,
    "created_at": "2024-01-01T00:00:00Z"
}
```

## Streaming Architecture

### Server-Sent Events (SSE) Flow

```
1. Client sends ChatCompletionRequest
2. Backend validates conversation
3. Backend saves user message
4. Backend retrieves conversation history
5. Backend opens OpenAI streaming connection
6. For each token from OpenAI:
   - Send SSE: { event: "token", token: "..." }
7. When complete:
   - Save assistant message
   - Send SSE: { event: "end", message_id: "..." }
8. Client receives tokens and updates UI in real-time
```

### Browser Implementation

```typescript
1. Fetch with streaming enabled
2. Get response.body as ReadableStream
3. Create TextDecoder
4. While stream not done:
   - Read chunk
   - Decode chunk
   - Parse SSE format
   - Extract token
   - Update UI
```

## Database Schema

### Conversations Table
```sql
CREATE TABLE conversations (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    model VARCHAR DEFAULT 'gpt-4-turbo-preview',
    status VARCHAR DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id VARCHAR PRIMARY KEY,
    conversation_id VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    content TEXT NOT NULL,
    tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

## API Routes

### Conversations
- `POST /api/conversations` - Create
- `GET /api/conversations` - List
- `GET /api/conversations/{id}` - Get with messages
- `PATCH /api/conversations/{id}` - Update
- `DELETE /api/conversations/{id}` - Delete
- `POST /api/conversations/{id}/archive` - Archive

### Chat
- `POST /api/chat/completions` - Non-streaming
- `POST /api/chat/completions/stream` - Streaming (SSE)

### Health
- `GET /api/health` - Health check
- `GET /api/info` - API info

## Performance Optimizations

1. **Frontend**
   - Code splitting by route
   - Image lazy loading
   - Message virtualization for large histories
   - Memoization of components
   - Debounced search

2. **Backend**
   - Async/await for I/O
   - Connection pooling
   - Query optimization
   - Caching layer (future)
   - Rate limiting (future)

3. **Network**
   - Streaming for large responses
   - Gzip compression
   - HTTP/2 support
   - CDN for static assets

## Error Handling

### Frontend
```typescript
Try-Catch blocks for:
- API calls
- State updates
- File operations
- Local storage access

Toast notifications for:
- Success messages
- Error messages
- Loading states
```

### Backend
```python
Global exception handler for:
- Database errors
- API errors
- Validation errors
- Rate limiting

Logging for:
- Request/response
- Errors
- Performance metrics
```

## Security Considerations

1. **API Security**
   - CORS configuration
   - Input validation
   - SQL injection prevention (SQLAlchemy)
   - Rate limiting (planned)

2. **Data Protection**
   - Environment variables for secrets
   - No passwords stored (OAuth planned)
   - Secure headers
   - HTTPS in production

3. **Client Security**
   - XSS prevention
   - CSRF protection
   - Secure storage (localStorage)
   - Content Security Policy (planned)

## Scalability Roadmap

### Phase 1 (Current)
- Single instance frontend & backend
- SQLite database
- Basic error handling

### Phase 2
- Multiple backend instances
- PostgreSQL database
- Caching layer (Redis)
- WebSocket support

### Phase 3
- Microservices architecture
- Message queue (Celery)
- File storage (S3)
- Search engine (Elasticsearch)

### Phase 4
- AI model fine-tuning
- Custom models
- Plugin system
- Analytics dashboard

---

**Architecture Design Complete!** 🏗️
