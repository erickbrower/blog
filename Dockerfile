FROM erickbrower/nodejs

RUN mkdir /opt/blog

ADD ./package.json /opt/blog
ADD ./bower.json /opt/blog

WORKDIR /opt/blog

RUN npm install 
RUN bower install

ADD . /opt/blog

RUN make build

EXPOSE 8080

CMD ["node", "server.js"]
