# Testing Guide

This document explains how to run tests for the backend-million API.

## Prerequisites

Make sure you have all dependencies installed:

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

The test suite is located in the `__tests__` directory and includes:

### 1. **room.test.js**
   - Tests for Room CRUD operations
   - Tests room creation with automatic command and activity creation
   - Tests room retrieval (single and multiple)
   - Tests room updates
   - Tests room deletion with cascade cleanup
   - Verifies removed relations are not present

### 2. **command.test.js**
   - Tests command updates
   - Tests all command fields
   - Tests field preservation when not provided
   - Tests error handling for non-existent commands

### 3. **activity.test.js**
   - Tests activity updates
   - Tests all activity fields
   - Tests boolean value handling
   - Tests home activity status check

### 4. **integration.test.js**
   - End-to-end integration tests
   - Tests complete workflow: create room → update command → update activity → retrieve
   - Verifies data persistence
   - Verifies schema compliance (no removed relations)

## Test Database

⚠️ **Important**: The tests use your actual database connection. Make sure you're using a test database or are comfortable with test data being created/deleted.

To use a separate test database, you can:

1. Create a `.env.test` file with a test database URL
2. Update the test setup to use the test database URL

## What the Tests Verify

✅ Room model only has `command` and `activities` relations (no switches, onoffs, acs, etc.)
✅ Command model has correct fields (masterBathLight, stove, oven, etc.)
✅ Activity model has correct fields (masterBathLight, stove, oven, etc.)
✅ Room creation automatically creates command and activity
✅ Room deletion properly cleans up command and activity
✅ All CRUD operations work correctly
✅ Error handling works for invalid requests

## Troubleshooting

### Tests fail with database connection errors
- Make sure your database is running and accessible
- Check your `.env` file has the correct database URL
- Verify Prisma client is generated: `npx prisma generate`

### Tests fail with "relation does not exist"
- Run migrations: `npx prisma migrate dev`
- Or reset the database: `npx prisma migrate reset`

### Tests leave test data in database
- Tests should clean up after themselves, but if they crash, you may need to manually clean up
- Check for records with names starting with "Test" or "Integration Test"

