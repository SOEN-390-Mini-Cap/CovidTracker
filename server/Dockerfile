FROM node:16 AS base
WORKDIR /code
EXPOSE 8080

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production --silent

FROM dependencies AS development
RUN npm install --silent
COPY . .
RUN npm run build

FROM base AS production
COPY --from=dependencies /code/node_modules /code/node_modules
COPY --from=development /code/build /code/build
COPY --from=development /code/package.json /code
COPY --from=development /code/.env /code
CMD ["npm", "run", "start"]
