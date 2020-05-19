FROM node:latest

ENV APP_ROOT=/app 
ENV APP_PORT=3000

WORKDIR ${APP_ROOT} 

#files
ADD main.js .
ADD package.json .
ADD package-lock.json .

#directories
ADD public public
ADD views views

#install dependencies
RUN npm install

#health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -s -f http://localhost:${APP_PORT}/health || exit 1

#Run
EXPOSE ${APP_PORT}
ENTRYPOINT ["node","main.js"]