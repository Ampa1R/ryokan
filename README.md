# 🎲⚡❓👑Ryokan

Online gaming platform monorepo

## Applications

### condor

API for client connections. Handles public API calls and WebSocket connections

Working with migrations:

```shell
# create empty
nx run condor:migration:create --name=create_players

# generate from entities
nx run condor:migration:generate --name=add_deleted_at_to_games

# apply all pending to db
nx run condor:migration:run

# revert the last one
nx run condor:migration:revert
```

### iris

Main frontend for all activities

### ui

Library for React components. Has built-in storybook
