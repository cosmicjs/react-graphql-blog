import React from "react";
import { ApolloProvider, } from "react-apollo";
import { BrowserRouter as Router, } from "react-router-dom";
import styled, { ThemeProvider, } from "styled-components";

import client from "./graphql";

import Topbar from "./components/topbar";
import Posts from "./components/posts";
import theme from "./theme";

// ------------------------------

const RootStyled = styled.div`
	flex: 1;
	align-items: stretch;
`;

const Root = () => (
	<RootStyled>
		<Topbar />
		<Posts />
	</RootStyled>
);

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
