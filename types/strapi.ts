export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination: StrapiPagination;
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
  name: string;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  avatar: StrapiMedia | null;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

// Strapi v5 Blocks (rich text as structured JSON)
export interface BlockTextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface BlockLinkNode {
  type: "link";
  url: string;
  children: BlockTextNode[];
}

export type BlockInlineNode = BlockTextNode | BlockLinkNode;

export interface BlockParagraph {
  type: "paragraph";
  children: BlockInlineNode[];
}

export interface BlockHeading {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: BlockInlineNode[];
}

export interface BlockListItem {
  type: "list-item";
  children: BlockInlineNode[];
}

export interface BlockList {
  type: "list";
  format: "ordered" | "unordered";
  children: BlockListItem[];
}

export interface BlockQuote {
  type: "quote";
  children: BlockInlineNode[];
}

export interface BlockCode {
  type: "code";
  children: BlockTextNode[];
}

export interface BlockImage {
  type: "image";
  image: {
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
  };
  children: BlockTextNode[];
}

export type BlockNode =
  | BlockParagraph
  | BlockHeading
  | BlockList
  | BlockQuote
  | BlockCode
  | BlockImage;

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  cover: StrapiMedia;
  author: Author;
  category: Category;
  blocks: BlockNode[] | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
