import React from "react";
import { graphql, } from "react-apollo";
import { Route, Switch, } from "react-router";
import styled from "styled-components";

import { getPostQuery, } from "./graphql";
import config from "../config";

import LoadingLogo from "./loadingLogo";

// ------------------------------

const PostContainerStyled = styled.div`
	align-items: center;
	flex: 7;
	padding: 8px;
	height: 100vh;
	overflow: scroll;
`;

const PostInner = styled.div`
	max-width: 600px;
	min-width: 300px;
	text-align: left;
	width: 100%;
	padding: 2em 1em;
	display: block;
`;

const PostImage = styled.img`
	max-width: 100%;
	height: auto;
`;

const PostTitle = styled.h1`

`;

const PostContents = styled.div`
`;

const LoadingContainer = styled.div`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const Loading = () => (
	<LoadingContainer>
		<LoadingLogo />
	</LoadingContainer>
);

const Post = props => (
	<PostInner>
		<PostImage src = { props.hero } />

		<PostTitle>
			{props.title}
		</PostTitle>

		<PostContents
			dangerouslySetInnerHTML = { {
				__html: props.content,
			} }
		/>
	</PostInner>
);

const PostWrapper = graphql(getPostQuery)(props => (
	<PostContainerStyled>
		{props.data.loading
			? <Loading />
			: <Post
				hero = { R.path([
					"data",
					"object",
					"metadata",
					"hero",
					"imgix_url",
				])(props) }
				title = { R.path(["data", "object", "title",])(props) }
				content = { R.path(["data", "object", "content",])(props) }
				/>}
	</PostContainerStyled>
));

PostWrapper.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"],
};

const PostSlugger = props => (
	<PostWrapper postSlug = { R.path(["match", "params", "postSlug",])(props) } />
);

const HomeWrapper = () => <PostWrapper postSlug = "home" />;

const FourOhFourWrapper = () => <PostWrapper postSlug = "404" />;

// ------------------------------

export default () => (
	<Switch>
		<Route path = "/post/:postSlug" component = { PostSlugger } />

		<Route exact path = "/" component = { HomeWrapper } />

		<Route component = { FourOhFourWrapper } />
	</Switch>
);
