import styled, { css, } from "styled-components";
import { Link, } from "react-router-dom";

const TopbarStyled = styled.div`
	background-color: ${R.path(["theme", "blue",])};
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
	padding: 4px;
	z-index: 3;
`;

const BlogName = styled.div`
	font-size: 2em;
	color: ${R.path(["theme", "white",])};
`;

const BlogLinks = styled.div`
	flex-direction: row;
`;

const LinkCSS = css`
	font-size: 1.5em;
	color: ${R.path(["theme", "white",])};
	margin: 4px;
	text-decoration: none;
`;

const BlogLink = styled(Link)`
	${LinkCSS}
`;

const CosmicLink = styled.a`
	${LinkCSS}
`;

export default () => (
	<TopbarStyled>
		<BlogName>
			Blogname
		</BlogName>

		<BlogLinks>
			<BlogLink to = "/">
				Home
			</BlogLink>

			<BlogLink to = "/post/">
				Blog
			</BlogLink>

			<CosmicLink href = "https://cosmicjs.com">
				CosmicJS
			</CosmicLink>
		</BlogLinks>
	</TopbarStyled>
);
