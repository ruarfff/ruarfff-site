---
title: "Start Game Coding in ES6"
excerptOther: "Setting up phaser projects quickly"
postDate: "2016-11-10"
date: "2016-11-10"
tags:
  - phaser
  - yeoman
  - javascript
---

**TL;DR** If you want to try my solution to developing with [phaser 2](http://phaser.io/) and es6, try [this yeoman generator](https://www.npmjs.com/package/generator-fire-phaser).

### What?

A while back I discovered a HTML5 game development framework called [phaser](http://phaser.io/). It is really cool and a lot of fun to work with. This post is about how I set up a good and simple development environment to work with Phaser 2 and es6. If you're interested in getting started with phaser or have just been looking for a good way to use it with es6 then you might find some of the details below useful.

If by some amazing coincidence you happen to be struggling with getting a JavaScript library that relies on globals to work with some es6 build process, this post may also be of use to you.

### Why?

When I first became a programmer all I wanted to do was make games. In my opinion games are the most fun thing to code. They are also a huge amount of work which is probably why I have yet to fully complete one beyond some basic efforts.

I have half built games with XNA, C++, even.... Java. Phaser is the best thing I have come across yet. Despite my love of coding games I just can't put in all the effort required to make a fancy 3D thing so I love the quick and simple 2D games I can make with phaser. I even had my 7 year old son coding a little on a game and he loves seeing changes like making a character run faster or jump higher. If you want to get started making simple games I can't recommend phaser enough.

Anyway, since this is JavaScript I immediately hit a problem starting new game projects beyond a simple tutorial and this blog post is about how I got a workflow going that I like and that I wanted to share.

Besides using phaser I did not want to complicate things by adding any other frameworks and I did not want a complicated build process. I just want to make a game and keep things as simple and fun as possible. I really want to use full blown es6 with modules though and that presented a small challenge. Phaser 2 has been around for some time and was not designed to work with es6. Soon phaser 3 will come out and this post will be obsolete but until then, here's how I got a a nice setup for phaser 2 and es6.

### How?

The first thing I tried to do was use [babel](https://babeljs.io/) and [browserify](http://browserify.org/) on the command line. I have used npm to install phaser and I had a simple JavaScript file that has an `import Phaser from 'phaser'` statement at the top. It didn't start well. I was getting an error saying PIXI was not defined. After digging around the phaser source for a while I realized that the built phaser file assigned some dependencies on the global scope. I noticed that the [phaser node module](https://www.npmjs.com/package/phaser) had those dependencies separated into their own files too. It occurred to me that I would probably need to use webpack now.

I always end up having to use webpack these days. Even though it's a great tool, I always try not to use it because it just seems to add a bunch of complexity. Doesn't seem to be any good way around it here though and I think the config I use is simple enough to be OK.

I had come across the webpack [expose-loader](https://github.com/webpack/expose-loader) module before and it appears to solve the particular issue of using a library that relies on globals. I did pause to wonder if it was worth the effort now just so I would use `import Phase from 'phaser'` instead of `Phaser` as a global and decided it was.

The module loaders are configured like so:

```JavaScript
var pixiiJs = 'pixi.js';
var p2Js = 'p2.js';

module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.json$/, loader: 'json' },
      { test: new RegExp(pixiiJs), loader: 'expose?PIXI' },
      { test: new RegExp(p2Js), loader: 'expose?p2' }
    ]
  }
```

`{ test: /\.css$/, loader: 'style-loader!css-loader' }` Allows importing of css files in scripts at build time using [css-loader](https://github.com/webpack/css-loader). Totally optional. I just like that way of getting css in to the page.

`{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }` This converts our es6 code to es5 for browser support.

`{ test: /\.json$/, loader: 'json' }` For importing JSON files to scripts at build time.

`{ test: new RegExp(pixiiJs), loader: 'expose?PIXI' }` This will assign PIXI to the global object when it gets imported in our es6 code. We do need to have `import 'pixi'` in the entry point of our code. We do not need to use the global object in our code but it is there for phaser to use.

`{ test: new RegExp(p2Js), loader: 'expose?p2' }` Same as with PIXI, we are putting this on the global object for phaser to use. We also need `import 'p2'` in the entry point of our code.

That was pretty much the only tricky part.

I am going to be working on a few games in parallel and will probably never finish any of them, so to help with that I created a yeoman generator that will generate a project with a webpack configuration and some sample phaser code written in es6.

If you would like to use it or just want to see what I needed to do to get it all set up run this command (assuming you have nodejs installed)

```
npm i -g yo generator-fire-phaser
```

Or for yarn (assuming you also installed yeoman globally with yarn)

```
yarn global add generator-fire-phaser
```

Then in an empty directory run:

```
yo fire-phaser
```

You'll be prompted to answer a few questions that will be used to name the project and set some text in it.

The reference code in there might be handy for seeing how to structure ES6 code with phaser too.

The Github repo for the generator is [here](https://github.com/ruarfff/generator-fire-phaser).

Hope you make some games!
