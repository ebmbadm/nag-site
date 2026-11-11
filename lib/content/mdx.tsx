import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/** Render an MDX string to a React node (server component). */
export async function Mdx({ source }: { source: string }) {
  if (!source.trim()) return null;
  const { default: Content } = await evaluate(source, {
    ...runtime,
    baseUrl: import.meta.url,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  // Styling comes from the surrounding <Prose>.
  return <Content />;
}
