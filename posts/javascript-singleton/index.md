---
title: "JavaScript Singleton"
date: "2012-02-17"
---

If you are new to JavaScript but have learned to program in Java, C++, C# or some other C based object orientated language then you might think JavaScript is a bit weird. I straight away found myself wondering why I can’t make a class. The whole variable scope thing got to me a bit too but eventually I found that these are minor issues with many methods to overcome them. Also nowadays you can just use something like CoffeeScript which compiles to JavaScript but offers better syntax and stuff like classes.

That said, you will probably just end up coding in JavaScript most of the time, if you’re doing web development. Here I am going to give an example of how I usually create a JavaScript singleton.

If you’re thinking – what is a singleton? – checkout this [great wiki page on the singleton pattern](http://wiki.c2.com/?SingletonPattern).

Also if you haven’t already heard of [JS Fiddle](https://jsfiddle.net/), it is a great tool to practice JavaScript code that you could use to follow along here.

Basically – in my opinion – the easiest way to implement a JavaScript Singleton is to use the module pattern with a self calling function. If you are attempting to organize your JavaScript code or make it look more like other class based languages you will generally end up using some variation of either the module or prototype pattern.

The module pattern looks a bit better than the prototype pattern with less typing involved. The prototype pattern is part of, and supported by, standard JavaScript as well as being more efficient in memory usage but that is a subject for another post.

To implement a singleton pattern in JavaScript it is easier to just use the module pattern.

Here is a quick example:

```javascript
var singleton = (function () {
  var hello = "hello"
  var howMany = alert("There can be only one")
  return {
    hello: hello,
    sayHowManyOfMeExist: howMany,
  }
})()

alert(singleton.hello)
singleton.sayHowManyOfMeExist
```

This will give 2 alerts, the first saying hello, the second saying there can be only one.

It’s worth noting the hello variable is private so something like this would not work:

```javascript
var singleton = (function () {
  var hello = "hello"
})()

alert(singleton.hello)
```

Also if you go doing something crazy like

```javascript
var obj = new singleton()
```

you will end with an ‘object is not a function’ error.
