# How to Build a React website powered by the Cosmic JS GraphQL API
Building and maintaining a React app can be no mean feat. There plenty of tutorials out there covering the technical aspects of making a React app, but as with any technology, it's often hard to find information on best practices.

In this post we'll be exploring some tips, tricks, and techniques we've learnt whilst producing React/GraphQL apps for our clients. Hopefully these will help you make your project more performant and simplify maintenance.

<!-- vim-markdown-toc GFM -->
* [React](#react)
   - [You probably don't need state](#you-probably-dont-need-state)
   - [Use routing to store your view information](#use-routing-to-store-your-view-information)
   - [Styled-Components and ThemeProvider stay on top of your styles](#styled-components-and-themeprovider-stay-on-top-of-your-styles)
* [GraphQL](#graphql)
   - [Setting up the CosmicJS GraphQL API](#setting-up-the-cosmicjs-graphql-api)
   - [Reuse Data with `Fragments`](#reuse-data-with-fragments)
   - [Use Component props as query parameters.](#use-component-props-as-query-parameters)
      + [Default Props](#default-props)
      + [Dynamic Props](#dynamic-props)
   - [Preloading Data](#preloading-data)
   - [Teach `Apollo` the shape of your data](#teach-apollo-the-shape-of-your-data)
   - [Load GraphQL queries with webpack](#load-graphql-queries-with-webpack)
* [Conclusion:](#conclusion)

<!-- vim-markdown-toc -->

## React

### You probably don't need state
If you've been using React for a while, your first instinct when starting a new project might be to set up a state management library like [Redux](https://github.com/reactjs/redux), [MobX](https://github.com/mobxjs/mobx), or [freactal](https://github.com/FormidableLabs/freactal). These are really powerful solutions for state management, that can make wrestling with the state of a large application much more manageable.

But, like any library, you shouldn't start using these state management solutions until you actually need to! For a simple blog like the one we'll be building today the only state you actually need is the current URL.

_"But!"_ I hear you cry _"How will I store/cache/handle the API-first data I'm fetching over the network, from a great service like [CosmicJS](https://cosmicjs.com/)?"_. Well worry not! In the second half of this post we're going to explore [GraphQL](http://GraphQL.org/), a system for declaratively fetching data from a server and specifically the [Apollo](https://www.Apollodata.com/) GraphQL client for simply interfacing with GraphQL.

We're focusing on a simple, view only app in this post, but it's worth mentioning that the `state` provided by class based React components is often sufficient for bits of state that only affect a localised part of your app. Dan Abramov (creator of Redux) has written in more detail about this subject [here](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)

### Use routing to store your view information
Of course, if we don't have _some_ state, we'd just be displaying our whole web app all at once. Luckily, your browser provides a built in state store with undo history, frictionless sharing, and a simple interface: your URL bar.

The excellent [React Router](https://reacttraining.com/react-router/) library provides a simple and expressive interface for navigating around your app. Most of the routing in our example app is handled in the following file:

```javascript
// src/components/posts.js

import styled from "styled-components";
import { Route, Switch, } from "react-router";

import Post, { Blank, Home, FourOhFour, } from "./post";
import Sidebar from "./Sidebar";

const PostsStyled = styled.div`
	background-color: ${R.path(["theme", "white",])};
	flex-direction: row;
`;

export default () => (
   <PostsStyled>

		<Route path = "/post" component = { Sidebar } />

		<Switch> 
			<Route path = "/post/:postSlug" component = { Post } />
			<Route path = "/post/" component = { Blank } />
			<Route path = "/" exact component = { Home } />
			<Route component = { FourOhFour } />
		</Switch>

	</PostsStyled>
);
```

The first `Route` renders the sidebar for any URL beginning with `/post`

The `Switch` component renders the first of its children with a matching `path`. Our routing configuration does the following:

+ If the URL is `/post/some-post-slug` we show the post with the slug `some-post-slug`
+ If the URL is `/post` we only show the Sidebar that lets you select a post
+ If the URL is `/` we show the home page
+ For any other URL we show the 404 page

All this together means we can simply switch between all the different views of our app just by changing the URL.

React Router provides a `Link` component, that acts like a supercharged `<a>` tag. You should use `Link` for any hyperlinks that don't lead out of your website.

### Styled-Components and ThemeProvider stay on top of your styles
CSS precompilers like `SASS` first enabled web developers to start using variables and functions in their styles. Then React came along and popularised the inline style system: 

```javascript
<div
   style = {{
      display: "flex",
      backgroundColor: "red",
      color: "white",
      margin: "4px",
   }}
/>
```

The hottest new trend is [Styled Components](https://github.com/styled-components/styled-components), which allows you to create new components by specifying a component, and the CSS styles you'd like to apply to it. These styles are automatically vendor-prefixed, and are all converted to a stylesheet in the end.

```javascript
const Link = styled.a`
   color: white;
   font-size: 0.8em;
   text-decoration: none;
`;
```

Styled Components also provide a way to set global variables that are inherited by each styled component. The `ThemeProvider` component can be used to supply variables to each styled component like so:

```javascript
const theme = {
	white: "#fff",
	blue: "#00afd7",
};

export default () => (
	<ThemeProvider theme = { theme }>
      <App/>
	</ThemeProvider>
);
```

Now every styled component that is a child of `App` can access those variables using a function in the styles:

```javascript
const Link = styled.a`
   color: ${ (props) => props.theme.blue };
   font-size: 0.8em;
   text-decoration: none;
`
```

The `theme` object can be any javascript object, and the function inside the `${ }` block can be any function, so there's a huge range of cool stuff you can do in your styled components while still keeping all your variables in one unified place.

## GraphQL
GraphQL is a _declarative_, _self documenting_ API specification that allows you to ask your API only for the data you need. It imposes a few restrictions and ideas on your API, that allows a `GraphQL Client` to create some really cool features, including:

+ Automatic caching.
+ Smart resolving data requests from stored data.
+ Connecting data fetching to the components that display the data.

We're going to be going through and explaining all the steps we've used in our example project, but if you'd like a more complete explanation of the GraphQL protocol, you can read about it in full [here](http://GraphQL.org/learn/).

The GraphQL API provided by CosmicJS has 3 queries:

+ `objects`: gets all the objects in a bucket
+ `objectsByType`: gets all the objects of a certain type in a bucket
+ `object`: gets a specific object by its slug

And those queries are documented in full [here](https://cosmicjs.com/docs/GraphQL).

### Setting up the CosmicJS GraphQL API
First we need to set up our `ApolloClient`:

```javascript
//src/GraphQL/index.js

import { ApolloClient, createNetworkInterface, } from "react-apollo";

const networkInterface = createNetworkInterface({
	uri: "https://graphql.cosmicjs.com/v1",
});

const client = new ApolloClient({
	networkInterface,
});

export default client;
```

Which we then provide to the rest of our app using the `ApolloProvider`:

```javascript
//src/app.js

import React from "react";
import { ApolloProvider, } from "react-apollo";
import styled, { ThemeProvider, } from "styled-components";

import client from "./GraphQL";

export default () => (
	<ThemeProvider theme = { theme }>
		<ApolloProvider client = { client }>
         <App />
		</ApolloProvider>
	</ThemeProvider>
);
```

The Apollo provider means that any component in our app can connect itself to a GraphQL query, meaning each component can ask the client to fetch exactly the data needed to render itself. Don't worry about multiple components spamming the server with requests; the `ApolloClient` handles caching and de-duplication itself!

We'll now spend a little time exploring some methods you can use to make GraphQL a little nicer to use, before we start exploring how we've used it in this app. We're not including all the code necessary to run the example in this blog post, but you can find the source code for our demo project [here](https://bitbucket.org/codogo/cosmic-js-best-practice-blog-post). Follow along!

### Reuse Data with `Fragments`
Sometimes you want to get the same fields from an object in two different queries, GraphQL provides a system to do this in the form of `Fragments`. `Fragments` allow you to pick some fields from an object, and ask for only those fields.

For example, in the sidebar we only want some basic information about a post:

```
fragment PostPreview on Object {
	slug
	typeSlug: type_slug
	title
	modifiedAt: modified_at
}
```

But in the post itself we want all that information, plus some more:

```
fragment PostAllContent on Object {
	...PostPreview
	content
	metadata
	order
}
```

We can then use the `PostPreview` fragment in the query used by our Sidebar:

```
# getAllPostsQuery
query($bucketSlug: String! $readKey: String!){
	objects: objectsByType(bucket_slug: $bucketSlug, read_key: $readKey, type_slug: "posts") {
		...PostPreview
	}
}
```

And the `PostAllContent` fragment in the query used by our `Post` component

```
# getPostQuery
query($bucketSlug: String! $readKey: String! $postSlug: String!){
	object(bucket_slug: $bucketSlug, read_key: $readKey, slug: $postSlug) {
		...PostAllContent
	}
}
```

`Fragments` are great for two reasons: 

1. They allow you to modularise and reuse the properties you want to get from a query
2. They ensure that two queries which should get the same information always stay in sync, so Apollo can successfully cache the results

### Use Component props as query parameters.

You'll notice that the above queries have 2/3 input fields:

+ `$bucketString`: The slug of the bucket we'd like to get objects from
+ `$readKey`: The read key (if needed) to read from the bucket
+ `$postSlug`: The slug of the specific object we want to get (if needed)

These variables are used to direct the query to the correct data. Apollo gives us a powerful API to set these variables, but often for simple components it's easier to just set them using props:


#### Default Props

For variables that are the same across our app, like `$bucketSlug`, we can add them to our components using their `defaultProps`:

```javasript
//src/components/sidebar.js

const Sidebar = graphql(getAllPostsQuery, { name: "allPosts", })(
   props => (
      <SidebarStyled>
         <Nav>
            <SidebarText>
               Posts
            </SidebarText>

            {
            props.allPosts.loading
               ? <Loading />
               : props.allPosts.objects.map(({ slug, ...rest }) => (
                  <PostLink key = { slug } slug = { slug } { ...rest } />
               ))
            }

         </Nav>
      </SidebarStyled>
   )
);

SideBar.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"],
};
```

#### Dynamic Props

For variables that change for different instances of a component, like `$postSlug`, you can pass them in as a prop to each instance of a component:
```javascript
//src/components/post.js
const PostWrapper = GraphQL(getPostQuery)(props => (
	<PostContainerStyled>
		{
         props.data.loading
            ? <Loading />
            : <Post
               noShare = { props.noShare }
               title = { R.path(["data", "object", "title",])(props) }
               content = { R.path(["data", "object", "content",])(props) }
               />
      }
	</PostContainerStyled>
));

PostWrapper.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"],
};

export const Home = () => <PostWrapper noShare postSlug = "home" />;
```

### Preloading Data
It's always good to prefetch our data before the user needs it, this speeds up page transition time and makes for a nicer UX, Apollo provides a very simple way to do this.

While the Sidebar gets the query it need to display a preview of each post, it also performs another query:

```
#getAllPostsWithExtraQuery
query($bucketSlug: String! $readKey: String!){
	objectsWithExtra: objectsByType(bucket_slug: $bucketSlug, read_key: $readKey, type_slug: "posts") {
		...PostAllContent
	}
}
```

This query gets _all_ the fields of every post, meaning all that data is already loaded into the cache before we navigate to a Post page. You can attach multiple queries to a component using the `compose` function from the `react-apollo` package.

```javascript
//src/components/sidebar.js

const Sidebar = compose(
	GraphQL(getAllPostsQuery, { name: "allPosts", }),
	GraphQL(getAllPostsWithExtraQuery, { name: "allPostsPreFetch", }),
)(props => (
	<SidebarStyled>
		<Nav>
			<SidebarText>
				Posts
			</SidebarText>

			<Line />

			{props.allPosts.loading
				? <Loading />
				: props.allPosts.objects.map(({ slug, ...rest }) => (
					<PostLink key = { slug } slug = { slug } { ...rest } />
					))}

		</Nav>
	</SidebarStyled>
));

SideBar.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"],
};
```

However, if you were to just do this, you would see no improvement in your network performance, and every time you loaded a new post you'd have to make a new network request. To benefit from this preloading we have to tell the `ApolloClient` a few more things.

### Teach `Apollo` the shape of your data
By default, `ApolloClient` assumes that every Object returned by your API is identifiable by a field called `id` or `_id`. In CosmicJS, each object is identifiable by a field called `slug`.

Telling Apollo about this is simple:

```javascript
import { ApolloClient, createNetworkInterface, } from "react-apollo";
import { toIdValue, } from "Apollo-client";

// ------------------------------

const networkInterface = createNetworkInterface({
	uri: "https://GraphQL.cosmicjs.com/v1",
});

const dataIdFromObject = ({ __typename, slug, }) => __typename + slug;

const customResolvers = {
	Query: {
		object: (_, args) =>
			toIdValue(
				dataIdFromObject({ __typename: "Object", slug: args.slug, }),
			),
	},
};

const client = new ApolloClient({
	networkInterface,
	dataIdFromObject,
	customResolvers,
});

//------------------------------

export default client
```

The function `dataIdFromObject` tells `ApolloClient` how to generate a unique ID from any object it gets.

The object `customResolvers` tells `ApolloClient` that whenever we make an `object` query, we can try looking in the cache using the query variable `slug`.

Now our sidebar preloads all posts using `getAllPostsWithExtraQuery`, and any future calls to get Post data will be served by `ApolloClient`'s cache, instead of the network.

### Load GraphQL queries with webpack

Finally, Apollo provides us with another nifty technique to improve the developer experience.

If you're using `webpack` as part of your build system you can keep all your GraphQL queries and mutations in seperate files, and import them into javascript like any other file. This only only means to can benefit from compartmentalised code & syntax highlighting, it also means that webpack can pre-compile your GraphQL queries into Apollo's own internal representation at build time, rather than in your user's browser.

Integrating the GraphQL loader into webpack is easy, you just have to include the following code in your webpack config: 

```javascript
module: {
   rules: [
      {
         test: /\.(GraphQL|gql)$/,
         exclude: /node_modules/,
         loader: 'GraphQL-tag/loader',
      },
   ],
},
```

## Conclusion:
Now you know some of the tips, tricks, and techniques we've learnt from using React and GraphQL in production apps. If you've learnt something, please [share this article](https://twitter.com/intent/tweet?text=Building a GraphQL React app: https://cosmicjs.com/blog)!

If you're making a static site, or anything else, with CosmicJS get in touch on our Slack or Twitter, we'd love to see what you're making. 

This post was written by [Codogo](https://consulting.codogo.io), an award-winning digital agency with a passion for creating amazing digital experiences. Keep an eye out for our next post, on best practice for making a CosmicJS site using React and GraphQL.
