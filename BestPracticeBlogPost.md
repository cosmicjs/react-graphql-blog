# Building a GraphQL React app
Building and maintaining a React app can be no mean feat. There are a lot of tutorials out there that explain the technical aspects of making a react app, but as with any technologies it's often hard to find information on best practice.

In this post we'll be exploring some tips and tricks you can use to make a React/GraphQL app that's not only performant but also easy to manage.

<!-- vim-markdown-toc GFM -->
* [React](#react)
   * [You probably don't need state](#you-probably-dont-need-state)
   * [Use routing to store your view information](#use-routing-to-store-your-view-information)
   * [Update your `<head>`](#update-your-head)
   * [Display something nice while you're loading](#display-something-nice-while-youre-loading)
   * [Styled-Components and ThemeProvider help you stay on top of your styles](#styled-components-and-themeprovider-help-you-stay-on-top-of-your-styles)
* [GraphQL](#graphql)
   * [Load GraphQL queries with webpack](#load-graphql-queries-with-webpack)
   * [Reuse Data with `Fragments`](#reuse-data-with-fragments)
   * [Teach `Apollo` the shape of your data](#teach-apollo-the-shape-of-your-data)
   * [Use Component props as query paramaters.](#use-component-props-as-query-paramaters)

<!-- vim-markdown-toc -->

## React

### You probably don't need state
If you've been using React for a while, your first instinct when starting a new project might be to start setting up a state managment library like [redux](https://github.com/reactjs/redux), [MobX](https://github.com/mobxjs/mobx), or [freactal](https://github.com/FormidableLabs/freactal). These are really powerful solutions for state managment, that can make wresteling with the state of a large aplication much more managable.

But, like any library, you shouldn't start using these state managment solutions untill you actually need to! For a simple blog like the one we'll be building today the only state you actually need is the current URL.

"But!" I hear you cry "How will i store/cache/handle the API first data I'm fetching over the network, from a great service like [CosmicJS](https://cosmicjs.com/)?". Well worry not! In the second half of this post we're going to explore [GraphQL](http://graphql.org/), a system for declaritivly fetching data from a server and specifically the [Apollo](https://www.apollodata.com/) GraphQL client for simply interfacing with GraphQL.

We're focusing on a simple, view only app in this post, but it's worth mentioning that the `state` provided by class based React components is often sufficient for bits of state that only affect a localised bit of your app. Dan Abramov (creator of redux) has writen in more detail about this subject [here](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)

### Use routing to store your view information
Of couse, if we don't have _some_ state, we'll just be displaying our whole web app all at once. Luckily, your browser provides a build in state store with undo history, simple sharing, and a simple interface: your URL bar.

The excelent [React Router](https://reacttraining.com/react-router/) library provides a simple and expresive interface for navigating around your app. Most of the routing in our example app is handled in the following file:

```javascript
// src/components/posts.js

import styled from "styled-components";
import { Route, Switch, } from "react-router";

import Post, { Blank, Home, FourOhFour, } from "./post";
import SideBar from "./sidebar";

const PostsStyled = styled.div`
	background-color: ${R.path(["theme", "white",])};
	flex-direction: row;
`;

export default () => (
   <PostsStyled>

		<Route path = "/post" component = { SideBar } />

		<Switch> 
			<Route path = "/post/:postSlug" component = { Post } />
			<Route path = "/post/" component = { Blank } />
			<Route path = "/" exact component = { Home } />
			<Route component = { FourOhFour } />
		</Switch>

	</PostsStyled>
);
```

The first `Route` renders the side bar if we're at any url that begins with `/post`

The `Switch` component renders the first of its children with a matching `path`. Our routing configuration does the following:

+ If the URL is `/post/some-post-slug` we show the post with the slug `some-post-slug`
+ If the URL is `/post` we only show the sidebar that lets you select a post
+ If the URL is `/` we show the home page
+ For any other URL we show the 404 page

### Update your `<head>`

### Display something nice while you're loading
Apollo provides a `loading` property on the data object that it passes in to your component, you can use this to display a loading animation while data is fetched.

### Styled-Components and ThemeProvider help you stay on top of your styles

## GraphQL
Graphql is a _declarative_, _self documenting_ API specification that allows you to ask your API only for the data you need. It imposes a few restrections and ideas on your API, that allows a `GraphQL Client` to create some really cool features, including:

+ Automatic caching.
+ Smart resolving data requests from stored data.
+ Contecting data fetching to the components that display the data.

### Load GraphQL queries with webpack
The advantatges are twofold: you can keep your queries in a seperate file with proper syntax hilighting, and the queries can be pre-compiled at build time.

### Reuse Data with `Fragments`
Fragments allow for repeating data dependancy

### Teach `Apollo` the shape of your data
The information about an individual post is fetched by two different queries.
Apollo 

### Use Component props as query paramaters.


