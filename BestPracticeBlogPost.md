# Building a GraphQL React app
Tips, Tricks, and best practices


<!-- vim-markdown-toc GFM -->
* [You probably don't need state](#you-probably-dont-need-state)
* [GraphQL to the rescue.](#graphql-to-the-rescue)
* [Use routing to store your view information](#use-routing-to-store-your-view-information)
* [Use Fragments](#use-fragments)
* [Display something nice while you're loading](#display-something-nice-while-youre-loading)
* [Teach `Apollo` the shape of your data](#teach-apollo-the-shape-of-your-data)
* [Use Webpack Loaders](#use-webpack-loaders)

<!-- vim-markdown-toc -->

## You probably don't need state
If you've been using React for a while, your first instinct when starting a new project might be to start setting up a state managment library like [redux](https://github.com/reactjs/redux), [MobX](https://github.com/mobxjs/mobx), or [freactal](https://github.com/FormidableLabs/freactal). These are really powerful solutions for state managment, that can make wresteling with the state of a large aplication much more managable.

But, like any library, you shouldn't start using these state managment solutions untill you actually need to! For a simple blog like the one we'll be building today the only state you actually need is the current URL.

"But!" I hear you cry "How will i store/cache/handle the API first data I'm fetching over the network, from a great service like [CosmicJS](https://cosmicjs.com/)?". Well worry not! In this post we're going to explore [GraphQL](http://graphql.org/), a system for declaritivly fetching data from a server and specifically the [Apollo](https://www.apollodata.com/) GraphQL client for simply interfacing with GraphQL.

## GraphQL to the rescue.
Graphql

## Use routing to store your view information

## Use Fragments

## Display something nice while you're loading

## Teach `Apollo` the shape of your data

## Use Webpack Loaders
