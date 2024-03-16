FROM node:hydrogen-alpine

WORKDIR /usr/src/app

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
    chromium \
    harfbuzz \
    "freetype>2.8" \
    ttf-freefont \
    nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

USER node

RUN npm install
RUN npm run build
RUN npm prune --production

EXPOSE 8080
CMD [ "npm", "run", "start" ]
