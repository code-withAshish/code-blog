import { useQuery } from "@tanstack/react-query";
import { gql, GraphQLClient } from "graphql-request";

export const API_URL =
  "https://y82metg4.api.sanity.io/v1/graphql/production/experiment";

const graphQLClient = new GraphQLClient(API_URL);

export function useGetPosts() {
  return useQuery({
    queryKey: ["get-post"],
    queryFn: async () => {
      const response: any = await graphQLClient.request(gql`
        query {
          allPost {
            title
            bodyRaw
          }
        }
      `);

      return response.allPost[0].bodyRaw[0].children[0].text;
    },
  });
}
