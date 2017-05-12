import React from "react";
import styled from "styled-components";

const SocialContainer = styled.div`
	top: 50px;
	left: 50px;
	position: absolute;
`;

const SocialLink = styled.a`
	width: 3em;
	height: 3em;
	max-width: 3em;
	max-height: 3em;
	margin: 0.2em;

	&:hover svg {
		fill: ${ R.path([ "theme", "darkBlueLight", ]) };
	}
	& svg {
		fill: ${ R.path([ "theme", "darkBlue", ]) };
	}
`;

export default (props) => (
	<SocialContainer>
		<p>SHARE</p>

		<SocialLink
			href="http://www.facebook.com/sharer.php?t=${ encodeURI(page.pagetitle) }&u=${ encodeURI(page.url) }"
			target="_blank"
		>
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<rect height="512" rx="15%" width="512"/>
				<path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" fill="#fff"/>
			</svg>
		</SocialLink>

		<SocialLink
			href="https://twitter.com/intent/tweet?text=${ encodeURI(page.pagetitle) }&url=${ encodeURI(page.url) }" 
			target="_blank"
		>
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<rect height="512" rx="15%" width="512"/>
				<path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" fill="#fff"/>
			</svg>
		</SocialLink>

		<SocialLink
			href="mailto:?subject=${ page.articletitle }&amp;body=Take a look at this article:\n${ page.articletitle }\n${ page.url}"
		>
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" >
				<rect width="512" height="512" rx="15%"/>
				<rect x="56" y="111" width="400" height="290" rx="44" fill="#fff"/>
				<path d="m89 148h334v216h-334"/>
				<path d="m437 158-157 136c-16 14-32 14-48 0l-157-136m349 206-105-105m-231 105 107-107" fill="none" stroke="#fff" strokeWidth="24"/>
			</svg>
		</SocialLink>
	</SocialContainer>
);
