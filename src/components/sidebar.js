import React from "react";
import moment from "moment";
import { NavLink, } from "react-router-dom";
import styled, { css, keyframes, } from "styled-components";
import { compose, graphql, } from "react-apollo";

import postIcon from "../img/postIcon.svg";

import { getAllPostsWithExtraQuery, getAllPostsQuery, } from "../graphql";
import config from "../../config";
import * as mixins from "../styles/mixins.js";

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
	flex: 2;
	flex-direction: column;
	height: 100%;
	max-width: ${ ({ fullScreen, }) => fullScreen ? "100vw" : "300px" };
	min-width: 150px;
	overflow: hidden;	
	padding: 1em;
	z-index: 2;

	${ mixins.bp.sm.max`
		${ ({ fullScreen, }) => fullScreen ? "" : "display: none;" }
	`};

	${ mixins.shadow(1) };
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

const SideBarTextContainer = styled.div`
	max-width: 100%;	
`;

const SideBarText = styled.p`
	color: ${R.path(["theme", "white",])};
	font-size: 1.5em;
	margin: .5em 0;
`;

const PostLinkStyled = styled(NavLink)`
	${SideBarStyling}
	display: flex;
	flex-direction: row;
	margin: 1em 0.5em;
`;

const PostTitle = styled.p`
	font-size: 1.2em;
	margin: -0.1em;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const PostDate = styled.div`
	font-size: 0.8em;
	margin-top: 2px;
`;

const PostIcon = styled.div`
	background-color: ${ R.path([ "theme", "white", ]) };
	background-size: cover;
	cursor: pointer;
	height: 1.7em;
	margin-right: 0.5em;
	mask-image: url(${ postIcon });
	width: 1.8em;
	flex: 0 0 1.7em;
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
	max-width: 400px;
`;

const LoadingTitle = styled.div`
	border-radius: .2em;
	height: 1.2em;
	animation: ${Shine} 1s linear infinite;
	width: 70%;
`;

const LoadingDate = styled.div`
	animation: ${Shine} 1s linear infinite;
	border-radius: 0.2em;
	height: 0.8em;
	width: 30%;
	margin-top: 2px;
`;

const Line = styled.div`
	background-color: ${R.path(["theme", "darkBlue",])}
	height: 1px;
	margin: 4px 0;
`;

// ------------------------------

const LoadingItem = () => (
	<PostLinkStyled to = "/">
		<SideBarTextContainer>
			<LoadingTitle />
			<LoadingDate />
		</SideBarTextContainer>
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
		<PostIcon  />

		<SideBarTextContainer>
			<PostTitle>{title}</PostTitle>

			<PostDate> {moment(modifiedAt).fromNow()}</PostDate>
		</SideBarTextContainer>
	</PostLinkStyled>
);

// ------------------------------

const SideBar = compose(
	graphql(getAllPostsQuery, { name: "allPosts", }),
	graphql(getAllPostsWithExtraQuery, { name: "allPostsPreFetch", }),
)(props => (
	<SideBarStyled fullScreen = { !props.match.params.postSlug } >
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
