FROM node:latest

ENV APP_PORT=3000 APP_DIR=/fortune

WORKDIR ${APP_DIR}

ADD main.js .
ADD package.json .
ADD package-lock.json .
ADD public public
ADD views views

RUN npm install

HEALTHCHECK --interval=1m --timeout=5s \
	CMD curl -f http://localhost:${APP_PORT}/health || exit 1

EXPOSE ${APP_PORT}

ENTRYPOINT [ "node", "main.js" ]
