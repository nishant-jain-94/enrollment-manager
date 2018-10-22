FROM mhart/alpine-node:latest


WORKDIR /app

COPY . /app

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp

CMD ["npm", "start"]
