FROM node:latest

ENV APP_ROOT=/app APP_PORT=3000

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

#Run
EXPOSE ${APP_PORT}
ENTRYPOINT ["node","main.js"]

CMD ["${APP_PORT}"]