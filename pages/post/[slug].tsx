import { fetchGraphqlQuery } from "@/lib/fetchGql";
import { gql } from "graphql-request";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";

type Post = {
  allPost: {
    title: string;
    author: {
      name: string;
    };
  }[];
};

type Paths = {
  allPost: {
    slug: {
      current: string;
    };
  }[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const query = gql`
    query {
      allPost {
        slug {
          current
        }
      }
    }
  `;

  const paths = (await fetchGraphqlQuery(query)) as Paths;

  return {
    paths: paths.allPost.map(({ slug }) => ({
      params: { slug: slug.current },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ post: Post }> = async (
  context
) => {
  // It's important to default the slug so that it doesn't return "undefined"
  //@ts-ignore
  const { slug = "" } = context.params;

  const query = gql`
    query FindPostBySlug($slug: String!) {
      allPost(where: { slug: { current: { eq: $slug } } }) {
        title
        author {
          name
        }
      }
    }
  `;

  const post = (await fetchGraphqlQuery(query, { slug })) as Post;

  return {
    props: {
      post,
    },
  };
};

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { title = "Missing title", author } = post.allPost[0];
  return (
    <>
      <article>
        <h1>{title}</h1>
        <span>By {author.name ?? "missing name"}</span>
      </article>
    </>
  );
};

export default Post;
