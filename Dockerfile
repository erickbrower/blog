FROM erickbrower/nodejs

RUN mkdir /opt/app
WORKDIR /opt/app

RUN npm install -g grunt-cli

ADD . /opt/app
RUN npm install

RUN grunt build

EXPOSE 8081

CMD ["node", "server.js"]
