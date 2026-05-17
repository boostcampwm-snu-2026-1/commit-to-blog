# Project Plan: Smart Blog (commit-to-blog) - Core MVP

An AI-powered developer blogging platform that converts GitHub commit histories into structured blog posts using the Gemini API.

## Tech Stack & APIs
- **Frontend:** React (Vite), CSS/Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** None (Optional / Local Storage or file export for persistence)
- **APIs:** - GitHub REST API (OAuth, Repositories, Branches, Commits)
  - Gemini API (Content generation and summarization)

## Weekly plan
- Week 1: Plan implementation details, Get used to Agentic Coding tool (Codex), Create Skill
- Week 2: Actual implementation, validation and iterative revision

---

## Implementation Checklist

### Phase 1: Project Initialization & Base Layout
- [ ] Initialize Vite + React project and configure basic routing (My Blog, Settings)
- [ ] Set up Express backend server
- [ ] Create shared UI components: Navbar, Footer, and Page containers
- [ ] Implement global theme/CSS variables matching the design mockups

### Phase 2: GitHub Authentication & API Integration
- [ ] Configure GitHub OAuth application settings
- [ ] Implement backend route for GitHub login and access token exchange
- [ ] Create frontend authentication state management (save token in Session/LocalStorage)
- [ ] Build backend service to fetch authenticated user's repositories
- [ ] Build backend service to fetch branches for a selected repository
- [ ] Build backend service to fetch recent commits for a selected branch

### Phase 3: Gemini API Integration & Prompt Engineering
- [ ] Set up Gemini API client on the backend
- [ ] Design and test the system prompt for transforming commit diffs/messages into blog posts
- [ ] Create backend API endpoint (`/api/generate-post`) that accepts commit data and returns AI summary
- [ ] Implement error handling and timeout configurations for the LLM call

### Phase 4: "Create Blog" Feature (UI & Integration)
- [ ] Build Sidebar layout for Repository search and Branch selection
- [ ] Build Commit list view with checkboxes/selection logic
- [ ] Implement "Generate AI Summary" button with loading states
- [ ] Build the AI Summary preview panel (Markdown view)
- [ ] Implement an Editor interface (Textarea or simple Markdown editor) to edit the generated text
- [ ] Add "Copy to Clipboard" and "Export as Markdown (.md)" buttons for the final post

### Phase 5: Refinement & Polishing
- [ ] Optimize UI states (Empty states for no repos or empty commit logs)
- [ ] Add input validation and structured error boundaries
- [ ] Review and clean up environment variables (.env setup)