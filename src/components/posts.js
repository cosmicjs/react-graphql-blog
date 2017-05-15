import styled from "styled-components";
import { Route, Switch, } from "react-router";
import { Helmet, } from "react-helmet";

import Post, { Blank, Home, FourOhFour, } from "./post";
import SideBar from "./sidebar";

const PostsStyled = styled.div`
	background-color: ${R.path(["theme", "white",])};
	flex-direction: row;
	margin-top: 3.2em;
	height: 100%;
`;

export default () => (
	<PostsStyled>
		<Helmet>
			<title>Blog Posts</title>
		</Helmet>

		<Route path = "/post/:postSlug?" component = { SideBar } />

		<Switch>
			<Route path = "/post/:postSlug" component = { Post } />
			
			<Route path = "/post/" component = { Blank } />
			
			<Route path = "/" exact component = { Home } />

			<Route component = { FourOhFour } />
		</Switch>
	</PostsStyled>
);
