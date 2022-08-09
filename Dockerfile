FROM node:lts-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY next.config.js .
COPY next-env.d.ts .
COPY pages ./pages
COPY src ./src
COPY styles ./styles

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm ci --prefer-offline --no-audit
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