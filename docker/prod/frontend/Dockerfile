FROM node:10

WORKDIR /app

# Copying source files
COPY ./frontend /app

# Installing dependencies
RUN npm install

# Building app
RUN npm run build
