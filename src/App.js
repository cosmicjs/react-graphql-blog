import React from "react";
import { graphql, ApolloProvider, compose, } from "react-apollo";
import { BrowserRouter as Router, } from "react-router-dom";
import styled, { ThemeProvider, } from "styled-components";

import client, { getAllPostsQuery, getAllPostsWithExtraQuery, } from "./graphql";

import SideBar from "./sidebar";
import Post from "./post";
import theme from "./theme";
import config from "../config";

// ------------------------------

const RootStyled = styled.div`
	flex: 1;
	flex-direction: row;
	align-items: stretch;
`;

const Root = compose(
	graphql(getAllPostsQuery, { name: "allPosts", }),
	graphql(getAllPostsWithExtraQuery, { name: "allPostsWithExtra", }),
)(props => (
	<RootStyled>
		<SideBar
			loading = { props.allPosts.loading }
			posts = { R.pathOr([], ["allPosts", "objects",])(props) }
		/>

		<Post />
	</RootStyled>
));

Root.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"],
};

// ------------------------------

export default () => (
	<ThemeProvider theme = { theme }>
		<ApolloProvider client = { client }>
			<Router>
				<Root />
			</Router>
		</ApolloProvider>
	</ThemeProvider>
);
