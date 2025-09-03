import Hero from "@/components/hero";
import Container from "@/components/container";
// import Posts from "@/components/posts";
import { eyecatchLocal } from "@/lib/constants";

export default async function Home() {
  // const posts = await getAllPosts9(4);

  // for (const post of posts) {
  //   if (!post.hasOwnProperty("eyecatch")) {
  //     post.eyecatch = eyecatchLocal;
  //   }
  //   const { base64 } = await getPlaiceholder(post.eyecatch.url);
  //   post.eyecatch.blurDataURL = base64;
  // }

  return (
    <Container>
      <Hero title="CUBE" subtitle="output site" imageOn />
      {/* <Posts posts={posts} /> */}
    </Container>
  );
}
