# Claude Code Boilerplate

Universal coding standards and AI agent configurations for Claude Code projects with MCP server management.

## What is Included

- **CLAUDE.md** - Universal coding standards template
- **.claude/agents/** - AI agent configurations
- **.claude/mcp/** - MCP server scripts
- **package.json** - MCP server dependencies
- **Makefile** - Automated MCP setup
- **.env.example** - Environment variable template

## Quick Start

### Basic Setup

1. Copy this boilerplate to your project
2. Install dependencies:
   ```bash
   npm install
   # or
   make install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   # Required: CONTEXT7_API_KEY for Context7 MCP
   ```

4. Setup MCP servers:
   ```bash
   make setup-mcp
   # or
   npm run setup:mcp
   ```

5. Fill in the placeholder values in CLAUDE.md

### Project Customization

1. **Configure CLAUDE.md for your project:**
   - Open `CLAUDE.md` and fill in the Project Configuration table:
     - Set your primary language (TypeScript, Python, Go, Rust, etc.)
     - Choose package manager (pnpm, npm, yarn, pip, poetry, etc.)
     - Select backend framework (Hono, FastAPI, Gin, Axum, etc.)
     - Choose frontend framework (React, Vue, Svelte, or None)
     - Select ORM/database tool (Drizzle, Prisma, SQLAlchemy, GORM, etc.)
     - Define testing framework (Vitest, pytest, go test, cargo test, etc.)
     - Choose linter/formatter (Biome, Ruff, golangci-lint, rustfmt, etc.)
   - Replace remaining `{{PLACEHOLDERS}}` (PROJECT_NAME, VERSION, DATE, etc.)
   - The language-specific sections will serve as references - use patterns that match your stack

2. Update `.env` with your API credentials (especially `CONTEXT7_API_KEY`)

3. Modify MCP server list in `Makefile` or `.claude/mcp/setup.js` as needed

## Features

### AI Agent Workflow

1. Codebase Exploration (mandatory before implementation)
2. Task Planning with small, atomic tasks
3. Priority System (P0 security alerts first)
4. Quality Gates that cannot be skipped
5. Multi-round Code Reviews (minimum 3)

### Agents Included

| Agent | Purpose |
|-------|---------|
| code-simplifier | Refactors complex code to improve readability and reduce complexity |

## MCP (Model Context Protocol) Servers

This boilerplate includes automated setup for common MCP servers:

### Included MCP Servers

| Server | Purpose | Configuration |
|--------|---------|---------------|
| **fetch** | HTTP requests and API calls | No configuration needed |
| **filesystem** | File system access | Auto-configured to project root |
| **memory** | Persistent memory across sessions | No configuration needed |
| **context7** | Enhanced context retrieval | Requires `CONTEXT7_API_KEY` in `.env` |

### MCP Server Management

#### Setup All Servers
```bash
# One-time setup (registers all MCP servers to Claude Code)
make setup-mcp

# Or using npm
npm run setup:mcp
```

#### List Registered Servers
```bash
claude mcp list
```

#### Unregister All Servers
```bash
make unregister-mcp
```

### How It Works

1. **Installation**: MCP server packages are managed as npm dependencies in `package.json`
2. **Registration**: `make setup-mcp` registers servers with project-specific names (e.g., `context7-myproject`)
3. **Auto-Start**: Claude Code automatically starts/stops MCP servers during sessions
4. **Environment Loading**: `.env` variables are loaded automatically for servers that require API keys

### Adding Custom MCP Servers

#### For npm-based MCP servers:

1. Add the package to `package.json`:
   ```json
   {
     "dependencies": {
       "@your/custom-mcp-server": "^1.0.0"
     }
   }
   ```

2. Register in `Makefile`:
   ```makefile
   setup-mcp:
       @claude mcp add custom-$(PROJECT_NAME) -- npx @your/custom-mcp-server
   ```

#### For HTTP-based MCP servers:

```bash
# Without authentication
claude mcp add --transport http your-server-name https://your-mcp-server.com/mcp

# With API key authentication (like Context7)
claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: your-api-key"
```

Or add to `Makefile`:
```makefile
setup-mcp:
    # Without authentication
    @claude mcp add --transport http your-server-$(PROJECT_NAME) https://your-mcp-server.com/mcp

    # With API key from environment variables
    @if [ -n "$(YOUR_API_KEY)" ]; then \
        claude mcp add --transport http your-server-$(PROJECT_NAME) https://your-mcp-server.com/mcp --header "YOUR_API_KEY: $(YOUR_API_KEY)"; \
    else \
        echo "⚠️  YOUR_API_KEY not set, skipping server"; \
    fi
```

## Credits

This boilerplate incorporates content and ideas from the following repositories:

- **CLAUDE.md** - Based on [levu304/claude-code-boilerplate](https://github.com/levu304/claude-code-boilerplate/blob/main/CLAUDE.md)
- **Feature Implementation Workflow** - Inspired by [serendipity1004/cc-feature-implementer](https://github.com/serendipity1004/cc-feature-implementer/blob/main/SKILL.md)

Special thanks to the original authors for their excellent work in establishing coding standards and AI-driven development workflows.

## License

MIT License
