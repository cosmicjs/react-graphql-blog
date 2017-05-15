import React from "react";
import moment from "moment";
import { NavLink, } from "react-router-dom";
import styled, { css, keyframes, } from "styled-components";
import { compose, graphql, } from "react-apollo";

import { getAllPostsWithExtraQuery, getAllPostsQuery, } from "../graphql";
import config from "../../config";

// ------------------------------

const Shine = ({ theme, }) => keyframes`
	{
		0% {
			background-color: ${theme.gray};
		}
		50% {
			background-color: ${theme.lightgray};
		}
		100% {
			background-color: ${theme.gray};
		}
	}
`;

const SideBarStyled = styled.div`
	align-items: left;
	background-color: ${R.path(["theme", "darkBlueLight",])};
	display: flex;
	flex-direction: column;
	flex: 2;
	height: 100%;
	max-width: 300px;
	min-width: 150px;
	padding: 1em;
	z-index: 2;
`;

const SideBarStyling = css`
	margin: .5em;
	text-decoration: none;
	color: ${R.path(["theme", "lightgray",])};

	&:hover {
		color: ${R.path(["theme", "darkBlue",])};
	}

	&.active {
		color: ${R.path(["theme", "white",])};

		&:hover {
			color: ${R.path(["theme", "darkBlue",])};
		}
	}
`;

const SideBarText = styled.p`
	font-size: 1.5em;
	margin: .5em 0;
	color: ${R.path(["theme", "darkBlue",])};
`;

const PostLinkStyled = styled(NavLink)`
	${SideBarStyling}
	display: flex;
	flex-direction: column;
	margin: 0.5em;
`;

const PostTitle = styled.p`
	font-size: 1.2em;
	margin: -0.1em;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const PostDate = styled.div`
	font-size: 0.8em;
	align-self: flex-end;
	margin: 2px;
`;

const Nav = styled.div`
	align-self: stretch;
	flex: 1;

`;

const Credit = styled.div`
	color: ${R.path(["theme", "white",])};
	font-size: 0.8em;

	a {
		text-decoration: none;
		color: ${R.path(["theme", "white",])};

		&:hover {
			color: ${R.path(["theme", "lightgray",])};
		}
	}
`;

const LoadingContainer = styled.div`
	align-self: stretch;
	align-items: stretch;
	flex: 1;
`;

const LoadingTitle = styled.div`
	border-radius: .2em;
	height: 1.2em;
	animation: ${Shine} 1s linear infinite;
	width: 70%;
`;

const LoadingDate = styled.div`
	align-self: flex-end;
	animation: ${Shine} 1s linear infinite;
	border-radius: 0.2em;
	height: 0.8em;
	margin: 2px;
	width: 30%;
`;

const Line = styled.div`
	background-color: ${R.path(["theme", "darkBlue",])}
	height: 1px;
	margin: 4px 0;
`;

// ------------------------------

const LoadingItem = () => (
	<PostLinkStyled to = "/">
		<LoadingTitle />
		<LoadingDate />
	</PostLinkStyled>
);

const Loading = () => (
	<LoadingContainer>
		<LoadingItem />
		<LoadingItem />
		<LoadingItem />
	</LoadingContainer>
);

const PostLink = ({ title, modifiedAt, slug, }) => (
	<PostLinkStyled to = { `/post/${slug}/` }>
		<PostTitle>{title}</PostTitle>

		<PostDate> {moment(modifiedAt).fromNow()}</PostDate>
	</PostLinkStyled>
);

// ------------------------------

const SideBar = compose(
	graphql(getAllPostsQuery, { name: "allPosts", }),
	graphql(getAllPostsWithExtraQuery, { name: "allPostsPreFetch", }),
)(props => (
	<SideBarStyled>
		<Nav>
			<SideBarText>
				Recent Posts
			</SideBarText>

			<Line />

			{
				props.allPosts.loading
				? <Loading />
				: props.allPosts.objects.map(({ slug, ...rest }) => (
					<PostLink key = { slug } slug = { slug } { ...rest } />
				)).reverse()
			}
		</Nav>

		<Credit>
			<span>By <a href = "https://consulting.codogo.io">Codogo</a></span>

			<span>
				Made using <a href = "https://cosmicjs.com/">Cosmic JS</a>
			</span>
		</Credit>
	</SideBarStyled>
));

SideBar.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"],
};

export default SideBar;
