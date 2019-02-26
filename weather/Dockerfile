FROM node@sha256:36aeeb280a85cff4e888c49bf0dfdb86084e6158ae8fd106e397542edaa08d0a

ENV APP_PORT=3000 APP_DIR=app

WORKDIR ${APP_DIR}

ADD main.js .
ADD package.json .
ADD package-lock.json .
ADD views views

RUN npm install 

HEALTHCHECK --interval=15s --timeout=10s \
	CMD curl -f http://localhost:${APP_PORT}/health || exit 1

EXPOSE ${APP_PORT}

ENTRYPOINT [ "node", "main.js" ]

CMD [ "" ]
