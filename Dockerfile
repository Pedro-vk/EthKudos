FROM circleci/node:9.11.2
USER root
WORKDIR /usr/src
COPY . .
RUN npm i --unsafe-perm
RUN npm run build && mv dist/ /public
