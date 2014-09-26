FROM node:0.10.32

RUN mkdir /opt/app
WORKDIR /opt/app

ADD . /opt/app
RUN npm install

CMD ["npm run deploy"]
