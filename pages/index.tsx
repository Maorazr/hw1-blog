import React from "react";
import { useState, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import Paginate from "../components/Paginate";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const page = context.query.page ? parseInt(context.query.page as string) : 1;
  const postsPerPage = 10;
  const skip = (page - 1) * postsPerPage;

  const feed = await prisma.post.findMany({
    where: {
      published: true,
    },
    skip,
    take: postsPerPage,
    orderBy: {
      // createdAt: 'desc',
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  const totalPosts = await prisma.post.count({
    where: {
      published: true,
    },
  });

  return {
    props: {
      feed,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / postsPerPage),
    },
  };
};

type Props = {
  feed: PostProps[];
  currentPage: number;
  totalPages: number;
};

// the Blog component below receives its props from the function above
const Blog: React.FC<Props> = (props) => {
  const { currentPage, totalPages } = props;
  const router = useRouter();

  const paginate = (pageNumber: number) => {
    // Update the URL to include the page query parameter
    router.push({
      pathname: "/",
      query: { page: pageNumber },
    });
  };

  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <Paginate
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
        <main>
          {props.feed.map((post, i) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Blog;
