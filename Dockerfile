FROM node:lts-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY next.config.js .
COPY next-env.d.ts .
COPY tsconfig.json .
COPY src ./src
COPY .npmrc ./

RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    echo '//npm.pkg.github.com/:_authToken='$(cat /run/secrets/NODE_AUTH_TOKEN) >> .npmrc

RUN npm config set always-auth true

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm ci --legacy-peer-deps
RUN npm run build


FROM node:lts-alpine AS runtime
WORKDIR /usr/src/app
ENV PORT=3000 \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]