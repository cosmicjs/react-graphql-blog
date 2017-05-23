import React from "react";
import { graphql, } from "react-apollo";
import styled, { keyframes, } from "styled-components";
import { Helmet, } from "react-helmet";

import { getPostQuery, } from "../graphql";
import config from "../../config";
import reactGQLLogo from "../img/1-RCeGDSIqqW68bS5kYucTvA.png";

import LoadingLogo from "./loadingLogo";
import Share from "./share";

// ------------------------------

const PostContainerStyled = styled.div`
	position: relative;
	align-items: center;
	flex: 7;
	padding: 8px;
	height: 100%;
	overflow-y: scroll;
`;

const fadeIn = keyframes`
	from {
		opacity: 0;
	}

	to {
		opacity: 1
	}
`;

const PostInner = styled.div`
	max-width: 600px;
	min-width: 300px;
	text-align: left;
	width: 100%;
	padding: 2em 1em;
	display: block;
	animation: ${fadeIn} 1s;
`;

const PostImage = styled.img`
	max-width: 100%;
	height: auto;
`;

const PostTitle = styled.h1`
	margin: 0;
`;

const PostContents = styled.div`
`;

const LoadingContainer = styled.div`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const FooterImage = styled.img`
	height: auto;
	max-width: 600px;
	width: 100%;
`;

const AuthorContainer = styled.div`
	align-self: flex-end;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0.5em 0;
`;

const AuthorName = styled.div`
	font-size: 1.6em;
	margin-bottom: -0.2em;
`;

const AuthorImage = styled.div`
	background-image: url(${ R.prop("src") } );
	background-size: cover;
	border-radius: 50%;
	height: 3em;
	width: 3em;
	margin-right: 10px;
`;

const Loading = () => (
	<LoadingContainer>
		<LoadingLogo />
	</LoadingContainer>
);

const Post = props => (
	<PostInner>
		<Helmet>
			<title>
				{ props.title }
			</title>
		</Helmet>

		<PostImage src = { props.hero } key = { props.hero }/>

		<PostTitle>
			{ props.title }
		</PostTitle>

		<AuthorContainer>

			<AuthorImage src = { R.pipe(
				R.propOr([], "metafields"),
				R.find(R.propEq("key", "image"),),
				R.defaultTo({}),
				R.prop("imgix_url"),
			)(props.author) }/>
			{
				props.author &&
				<AuthorName>
					{ props.author.title }
				</AuthorName>
			}

	</AuthorContainer>

	<hr />

	<PostContents
		dangerouslySetInnerHTML = { {
			__html: props.content,
		} }
	/>

	{ 
		props.noShare 
			? null 
			: <Share />
	}
</PostInner>
);

const PostWrapper = graphql(getPostQuery)(props => (
	<PostContainerStyled>
		{
			props.data.loading || props.blank
				? <Loading />
				: <Post
					noShare = { props.noShare }
					hero = { R.path([
						"data",
						"object",
						"metadata",
						"hero",
						"imgix_url",
					])(props) }
					title = { R.path(["data", "object", "title",])(props) }
					content = { R.path(["data", "object", "content",])(props) }
					author = { R.path([ "data", "object", "metadata", "author", ])(props) }
				/>
		}

		{ props.footerImage && <FooterImage src = { reactGQLLogo } /> }

	</PostContainerStyled>
));

PostWrapper.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"],
};

// ------------------------------

export default props => (
	<PostWrapper postSlug = { R.path(["match", "params", "postSlug",])(props) } />
);

export const Home = () => <PostWrapper noShare postSlug = "home" footerImage />

export const FourOhFour = () => <PostWrapper noShare postSlug = "404" />;

export const Blank = () => null;
