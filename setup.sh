#!/bin/bash
bun install
cp .env.example .env
bun run dev
