# React GraphQL Blog App
![React GraphQL Blog App](https://cosmicjs.com/uploads/a9c4c740-4001-11e7-b7c8-e37127aa84b4-react-graphql-blog.jpg)

This is an example of a simple blog app built using [create-react-app](https://github.com/facebookincubator/create-react-app). It's powered by [GraphQL](http://graphql.org/) connected to the [Cosmic JS API](https://cosmicjs.com/) for easy content management.

## Getting Started
1. Go to [Cosmic JS](https://cosmicjs.com/) and create a new Bucket.
2. Import the `bucket.json` in this repo to your Bucket located in Your Bucket > Import / Export
3. Download the app:
```
git clone https://github.com/cosmicjs/react-graphql-blog
cd react-graphql-blog
yarn
```
## Starting the app
### Run in development
Connect to your Cosmic JS Bucket using the environment variable `COSMIC_BUCKET` or edit the `config.js` file.
```
COSMIC_BUCKET=your-bucket-slug yarn start
```
### Build for production
```
COSMIC_BUCKET=your-bucket-slug yarn build
```
