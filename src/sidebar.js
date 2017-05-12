import React from "react";
import moment from "moment";
import { NavLink, } from "react-router-dom";
import styled, { css, keyframes, } from "styled-components";

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
	background-color: ${R.path(["theme", "blue",])};
	display: flex;
	flex-direction: column;
	flex: 2;
	height: 100vh;
	max-width: 300px;
	min-width: 150px;
	padding: 1em;
`;

const SideBarStyling = css`
	margin: 2px;
	text-decoration: none;
	color: ${R.path(["theme", "white",])};

	&:hover {
		color: ${R.path(["theme", "lightgray",])};
	}

	&.active {
		color: ${R.path(["theme", "darkBlue",])};

		&:hover {
			color: ${R.path(["theme", "darkBlueLight",])};
		}
	}
`;

const SideBarText = styled.p`
	${SideBarStyling}
	font-size: 1.2em;
	color: ${R.path(["theme", "lightgray",])};
`;

const SideBarLink = styled(NavLink)`
	${SideBarStyling}
	font-size: 1.2em;
`;

const PostLinkStyled = styled(NavLink)`
	${SideBarStyling}
	display: flex;
	flex-direction: column;
	margin: 0.3em;
`;

const PostTitle = styled.p`
	font-size: 1.5em;
	margin: -0.2em;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 100%;
`;

const PostDate = styled.div`
	font-size: 1em;
	align-self: flex-end;
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
			color: ${R.path(["theme", "darkBlueLight",])};
		}
	}
`;

const LoadingContainer = styled.div`
	align-self: stretch;
	align-items: stretch;
	flex: 1;
`;

const LoadingTitle = styled.div`
	margin: 2px;
	height: 1.5em;
	animation: ${Shine} 1s linear infinite;
	width: 70%;
`;

const LoadingDate = styled.div`
	margin: 2px;
	height: 1em;
	animation: ${Shine} 1s linear infinite;
	align-self: flex-end;
	width: 50%;
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
	<PostLinkStyled to = { `/post/${slug}` }>
		<PostTitle>{title}</PostTitle>

		<PostDate> {moment(modifiedAt).fromNow()}</PostDate>
	</PostLinkStyled>
);

// ------------------------------

export default props => (
	<SideBarStyled>
		<Nav>
			<SideBarLink exact to = "/">
				Home
			</SideBarLink>

			<SideBarText>
				Posts
			</SideBarText>

			{props.loading
				? <Loading />
				: props.posts.map(({ slug, ...rest }) => (
					<PostLink key = { slug } slug = { slug } { ...rest } />
					))}

		</Nav>

		<Credit>
			<span>By <a href = "https://consulting.codogo.io">Codogo</a></span>

			<span>
				Made using <a href = "https://cosmicjs.com/">Cosmic JS</a>
			</span>
		</Credit>
	</SideBarStyled>
);
