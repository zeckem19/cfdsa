FROM node:latest
ENV APP_ROOT=/app APP_PORT=3000
ENV DB_USER=root DB_PASSWORD=mypassword

WORKDIR ${APP_ROOT}

ADD main.js .
ADD package.json .
ADD package-lock.json .

ADD public public
ADD views views
ADD config config
RUN npm install
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -s -f http://localhost:${APP_PORT}/health || exit 1

EXPOSE ${APP_PORT}
ENTRYPOINT ["node", "main.js"]
# mysqladmin ping -uroot -p<password>
# WORKDIR /docker-entrypoint-initdb.d
