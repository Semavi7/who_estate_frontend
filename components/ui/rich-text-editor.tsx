import React, { useState, useMemo, useCallback, forwardRef } from "react";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  Text as SlateText,
  BaseEditor,
  Range,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  ReactEditor,
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import isHotkey from "is-hotkey";

import { Button } from "./button";
import { Separator } from "./separator";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";
import { Label } from "./label";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Link,
  Image,
  Palette,
} from "lucide-react";

// Slate's custom types
type CustomElement = {
  type: "paragraph" | "heading" | "list-item" | "numbered-list" | "bulleted-list" | "link" | "image" | "align";
  url?: string;
  align?: "left" | "center" | "right" | "justify";
  children: Descendant[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  fontSize?: string;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Props for the editor
interface RichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  className?: string;
}

const HOTKEYS: { [key: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder = "İlan açıklamasını yazın...", className = "" }, ref) => {
    const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);

    const renderElement = useCallback((props: any) => <Element {...props} />, []);
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          const mark = HOTKEYS[hotkey];
          toggleMark(editor, mark);
        }
      }
    };

    return (
      <div className={`rich-text-editor border-2 border-input rounded-md bg-background shadow-sm  ${className}`}>
        <Slate editor={editor} initialValue={value} onChange={onChange}>
          <Toolbar>
            <MarkButton format="bold" icon={<Bold className="h-4 w-4" />} title="Kalın (Ctrl+B)" />
            <MarkButton format="italic" icon={<Italic className="h-4 w-4" />} title="İtalik (Ctrl+I)" />
            <MarkButton format="underline" icon={<Underline className="h-4 w-4" />} title="Altı Çizili (Ctrl+U)" />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <BlockButton format="left" icon={<AlignLeft className="h-4 w-4" />} title="Sola Hizala" />
            <BlockButton format="center" icon={<AlignCenter className="h-4 w-4" />} title="Ortala" />
            <BlockButton format="right" icon={<AlignRight className="h-4 w-4" />} title="Sağa Hizala" />
            <BlockButton format="justify" icon={<AlignJustify className="h-4 w-4" />} title="İki Yana Yasla" />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <BlockButton format="bulleted-list" icon={<List className="h-4 w-4" />} title="Madde İşareti" />
            <BlockButton format="numbered-list" icon={<ListOrdered className="h-4 w-4" />} title="Numaralı Liste" />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button
              variant="ghost" size="sm" className="h-8 w-8 p-0"
              onMouseDown={() => editor.undo()}
              title="Geri Al (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="sm" className="h-8 w-8 p-0"
              onMouseDown={() => editor.redo()}
              title="Yinele (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <LinkButton />
            <ImageButton />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <FontSizePicker />
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ColorPicker />
            <Button
              variant="ghost" size="sm" className="h-8 px-2 text-xs"
              onMouseDown={() => removeFormat(editor)}
              title="Formatı Temizle"
            >
              Temizle
            </Button>
          </Toolbar>
          <div
            ref={ref}
            className="min-h-96 max-h-64 overflow-y-auto p-3 focus:outline-none"
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              className="focus:outline-none"
            />
          </div>
        </Slate>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

const Toolbar = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b border-input p-2 bg-muted/30 ">
    <div className="flex flex-wrap items-center gap-1 ">{children}</div>
  </div>
);

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type");
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : (format as any),
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : (format as any),
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as SlateElement;
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as any)[format] === true : false;
};

const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "link":
      return (
        <a {...attributes} href={element.url} className="text-blue-500 underline">
          {children}
        </a>
      );
    case "image":
      return (
        <div {...attributes} style={style}>
          <div contentEditable={false} className="flex justify-center">
            <img src={element.url} className="block max-w-full max-h-80" />
          </div>
          {children}
        </div>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  const style: React.CSSProperties = {
    fontWeight: leaf.bold ? 'bold' : 'normal',
    fontStyle: leaf.italic ? 'italic' : 'normal',
    textDecoration: leaf.underline ? 'underline' : 'none',
    color: leaf.color,
    fontSize: leaf.fontSize,
  };

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

const BlockButton = ({ format, icon, title }: { format: string; icon: React.ReactNode; title?: string }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type");
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 ${isActive ? "bg-primary text-primary-foreground" : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      title={title}
    >
      {icon}
    </Button>
  );
};

const MarkButton = ({ format, icon, title }: { format: string; icon: React.ReactNode; title?: string }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 ${isActive ? "bg-primary text-primary-foreground" : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      title={title}
    >
      {icon}
    </Button>
  );
};

const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const wrapLink = (editor: Editor, url: string) => {
  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: CustomElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const LinkButton = () => {
  const editor = useSlate();
  const [showDialog, setShowDialog] = useState(false);
  const [url, setUrl] = useState("");

  const handleInsert = () => {
    if (url) {
      insertLink(editor, url);
      setUrl("");
      setShowDialog(false);
    }
  };

  return (
    <Popover open={showDialog} onOpenChange={setShowDialog}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Link Ekle">
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <Label htmlFor="linkUrl">Link URL</Label>
          <Input
            id="linkUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowDialog(false)}>İptal</Button>
            <Button size="sm" onClick={handleInsert}>Ekle</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const insertImage = (editor: Editor, url: string) => {
  const text = { text: "" };
  const image: CustomElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
  Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] }); // Add a new paragraph after the image
};

const ImageButton = () => {
  const editor = useSlate();
  const [showDialog, setShowDialog] = useState(false);
  const [url, setUrl] = useState("");

  const handleInsert = () => {
    if (url) {
      insertImage(editor, url);
      setUrl("");
      setShowDialog(false);
    }
  };

  return (
    <Popover open={showDialog} onOpenChange={setShowDialog}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Resim Ekle">
          <Image className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <Label htmlFor="imageUrl">Resim URL</Label>
          <Input
            id="imageUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowDialog(false)}>İptal</Button>
            <Button size="sm" onClick={handleInsert}>Ekle</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ColorPicker = () => {
  const editor = useSlate();
  const colorOptions = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
    '#FF0000', '#FF6600', '#FFCC00', '#33CC33', '#0066CC',
    '#6600CC', '#CC0066', '#FF3366', '#FF9933', '#FFFF33'
  ];

  const handleColorChange = (color: string) => {
    Editor.addMark(editor, "color", color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Metin Rengi">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded border border-input hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleColorChange(color);
              }}
              title={color}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FontSizePicker = () => {
  const editor = useSlate();
  const marks = Editor.marks(editor);
  const currentFontSize = marks?.fontSize || '16px'; // Default to normal

  const fontSizes = [
    { label: 'Çok Küçük', value: '12px' },
    { label: 'Küçük', value: '14px' },
    { label: 'Normal', value: '16px' },
    { label: 'Büyük', value: '20px' },
    { label: 'Çok Büyük', value: '28px' },
  ];

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    Editor.addMark(editor, 'fontSize', size);
  };

  return (
    <select
      value={currentFontSize}
      onChange={handleFontSizeChange}
      className="h-8 px-2 text-sm border border-input rounded bg-background hover:bg-accent transition-colors cursor-pointer"
      title="Yazı Boyutu"
    >
      {fontSizes.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

const removeFormat = (editor: Editor) => {
  const marks = Editor.marks(editor);
  if (marks) {
    for (const mark in marks) {
      Editor.removeMark(editor, mark);
    }
  }
};

const withImages = (editor: Editor) => {
const { isVoid } = editor;

editor.isVoid = (element) => {
  return element.type === 'image' ? true : isVoid(element);
};

return editor;
};