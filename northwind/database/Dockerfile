FROM mysql:5.7
ENV MYSQL_ROOT_PASSWORD=mypassword

ADD 0-northwind-default-current-timestamp.sql /docker-entrypoint-initdb.d
ADD 1-northwind-data.sql /docker-entrypoint-initdb.d

# WORKDIR /docker-entrypoint-initdb.d