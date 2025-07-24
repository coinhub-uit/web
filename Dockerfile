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
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run start"]
