import React, { Fragment } from 'react';
import { Text } from 'slate';

// Slate'in custom tipleri (rich-text-editor.tsx'den kopyalandı)
type CustomElement = {
  type: 'paragraph' | 'heading' | 'list-item' | 'numbered-list' | 'bulleted-list' | 'link' | 'image' | 'align';
  url?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: CustomDescendant[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  fontSize?: string;
};

type CustomDescendant = CustomElement | CustomText;

// Leaf (yaprak) elementlerini render eder (bold, italic, renk vb.)
const Leaf = ({ leaf }: { leaf: CustomText }) => {
  let children: React.ReactNode = leaf.text;

  const style: React.CSSProperties = {};
  if (leaf.color) {
    style.color = leaf.color;
  }
  if (leaf.fontSize) {
    style.fontSize = leaf.fontSize;
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span style={style}>{children}</span>;
};

// Elementleri render eder (paragraf, liste, link vb.)
const Element = ({ element }: { element: CustomElement }) => {
  const style: React.CSSProperties = { textAlign: element.align };
  const children = <Serialize nodes={element.children} />;

  // Boş paragraf kontrolü
  const isEmpty = element.children.length === 1 &&
    Text.isText(element.children[0]) &&
    element.children[0].text === '';

  switch (element.type) {
    case 'bulleted-list':
      return <ul style={style} className="my-4 ml-6 list-disc">{children}</ul>;
    case 'numbered-list':
      return <ol style={style} className="my-4 ml-6 list-decimal">{children}</ol>;
    case 'list-item':
      return <li className="mb-1">{children}</li>;
    case 'link':
      return (
        <a href={element.url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    case 'image':
      return (
        <div style={style} className="my-4">
          <div className="flex justify-center">
            <img src={element.url} alt="" className="block max-w-full max-h-80" />
          </div>
        </div>
      );
    default:
      return (
        <p style={style} className="mb-4 last:mb-0">
          {isEmpty ? '\u00A0' : children}
        </p>
      );
  }
};

// Gelen node dizisini serialize eder
const Serialize = ({ nodes }: { nodes: CustomDescendant[] }) => {
  return (
    <>
      {nodes.map((node, i) => {
        if (Text.isText(node)) {
          return <Leaf key={i} leaf={node} />;
        }

        if (node.type) {
          return <Element key={i} element={node} />;
        }
        
        return <Fragment key={i}></Fragment>;
      })}
    </>
  );
};


interface RichTextRendererProps {
  data: string | CustomDescendant[];
}

export const RichTextRenderer = ({ data }: RichTextRendererProps) => {
  let parsedData: CustomDescendant[];

  try {
    if (typeof data === 'string') {
      parsedData = JSON.parse(data);
    } else {
      parsedData = data;
    }
    
    if (!Array.isArray(parsedData)) {
        throw new Error("Data is not an array");
    }

  } catch (error) {
    console.error("Failed to parse rich text data:", error);
    // Hata durumunda ham veriyi veya bir hata mesajı göster
    return <div className="text-red-500">Açıklama yüklenirken bir hata oluştu.</div>;
  }

  return <Serialize nodes={parsedData} />;
};
