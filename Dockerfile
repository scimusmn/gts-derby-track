# Use a builder layer to build our OS-level dependencies
FROM node:14.15-alpine3.12 as builder

# Copy files to /app so we can install node_modules
RUN mkdir /app
COPY . /app/
WORKDIR /app

# Install OS-level dependencies
RUN apk update && apk add build-base autoconf automake libtool pkgconfig nasm

# Install python2.7 to help build node-sass
# TODO: move to dart-sass, which doesn't rely on EOL python2.7
RUN apk add --no-cache --virtual .gyp python2 \
  && python2 -m ensurepip \
  && pip install --no-cache --upgrade pip setuptools \
  && yarn \
  && yarn install:arduino-base \
  && apk del .gyp

# Start on a clean layer
FROM node:14.15-alpine3.12

# Install gatsby-cli
RUN yarn global add gatsby-cli && gatsby telemetry --disable && mkdir /app

# Copy pre-built node modules
COPY --from=builder /app/node_modules /app/node_modules

# Copy our actual code 
COPY . /app/

# Build app
WORKDIR /app
RUN yarn build

# The command that runs when running this image as a container
# In our case, we want to serve our pre-build app
CMD yarn serve -H 0.0.0.0

EXPOSE 3000
