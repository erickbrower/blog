FROM erickbrower/express

RUN node build.js
RUN bower install --allow-root
