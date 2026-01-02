.PHONY: help setup install setup-mcp clean

# Project name (customize for each project)
PROJECT_NAME ?= $(shell basename $(CURDIR))

# Load environment variables from .env if it exists
ifneq (,$(wildcard .env))
    include .env
    export
endif

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install npm dependencies
	@echo "📦 Installing dependencies..."
	@npm install
	@echo "✅ Dependencies installed"

setup: install ## Full setup: install dependencies and configure MCP servers
	@echo "🚀 Setting up $(PROJECT_NAME)..."
	@$(MAKE) setup-mcp
	@echo "✅ Setup complete!"

setup-mcp: ## Register MCP servers to Claude Code
	@echo "🔧 Registering MCP servers for $(PROJECT_NAME)..."
	@if [ ! -f .env ]; then \
		echo "⚠️  .env file not found. Copying from .env.example..."; \
		cp .env.example .env; \
		echo "📝 Please edit .env with your configuration"; \
	fi
	@echo "Registering fetch MCP..."
	@claude mcp add fetch-$(PROJECT_NAME) -- npx @modelcontextprotocol/server-fetch
	@echo "✅ fetch-$(PROJECT_NAME) registered"
	@echo "Registering filesystem MCP..."
	@claude mcp add filesystem-$(PROJECT_NAME) -- npx @modelcontextprotocol/server-filesystem $(CURDIR)
	@echo "✅ filesystem-$(PROJECT_NAME) registered"
	@echo "Registering memory MCP..."
	@claude mcp add memory-$(PROJECT_NAME) -- npx @modelcontextprotocol/server-memory
	@echo "✅ memory-$(PROJECT_NAME) registered"
	@echo "Registering context7 MCP..."
	@if [ -n "$(CONTEXT7_API_KEY)" ]; then \
		claude mcp add --transport http context7-$(PROJECT_NAME) https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: $(CONTEXT7_API_KEY)"; \
		echo "✅ context7-$(PROJECT_NAME) registered"; \
	else \
		echo "⚠️  CONTEXT7_API_KEY not set, skipping context7 MCP"; \
	fi
	@echo ""
	@echo "🎉 All MCP servers registered for $(PROJECT_NAME)!"
	@echo "Run 'claude mcp list' to verify"

unregister-mcp: ## Remove MCP servers from Claude Code
	@echo "🗑️  Unregistering MCP servers for $(PROJECT_NAME)..."
	@claude mcp remove fetch-$(PROJECT_NAME) 2>/dev/null || true
	@claude mcp remove filesystem-$(PROJECT_NAME) 2>/dev/null || true
	@claude mcp remove memory-$(PROJECT_NAME) 2>/dev/null || true
	@claude mcp remove context7-$(PROJECT_NAME) 2>/dev/null || true
	@echo "✅ MCP servers unregistered"

clean: ## Clean node_modules and lock files
	@echo "🧹 Cleaning up..."
	@rm -rf node_modules package-lock.json
	@echo "✅ Cleaned"

reinstall: clean install ## Clean and reinstall dependencies
	@echo "✅ Reinstallation complete"
