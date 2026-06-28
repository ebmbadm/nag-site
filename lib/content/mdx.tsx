import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/** MDX components for prose bodies — styled to the design tokens. */
const components = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }} {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-text" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-accent underline-offset-2 hover:underline" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 list-disc space-y-1 pl-5 text-text-muted" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 mb-3 font-display text-2xl uppercase text-text" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 mb-2 font-display text-xl uppercase text-text" {...props} />
  ),
};

/** Render an MDX string to a React node (server component). */
export async function Mdx({ source }: { source: string }) {
  if (!source.trim()) return null;
  const { default: Content } = await evaluate(source, {
    ...runtime,
    baseUrl: import.meta.url,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  return <Content components={components} />;
}
