ARG NODE_VERSION="23.9.0"
ARG ALPINE_VERSION=""

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
WORKDIR /app
COPY package.json package-lock.json /app/

FROM base AS deps
RUN npm clean-install --ignore-scripts

FROM deps AS build
COPY . /app/
RUN npm run build

FROM base AS production
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/.next/standalone ./ 
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
