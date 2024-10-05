# 🎲⚡❓👑Ryokan

Online gaming platform monorepo

## Applications

### condor

API for client connections. Handles public API calls and WebSocket connections

Working with migrations:

```shell
# create empty
pnpm migration:create src/database/migrations/CreateUserTable

# generate from entities
pnpm migration:generate src/database/migrations/AddEmailToUser

# apply all pending to db
pnpm migration:run

# revert the last one
pnpm migration:revert
```

### iris

Main frontend for all activities

### ui

Library for React components. Has built-in storybook
