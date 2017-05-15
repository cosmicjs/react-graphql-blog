import { ApolloClient, createNetworkInterface, } from "react-apollo";
import { toIdValue, } from "apollo-client";

// ------------------------------

const networkInterface = createNetworkInterface({
	uri: "https://graphql.cosmicjs.com/v1",
});

const dataIdFromObject = ({ __typename, slug, }) => __typename + slug;

const customResolvers = {
	Query: {
		object: (_, args) =>
			toIdValue(
				dataIdFromObject({ __typename: "Object", slug: args.slug, }),
			),
	},
};

const client = new ApolloClient({
	networkInterface,
	dataIdFromObject,
	customResolvers,
});

// ------------------------------

export default client;

export { default as getAllPostsQuery, } from "./queries/getAllPosts.graphql";

export {
	default as getAllPostsWithExtraQuery,
} from "./queries/getAllPostsWithExtra.graphql";

export {
	default as getNextAndPrevPostsQuery,
} from "./queries/getNextAndPrevPosts.graphql";

export { default as getPostQuery, } from "./queries/getPost.graphql";
