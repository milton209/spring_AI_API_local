# Spring AI + React (CRA) Chat

A simple full-stack setup integrating a Spring Boot backend (Spring AI + Ollama) with a React (Create React App) frontend for chatting with an AI model. The frontend renders responses with Markdown for better readability and keeps a local conversation history.

## Features
- Chat with AI via backend GET endpoint
- Markdown rendering (headings, lists, code blocks, links) with GFM
- Local conversation history persisted in the browser (localStorage)
- Ready for future server-side conversation history and streaming

## What Is “Streaming”?
- Streaming delivers model output as it’s generated, chunk by chunk, instead of waiting for the full response.
- Benefits: faster perceived response, better UX for long outputs.
- Backend options to add:
  - Server-Sent Events (SSE) or WebFlux `Flux<String>` for HTTP streaming
  - WebSocket for bidirectional updates
- Current project uses synchronous responses only (no streaming yet). To add streaming, expose an SSE endpoint and update the frontend to consume an event stream.

## Conversation History
- Frontend keeps history locally using `localStorage` for convenience.
- For durable, shareable history:
  - Add backend endpoints to persist conversations (e.g., `/conversations`, `/messages`)
  - Store user/session identifiers and timestamps
  - Secure access control when users authenticate

## Repository Structure
- Backend (Spring Boot): `src/main/java` and `src/main/resources`
  - Controller: [GenarativeAIController.java](file:///c:/Users/Milton/Downloads/spring-ai-erudio-deepseek-ollama/src/main/java/br/com/erudio/controller/GenarativeAIController.java)
  - Services: [ChatService.java](file:///c:/Users/Milton/Downloads/spring-ai-erudio-deepseek-ollama/src/main/java/br/com/erudio/service/ChatService.java), [RecipeService.java](file:///c:/Users/Milton/Downloads/spring-ai-erudio-deepseek-ollama/src/main/java/br/com/erudio/service/RecipeService.java), [ImageService.java](file:///c:/Users/Milton/Downloads/spring-ai-erudio-deepseek-ollama/src/main/java/br/com/erudio/service/ImageService.java)
  - CORS config: [WebConfig.java](file:///c:/Users/Milton/Downloads/spring-ai-erudio-deepseek-ollama/src/main/java/br/com/erudio/config/WebConfig.java)
  - Model config: [application.yml](file:///c:/Users/Milton/Downloads/spring-ai-erudio-deepseek-ollama/src/main/resources/application.yml)
- Frontend (React CRA): `frontend/`
  - Entry: `frontend/src/index.js`
  - App: `frontend/src/App.js`
  - Chat UI: `frontend/src/components/Chat.jsx`, `frontend/src/components/chat.css`

## Backend API
- `GET /ask-ai?prompt=...` → returns `text/plain`
- `GET /ask-ai-options?prompt=...` → returns `text/plain` with model options
- `GET /recipe-creator?ingredients=...&cuisine=any&diataryRestrictions=none` → returns generated recipe (text)
- `GET /generate-image?...` → returns `List<String>` with image URLs (mock)

See controller: [GenarativeAIController.java](file:///c:/Users/Milton/Downloads/spring-ai-erudio-deepseek-ollama/src/main/java/br/com/erudio/controller/GenarativeAIController.java#L28-L58)

## Running Locally
1. Backend (port 8080):
   - Ensure Java and Maven/Gradle are installed
   - Start the Spring Boot app (e.g., `mvn spring-boot:run` or run the main class in your IDE)
   - Confirm endpoints at `http://localhost:8080/ask-ai?prompt=hello`
2. Frontend (port 3000):
   - `cd frontend`
   - `npm install` (already done by CRA)
   - `npm start`
   - Open `http://localhost:3000/`

### Windows Configuration Note (Important)
If you encounter an "Invalid options object" error related to `allowedHosts` when running `npm start` on Windows, this is due to a Webpack Dev Server security check conflict with the proxy setup.

**Fix implemented:** A `.env` file has been added to the `frontend/` directory with:
```ini
DANGEROUSLY_DISABLE_HOST_CHECK=true
```
This environment variable disables the host check, allowing the development server to run correctly with the proxy configuration on Windows.

## CORS
- Configured to allow `http://localhost:3000` accessing backend on `http://localhost:8080`.
- File: [WebConfig.java](file:///c:/Users/Milton/Downloads/spring-ai-erudio-deepseek-ollama/src/main/java/br/com/erudio/config/WebConfig.java#L16-L22)

## Frontend Integration
- The chat UI calls: `GET http://localhost:8080/ask-ai?prompt=...`
- Responses are rendered with Markdown via `react-markdown` + `remark-gfm`
- Local history persists across reloads; click “Clear” to reset

## Adding Streaming (Future)
- Backend:
  - Add `@GetMapping("/ask-ai-stream")` returning `Flux<ServerSentEvent<String>>` or `Flux<String>`
  - Use Spring WebFlux, set `produces = MediaType.TEXT_EVENT_STREAM_VALUE`
- Frontend:
  - Use `EventSource` to consume SSE and append chunks incrementally
  - Show a typing indicator and progressively render markdown

## Adding Server-Side History (Future)
- Backend endpoints:
  - `POST /conversations` to create a conversation
  - `GET /conversations/{id}` to fetch messages
  - `POST /conversations/{id}/messages` to add a message
- Storage:
  - Start with a relational DB (PostgreSQL or MySQL) or document DB (MongoDB)
  - Include fields like `userId`, `role`, `content`, `timestamp`
- Security:
  - Authenticate users (e.g., JWT) before accessing history
  - Validate input and sanitize prompts if needed

## Best Practices
- Security:
  - Do not log secrets or API keys
  - Validate and sanitize input, rate-limit endpoints as needed
- Backend:
  - Return proper HTTP status codes
  - Use DTOs for structured responses if expanding beyond plain text
  - Add error handling and observability (logs/metrics)
- Frontend:
  - Handle loading/error states and empty prompts
  - Use `encodeURIComponent` for query parameters
  - Avoid blocking UI; consider streaming for long outputs

## Dependencies
- Backend: Spring Boot, Spring AI (Ollama)
- Frontend: React (CRA), `react-markdown`, `remark-gfm`

## Scripts
- Frontend:
  - `npm start` – dev server
  - `npm run build` – production build
  - `npm test` – tests

## License
MIT (or your preferred license)
