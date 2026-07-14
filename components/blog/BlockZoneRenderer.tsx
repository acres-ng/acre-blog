import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ENV } from "@/lib/env";
import type { DynamicZoneBlock, StrapiMedia } from "@/types/strapi";
import type { Components } from "react-markdown";

function strapiImageUrl(url: string) {
  return url.startsWith("http") ? url : ENV.STRAPI_URL + url;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl sm:text-4xl font-bold text-acre-text mt-10 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl sm:text-3xl font-bold text-acre-text mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl sm:text-2xl font-semibold text-acre-text mt-8 mb-3">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-acre-text mt-6 mb-2">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base font-semibold text-acre-text mt-4 mb-2">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm font-semibold text-acre-text mt-4 mb-2">{children}</h6>
  ),
  p: ({ children }) => (
    <p className="text-base text-acre-text leading-relaxed mb-5">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-acre-green underline underline-offset-2 hover:text-acre-green-hover transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 mb-5 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 mb-5 space-y-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-base text-acre-text leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-acre-green pl-5 my-6 italic text-acre-muted text-base leading-relaxed">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto mb-5">
          <code className="text-sm font-mono text-acre-text">{children}</code>
        </pre>
      );
    }
    return (
      <code className="bg-gray-100 text-acre-text text-sm px-1.5 py-0.5 rounded font-mono">
        {children}
      </code>
    );
  },
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

function MediaBlock({ file }: { file: StrapiMedia }) {
  const src = strapiImageUrl(file.url);
  return (
    <figure className="my-8">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={src}
          alt={file.alternativeText ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
    </figure>
  );
}

function SliderBlock({ files }: { files: StrapiMedia[] }) {
  return (
    <div className="my-8 flex gap-4 overflow-x-auto pb-2">
      {files.map((file) => {
        const src = strapiImageUrl(file.url);
        return (
          <div
            key={file.id}
            className="relative flex-shrink-0 w-72 aspect-video rounded-xl overflow-hidden"
          >
            <Image
              src={src}
              alt={file.alternativeText ?? ""}
              fill
              className="object-cover"
              sizes="288px"
            />
          </div>
        );
      })}
    </div>
  );
}

function DynamicBlock({ block }: { block: DynamicZoneBlock }) {
  switch (block.__component) {
    case "shared.rich-text":
      return (
        <ReactMarkdown components={markdownComponents}>{block.body}</ReactMarkdown>
      );

    case "shared.quote":
      return (
        <blockquote className="border-l-4 border-acre-green pl-5 my-6 italic text-acre-muted text-base leading-relaxed">
          <p>{block.body}</p>
          {block.title && (
            <footer className="mt-2 text-sm font-semibold not-italic text-acre-text">
              — {block.title}
            </footer>
          )}
        </blockquote>
      );

    case "shared.media":
      return block.file ? <MediaBlock file={block.file} /> : null;

    case "shared.slider":
      return block.files?.length ? <SliderBlock files={block.files} /> : null;

    default:
      return null;
  }
}

export function BlockZoneRenderer({ blocks }: { blocks: DynamicZoneBlock[] }) {
  return (
    <div className="prose-custom">
      {blocks.map((block, i) => (
        <DynamicBlock key={block.id ?? i} block={block} />
      ))}
    </div>
  );
}
