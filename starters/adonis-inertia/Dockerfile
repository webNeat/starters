FROM node:23-alpine AS base
RUN npm i -g pnpm

# Build
FROM base AS build
WORKDIR /app
ADD . .
RUN pnpm install --frozen-lockfile --config.confirmModulesPurge=false
RUN node ace build

# Run
FROM base
WORKDIR /app
COPY --from=build /app/build /app
RUN pnpm install --frozen-lockfile --prod --config.confirmModulesPurge=false
CMD ["node", "./bin/server.js"]