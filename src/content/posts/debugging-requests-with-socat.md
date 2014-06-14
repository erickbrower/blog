---
title: Debugging Requests with Socat
collection: posts
date: 2014-06-01
template: post.hbt
author: Erick 
---

The [socat](http://linux.die.net/man/1/socat) utility can create a 'proxy' process that listens on a port and forwards all traffic elsewhere. It's very useful for debugging request/response between two services.

<hr>

### Install on Mac OS X
`brew install socat`

<hr>

### An Example: Docker Server Requests
The docker server listens on port 4243 by default. If I configure the docker client to connect over port 4244 instead, I can make socat listen on 4244 and forward traffic to the real docker server at 4243, all while logging the raw data to the terminal.

`socat -v TCP-LISTEN:4244,fork TCP4:127.0.0.1:4243`

Then in another terminal window while socat is running:

`docker ps`

Take a look at socat again. Logs! So _that's_ what a docker cli requests looks like. 
```
> 2014/05/24 19:17:06.434840  length=118 from=0 to=117
GET /v1.11/containers/json HTTP/1.1\r
Host: localhost:4244\r
User-Agent: Docker-Client/0.11.1\r
Accept-Encoding: gzip\r
\r
< 2014/05/24 19:17:06.461093  length=2516 from=0 to=2515
HTTP/1.1 200 OK\r
Content-Type: application/json\r
Date: Sun, 25 May 2014 02:17:05 GMT\r
Transfer-Encoding: chunked\r
\r
800\r
[{"Command":"/bin/sh -c 'java -jar start.jar'","Created":1400968849,
"Id":"c3decface4f677a4708a6251fc711c97c77c17d23b2d9267ba29e396dcc1409e",
"Image":"solr_25:latest","Names":["/cocky_bartik","/nostalgic_euclid/solr_1"],
"Ports":[{"IP":"0.0.0.0","PrivatePort":8983,"PublicPort":49177,"Type":"tcp"}],
"Status":"Up 4 hours"}]
```
