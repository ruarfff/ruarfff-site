# Ruairi's Personal Website

Code for my personal site because I thought this was a good idea at some point.

Built with [Remix](https://remix.run/docs).

## First time locally

```sh
git clone git@github.com:ruarfff/ruarfff-site.git

cd ruarfff-site

npm i
npm run build
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

Open up [http://localhost:3000](http://localhost:3000).

## Deployment

Deployed to [Netlify](https://www.netlify.com/).

- [Netlify Functions](https://www.netlify.com/products/functions/)

### Netlify Setup

1. Install the [Netlify CLI](https://www.netlify.com/products/dev/):

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
netlify login
```

3. Create a new site:

```sh
netlify init
```

### Development with Netlify CLI

The Netlify CLI builds a production version of the Remix App Server and splits it into Netlify Functions that run locally. This includes any custom Netlify functions you've developed. The Netlify CLI runs all of this in its development mode.

```sh
netlify dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

Note: When running the Netlify CLI, file changes will rebuild assets, but you will not see the changes to the page you are on unless you do a browser refresh of the page. Due to how the Netlify CLI builds the Remix App Server, it does not support hot module reloading.

### Deploying to Netlify

There are two ways to deploy your app to Netlify, you can either link your app to your git repo and have it auto-deploy changes to Netlify, or you can deploy your app manually. If you've followed the setup instructions already, all you need to do is run this:

```sh
# preview deployment
netlify deploy --build

# production deployment
netlify deploy --build --prod
```
