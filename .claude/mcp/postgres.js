#!/usr/bin/env node

/**
 * PostgreSQL MCP Server Runner
 *
 * This script loads environment variables and runs the PostgreSQL MCP server.
 * It's designed to be called by Claude Code's MCP configuration.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables from .env file
config({ path: join(projectRoot, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  console.error('Please set DATABASE_URL in your .env file');
  process.exit(1);
}

// Run the PostgreSQL MCP server
const child = spawn('npx', ['@modelcontextprotocol/server-postgres', DATABASE_URL], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', (error) => {
  console.error('Failed to start PostgreSQL MCP server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
