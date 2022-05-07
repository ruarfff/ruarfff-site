---
title: "Java Singleton"
date: "2012-02-01"
---

As the name suggests, a singleton is used when you want exactly one of something in you program.

I remember in the early days of college a lot of people had trouble grasping the concept of the static keyword in Java. I did too at first but then I figured out it basically meant you only want to have one of this thing.

I got in to making games and ended up using the singleton pattern a lot. I did most of my Java programming on Android in college so using things that cost a little less memory became important.

There is a lot of stuff on the internet about the singleton pattern written by people way more knowledgeable than me so I wont go in to it here.

I will go in to how I implement a singleton in Java in my day to day work. I did a bit of research and came up with a template I was happy with. Here I am just providing this template that you can copy and past or make a file template with, depending on your choice of IDE.

```java

public final class MySingleton {

    // This is just something I find useful for logging
    private static final String TAG = MySingleton.class.getSimpleName();

    // This is private so unscrupulous people can't go newing it
    private MySingleton() {
    }

    // This is useful if you need to expose non-static methods
    // You can do MySingleton.getInstance().myNonStaticMethod();
    public static synchronized MySingleton getInstance() {
    return MySingleton_Holder.instance;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        throw new CloneNotSupportedException(TAG+" is a singleton! It can't be cloned.");
    }

    /**
    * MySingleton_Holder is loaded on the first execution of MySingleton.getInstance() or
    * the first access to MySingleton_Holder.INSTANCE, not before.
    */
    private static class MySingleton_Holder {
        public static final MySingleton instance = new MySingleton();
    }
}

```
