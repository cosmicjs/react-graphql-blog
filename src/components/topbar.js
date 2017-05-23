import styled, { css, } from "styled-components";
import { Link, } from "react-router-dom";
import * as mixins from "../styles/mixins.js";

// ------------------------------

const TopbarStyled = styled.div`
	align-items: center;
	background-color: ${R.path(["theme", "blue",])};
	flex-direction: row;
	justify-content: space-between;
	left: 0;
	padding: 1em 3em;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 3;
	${ mixins.shadow(1) };
`;

const BlogLinks = styled.div`
	flex-direction: row;
`;

const LinkCSS = css`
	color: ${R.path(["theme", "white",])};
	text-decoration: none;
	text-transform: uppercase;

	&:hover {
		color: ${R.path(["theme", "lightgray",])};
	}
`;

const BlogName = styled(Link)`
	font-size: 1.2em;
	${LinkCSS}
`;

const BlogLink = styled(Link)`
	${LinkCSS}
	margin-left: 2em;
`;

const CosmicLink = styled.a`
	${LinkCSS}
	margin-left: 2em;
`;

// ------------------------------

export default () => (
	<TopbarStyled>
		<BlogName to = "/">
			Demo Blog
		</BlogName>

		<BlogLinks>

			<BlogLink to = "/post/">
				Blog
			</BlogLink>

			<CosmicLink 
				href = "https://cosmicjs.com"
				target = "_blank"
			>
				CosmicJS
			</CosmicLink>
		</BlogLinks>
	</TopbarStyled>
);
