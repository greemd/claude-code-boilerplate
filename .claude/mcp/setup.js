#!/usr/bin/env node

/**
 * MCP Setup Automation Script
 *
 * This script automates the registration of MCP servers to Claude Code.
 * It's an alternative to using the Makefile.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

const projectRoot = process.cwd();
const projectName = projectRoot.split('/').pop();

// Load environment variables
config({ path: join(projectRoot, '.env') });

console.log(`🚀 Setting up MCP servers for ${projectName}...\n`);

// Check if .env exists
if (!existsSync(join(projectRoot, '.env'))) {
  console.log('⚠️  .env file not found');
  console.log('Please create .env file from .env.example and configure it\n');
  process.exit(1);
}

const mcpServers = [
  {
    name: `postgres-${projectName}`,
    command: `node ${join(projectRoot, '.claude/mcp/postgres.js')}`,
    condition: !!process.env.DATABASE_URL,
    warning: 'DATABASE_URL not set, skipping postgres MCP',
  },
  {
    name: `fetch-${projectName}`,
    command: 'npx @modelcontextprotocol/server-fetch',
    condition: true,
  },
  {
    name: `filesystem-${projectName}`,
    command: `npx @modelcontextprotocol/server-filesystem ${projectRoot}`,
    condition: true,
  },
  {
    name: `memory-${projectName}`,
    command: 'npx @modelcontextprotocol/server-memory',
    condition: true,
  },
  {
    name: `context7-${projectName}`,
    command: 'https://mcp.context7.com/mcp',
    transport: 'http',
    condition: true,
  },
];

let successCount = 0;
let skipCount = 0;

for (const server of mcpServers) {
  if (!server.condition) {
    console.log(`⚠️  ${server.warning}`);
    skipCount++;
    continue;
  }

  try {
    console.log(`📦 Registering ${server.name}...`);

    let command;
    if (server.transport === 'http') {
      command = `claude mcp add --transport http ${server.name} ${server.command}`;
    } else {
      command = `claude mcp add ${server.name} -- ${server.command}`;
    }

    execSync(command, {
      stdio: 'inherit',
    });
    console.log(`✅ ${server.name} registered\n`);
    successCount++;
  } catch (error) {
    console.error(`❌ Failed to register ${server.name}`);
    console.error(error.message);
    console.log('');
  }
}

console.log(`\n🎉 Setup complete!`);
console.log(`   Registered: ${successCount}`);
if (skipCount > 0) {
  console.log(`   Skipped: ${skipCount}`);
}
console.log(`\nRun 'claude mcp list' to verify your MCP servers`);
