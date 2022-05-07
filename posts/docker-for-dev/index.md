---
title: "Simple development environment setup with docker compose"
excerptOther: "Setting up a very simple and repeatable development environment with docker compose."
postDate: "2018-04-11"
date: "2018-04-11"
tags:
  - software
  - docker
---

All the code for this article is in [this example project on Github](https://github.com/ruarfff/docker-dev-setup-example). If you just want some quick sample code for a development environment with docker-compose, that repository and its Readme should be helpful. This post will expand on that and go in to more detail to explain what's going on in the example project.

## The purpose of this post

I am assuming that you know what [docker](https://www.docker.com/) and [docker compose](https://docs.docker.com/compose/) are and won't spend time in this post explaining them. This post will take what I learned from experience and reading the docs for those tools and present what I hope is a reasonably simple approach to using them to augment your development environment in a good way.

## Setup

All you need to do to run the sample code is to [install docker](https://docs.docker.com/install/) and [install docker compose](https://docs.docker.com/compose/install/). Docker compose generally installs along with docker.

You will also need to get the sample code [from Github](https://github.com/ruarfff/docker-dev-setup-example).

If you have [git](https://git-scm.com/) installed you can run:

```
git clone git@github.com:ruarfff/docker-dev-setup-example.git
```

If not, you can use the 'Download Zip` option on the project web page.

Finally, a good editor to view and edit the code would be useful. For what it's worth, I use [Visual Studio Code](https://code.visualstudio.com/).

## The Scenario

Feel free to skip this section but I wanted to take a moment to mention some of the pain points this solution helps to address.

You have an application and it connects to an external service such as a database. You probably have the tools to run the application installed locally but maybe it's a bit annoying, like if for some reason the production environment is stuck on an old version of the database and you're using some infrastructure where you have to go through a painful ticketing process to update (your next ticket should be to install docker!).

Say the app uses a postgres database. You don't really want to be connecting to a remote one or having it running locally all the time.

Maybe you work on multiple applications that require different runtimes. For example one app need java 6 (shudder) and another needs Java 8 or maybe different version of node.

Not sure if these are issues you have dealt with but I think it's safe to assume you have run into something similar.

Having your development environment in containers solves al lot of this pretty well. You really only need docker, docker compose and an editor to work on and run your application locally.

Having your development environment use the same containers as production (assuming you deploy with containers) is even better again!

The scenario we are working with here is needing to run a node app, a java app and a postgres database together. It's not something you would typically need perhaps but serves as an example.

## The Sample Application

The example project we will look at consists of 2 applications. They are not really related and don't do much but are just examples in 2 different languages I commonly use. It may make sense for me to break them out into 2 repositories at some stage but until then, it's just useful to have all the code in one place for demonstration purposes. Both applications connect to a postgres database, the same database in this setup which you wouldn't normally do if these were microservices for example but that doesn't do any harm here.

One application is written in JavaScript using [https://nodejs.org/](https://nodejs.org/). The code for the node app was generated using [the express generator](https://expressjs.com/en/starter/generator.html). We will explore how we can have it run and build entirely in a docker container even though you can edit it in your editor on any host OS (by Host OS I mean the machine and operating system you are using for development currently). We will also look at having the application automatically restart on any file change and how we can setup debugging the app while it is running in the docker container. For auto restarting we are using [pm2](http://pm2.keymetrics.io/) but [nodemon](https://nodemon.io/) is another great option you could use instead.

The second application is a Java application based on Spring Boot and was generated using the [start.spring.io](https://start.spring.io/) site. We will also look at running this application entirely in a docker container, having it automatically restart on code changes and enabling debugging for application while it's running in a container.

## The Compose Configuration

Here is our docker-compose.yml file in its entirety:

```yaml
version: '3.7'
services:
  db:
    image: postgres:alpine
    restart: always
    hostname: db
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: password
      POSTGRES_DB: dev
    volumes:
      - ./.postgres/init:/docker-entrypoint-initdb.d
    ports:
      - '5432:5432'
    networks:
      - develop
  pgadmin:
    container_name: pgadmin_container
    image: dpage/pgadmin4
    ports:
      - '9000:80'
    environment:
      PGADMIN_DEFAULT_EMAIL: pgadmin4@pgadmin.org
      PGADMIN_DEFAULT_PASSWORD: admin
    volumes:
      - ./.postgres/admin:/var/lib/pgadmin
    networks:
      - develop
    depends_on:
      - db
  node:
    build: node/
    ports:
      - '3000:3000'
    volumes:
      - ./node/src:/usr/app/src
    working_dir: /usr/app
    environment:
      PGUSER: dev
      PGPASSWORD: password
      PGDATABASE: dev
      PGHOST: db
    networks:
      - develop
    command: ['pm2-runtime', 'start', 'ecosystem.config.js']
    depends_on:
      - db
  java:
    image: gradle:jdk-alpine
    ports:
      - '8080:8080'
    volumes:
      - ./java:/home/gradle/project
    working_dir: /home/gradle/project
    networks:
      - develop
    command: ['gradle', 'build', 'bootRun']
networks: develop:
```

The version (`3.7'` in this case) is important. The capabilities from version to version of docker compose are significant. The reference manual for our version is [here](https://docs.docker.com/compose/compose-file/).

The `services` field is a list of services we want docker compose to manage. The services are the various components we want to run together while developing. Our example here may be a bit contrived but imaging a more useful scenario where you would like to see how your app behaves connected to various services it uses in production like a database and maybe a cache, like [memcached](https://hub.docker.com/_/memcached), or messaging service, like [rabbitmq](https://hub.docker.com/_/rabbitmq).

The `networks` field is where we define the networks we want the services ot communicate over. We're keeping it simple and just using one here but you can do more with networks if you need to.

### The database configuration

```yaml
db:
  image: postgres:alpine
  restart: always
  hostname: db
  volumes:
    - ./.postgres/init:/docker-entrypoint-initdb.d
  environment:
    POSTGRES_USER: dev
    POSTGRES_PASSWORD: password
    POSTGRES_DB: dev
  ports:
    - "5432:5432"
  networks:
    - develop
```

The first field, the name 'db' above could be any name. Like any name in software, it's good to use something as clear and obvious as possible. You will use that to reference this service in other services.

The `image` is the [postgres docker image](https://hub.docker.com/_/postgres). You can also define a version there e.g. `postgres:11-alpine` if you want a specific version. Otherwise it just uses the latest.

`restart: always` tells compose to restart this image if it crashes.

`hostname: db` you don't actually need this here but if you wanted to change the hostname seen by other services you can use this field. My default other services will use the service name as the hostname. By hostname I mean, other containers can see the container by using that name as long as they are on the same network. The name will resolve to the IP address of the container.

`volumes` we use volumes to mount a directory on our host system, into the running container. In this case we are mounting an sql script in to a particular place in the container so that the very first time the container is created, the script is run against the database and we can set up a scheme, populate with dummy data etc. Some other things we can do with this are, load a database configuration file and use a database file on our local file system for the database storage. By default, every time we tear down the database container we will lose all the data that was loaded into the database while we were working.

If you want to keep the state of the database you can create a directory somewhere, e.g. from the root of the sample app run`mkdir .postgres/data`and add a new volume to the volumes field of the configuration:

`- ./.postgres/data:/var/lib/postgresql/data`

Now the database's data will be stored in that directory and can be deleted on the host.

`environment` here we can specify environment variables to inject in to the running container. The variables we use are documented [here](https://hub.docker.com/_/postgres).

`ports` by default postgres serves on port 5432. Here we are exposing that on the host.

`networks` we want all the services to be able to communicate on the same network. Docker allows us to define a network for our services to share. We are creating a network called 'develop' and this tells the postgres service to join it.

### The node application configuration

First let's look at the Dockerfile:

```Dockerfile
FROM keymetrics/pm2:latest-alpine

WORKDIR /usr/app

COPY bin/ ./bin/
COPY package.json .
COPY yarn.lock .
COPY ecosystem.config.js .

ENV NPM_CONFIG_LOGLEVEL warn
RUN yarn install
```

`FROM keymetrics/pm2:latest-alpine` this is an image provided by the [pm2](http://pm2.keymetrics.io/) people which is handy for auto restarting our app on code changes but we have many options. We could use the [NodeJS image](https://hub.docker.com/_/node/) and start a little differently `command: ["npm", "start"]` for example. We could also use a custom Dockerfile for our app. If you had a python app or whatever, you could just use the appropriate image for that here instead.

`WORKDIR /usr/app` I am not sure is using /usr/app is a convention or just something I copied and kept using but I tend to use it as the place to put my app code in most docker containers. Any commands run after specifying that in the Dockerfile will be run in the context of that directory.

After that point, with all the `COPY` calls, we're doing a few slightly odd things here and I'll explain why. We want the application to install all it's dependencies in the Docker container. With the way node dependencies work, it can cause problems to install on the host and not in the container.

Take an example where you are developing on Windows. If you install the dependencies on Windows first and then mount the code in a container, you will hit issues. Node will install and even compile dependencies for the OS you are on. Trying to run your Windows dependencies in Linux will cause issues.

To get around this, we keep all our source code in a sub directory called `src`. We want to only mount the src directory during development. When we actually build our image, we want to copy in the build files and install dependencies. That way, even if you have run `yarn` or `npm install`, the node_modules directory won't get copied over to the container. If you run docker compose with `docker-compose up --build`, it will pick up any changes you made to your dependencies and rebuild the image so you don't get out of sync.

It's a little bit awkward and there may well be a better way to manage this but this is what I have come up with so far and I am sharing it with you.

Now to look at the compose configuration for the node application:

```yaml
node:
  build: node/
  ports:
    - "3000:3000"
  volumes:
    - ./node/src:/usr/app/src
  working_dir: /usr/app
  environment:
    PGUSER: dev
    PGPASSWORD: password
    PGDATABASE: dev
    PGHOST: db
  networks:
    - develop
  command: ["pm2-runtime", "start", "ecosystem.config.js"]
  depends_on:
    - db
```

`node` is our service name. Could be anything but good to use a name that makes sense.

`ports` by default the port express serves on is 3000. With this we are exposing this on the host too.

`volumes` mounting the source code for the application into the container so any edits we make in our editor will be reflected in the running container.

`environment` setting up environment variables. In this case, just providing database connection information.

`networks` puts the node app on the development network.

`command` is the command to run when the container starts.

`depends_on` tells the web service to wait until the db services container has at least started before starting itself. This does not guarantee the service itself e.g. the postgres database has actually started beforehand though. Only that the container is in a running state.

Beyond all that setup, all the application does is test out its connection to postgres.

## The java application configuration

The java app does not have its own Dockerfile although you could add one if you wish. It's just not needed at this point.

```yaml
java:
  image: gradle:jdk-alpine
  ports:
    - "8080:8080"
  volumes:
    - ./java:/home/gradle/project
  working_dir: /home/gradle/project
  networks:
    - develop
  command: ["gradle", "build", "bootRun"]
```

If you have read over the last 2 configurations you probably won't need much explanation but I will go over the properties briefly.

`java` the name of the service.

`image` we are using the [official gradle image](https://hub.docker.com/_/gradle)

`ports` by default spring boot serves on port 8080. We are exposing that here.

`volumes` we are mounting the source code into the container at the location `/home/gradle/project`. This is the expected location documented on the dockerhub page for this container.

`working_dir` setting the working directory to where the code is.

`networks` the develop network we configure for the services to talk to each other.

`command` we call gradle and the tasks we want to be run on startup.

## Running the applications

Once you have everything set up, starting the application is simply running `docker-compose up --build` in the directory that contains the compose file.

If you want to teardown and delete the containers that were created, first hit ctrl+c to shutdown the current docker compose session. Then run `docker-compose down`.

## Automatically restarting the applications on code change

Having a quick feedback loop is very important while developing. I thought it important to highlight the fact that you can still use the techniques you might be used to during normal development, while using docker.

### node

If you develop with node, you probably have used [nodemon](https://nodemon.io/) or something similar to automatically restart your application after a file has changed. You can do the very same with docker even when working with volumes. In our example we are using [pm2](https://pm2.io/doc/en/runtime/overview/) which is a nice process manager for node and provides features for watching source files and reloading on change. Try out changing a file in the node project and see the app reload.

### java

For the java application we are using [Spring Devtools](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-devtools.html). They are pretty well documented but basically we are going for a similar effect to what nodemon does for node. Try out changing any source file in the java application and watch it automatically restart.

## Debugging

I was going to put a tutorial based on tools I use here but it would honestly be a bit redundant. There are far more comprehensive tutorials out there. I will link them here:

**Node**

- [VSCode](https://blog.docker.com/2016/07/live-debugging-docker/)
- [WebStorm](https://medium.com/@creynders/debugging-node-apps-in-docker-containers-through-webstorm-ae3f8efe554d)

**Java**

- Tutorials for [Eclipse, IntelliJ and Netbeans](https://blog.docker.com/2016/09/java-development-using-docker/)

## Conclusion

If you are not already familiar with docker, there's a bit to take in here. Once you pick of the concepts though, and work through a few of those slightly weird to get the head around bits, it's amazingly useful. Maybe some new thing will come along and make it all redundant but in the meantime, I believe it's worth the effort for most people working on any kind of coding or infrastructure tasks.

I find myself jumping around to different computers, different OSes, occasionally trying out new Linux distros and having to setup environments is a real pain. Even if you automate some of it there's always something to take up a bunch of time.

With docker, I find for the most part I can get away with only 3 things on any system to get productive quickly. Docker, Git and an editor. I hope you find similar advantages to this stuff. Good luck!
