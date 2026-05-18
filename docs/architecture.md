# Architecture

## System Shape

```text
React client
  -> Express API server
    -> GitHub API
    -> Gemini API
    -> MongoDB
```

The frontend owns user interaction and editing. The backend owns external API calls, secret management, AI draft generation, and data persistence.

## Main Flow

1. The user requests GitHub repositories from the frontend.
2. The frontend calls the Express server.
3. The Express server calls the GitHub API with `GITHUB_TOKEN` from `.env`.
4. The user selects a repository, branch, and commits.
5. The frontend sends the selected commit data to the server.
6. The server formats the commit data and calls Gemini to generate a blog draft.
7. The generated draft is shown in the frontend editor.
8. The edited post is saved to MongoDB.
9. When the user publishes a post, its status changes to `published` and it is displayed inside this service.

## Responsibilities

- `frontend/`
  - Handles routing, user input, selection state, editor UI, and saved post views.
  - Does not store API keys or tokens.
- `backend/`
  - Handles GitHub API, Gemini API, and MongoDB access.
  - Manages CORS, environment variables, and error responses.
- `docs/`
  - Stores planning, design decisions, API contracts, data models, feature flows, and verification criteria.

## Environment Variables

This section is the source of truth for project environment variable names and meanings. Other docs may reference these variables by purpose, but should not duplicate the full list or redefine their meanings.

- `PORT`: Express server port.
- `CLIENT_ORIGIN`: allowed frontend origin for CORS.
- `MONGODB_URI`: MongoDB connection string.
- `GITHUB_TOKEN`: token for GitHub API requests.
- `GEMINI_API_KEY`: key for Gemini API requests.

## Security Principles

- External API keys and tokens live only in the backend `.env`.
- Do not include secrets in server logs or client responses.
- The frontend always uses the Express API for GitHub and Gemini features.
- `.env` files are not committed.
