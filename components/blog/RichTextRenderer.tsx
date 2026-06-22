import React from "react";
import Image from "next/image";
import type {
  BlockNode,
  BlockInlineNode,
  BlockTextNode,
  BlockLinkNode,
} from "@/types/strapi";

function renderInline(node: BlockInlineNode, key: number) {
  if (node.type === "link") {
    const linkNode = node as BlockLinkNode;
    return (
      <a
        key={key}
        href={linkNode.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-acre-green underline underline-offset-2 hover:text-acre-green-hover transition-colors"
      >
        {linkNode.children.map((c, i) => renderText(c, i))}
      </a>
    );
  }
  return renderText(node as BlockTextNode, key);
}

function renderText(node: BlockTextNode, key: number) {
  let content: React.ReactNode = node.text;
  if (node.bold) content = <strong key={key}>{content}</strong>;
  if (node.italic) content = <em key={key}>{content}</em>;
  if (node.underline) content = <u key={key}>{content}</u>;
  if (node.strikethrough) content = <s key={key}>{content}</s>;
  if (node.code)
    content = (
      <code
        key={key}
        className="bg-gray-100 text-acre-text text-sm px-1.5 py-0.5 rounded font-mono"
      >
        {content}
      </code>
    );
  return <span key={key}>{content}</span>;
}

function BlockRenderer({ block }: { block: BlockNode }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-base text-acre-text leading-relaxed mb-5">
          {block.children.map((c, i) => renderInline(c, i))}
        </p>
      );

    case "heading": {
      const headingClass: Record<number, string> = {
        1: "text-3xl sm:text-4xl font-bold text-acre-text mt-10 mb-4",
        2: "text-2xl sm:text-3xl font-bold text-acre-text mt-10 mb-4",
        3: "text-xl sm:text-2xl font-semibold text-acre-text mt-8 mb-3",
        4: "text-lg font-semibold text-acre-text mt-6 mb-2",
        5: "text-base font-semibold text-acre-text mt-4 mb-2",
        6: "text-sm font-semibold text-acre-text mt-4 mb-2",
      };
      const Tag = `h${block.level}` as React.ElementType;
      return (
        <Tag className={headingClass[block.level]}>
          {block.children.map((c, i) => renderInline(c, i))}
        </Tag>
      );
    }

    case "list": {
      const Tag = block.format === "ordered" ? "ol" : "ul";
      const listClass =
        block.format === "ordered"
          ? "list-decimal list-outside pl-6 mb-5 space-y-2"
          : "list-disc list-outside pl-6 mb-5 space-y-2";
      return (
        <Tag className={listClass}>
          {block.children.map((item, i) => (
            <li key={i} className="text-base text-acre-text leading-relaxed">
              {item.children.map((c, j) => renderInline(c, j))}
            </li>
          ))}
        </Tag>
      );
    }

    case "quote":
      return (
        <blockquote className="border-l-4 border-acre-green pl-5 my-6 italic text-acre-muted text-base leading-relaxed">
          {block.children.map((c, i) => renderInline(c, i))}
        </blockquote>
      );

    case "code":
      return (
        <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto mb-5">
          <code className="text-sm font-mono text-acre-text">
            {block.children.map((c) => c.text).join("")}
          </code>
        </pre>
      );

    case "image": {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
      const src = block.image.url.startsWith("http")
        ? block.image.url
        : strapiUrl + block.image.url;
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Image
              src={src}
              alt={block.image.alternativeText ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        </figure>
      );
    }

    default:
      return null;
  }
}

export function RichTextRenderer({ blocks }: { blocks: BlockNode[] }) {
  return (
    <div className="prose-custom">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}
