FROM erickbrower/nodejs

RUN npm install -g grunt-cli
RUN npm install -g bower

RUN mkdir /opt/app

ADD ./package.json /tmp/package.json
RUN cd /tmp && npm install

ADD . /opt/app
RUN cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
RUN node build.js
RUN bower install --allow-root

EXPOSE 8081

CMD ["node", "server.js"]
