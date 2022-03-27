FROM node:16 AS base
WORKDIR /code
EXPOSE 80

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production --silent

FROM dependencies AS development
RUN npm install --silent
COPY . .
CMD ["npm", "run", "start"]
