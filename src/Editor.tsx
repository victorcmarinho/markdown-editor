import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { ComponentProps, ReactNode } from "react";
import {
  RxCode,
  RxFontBold,
  RxFontItalic,
  RxListBullet,
  RxQuote,
  RxStrikethrough,
} from "react-icons/rx";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuImage,
  LuLink,
} from "react-icons/lu";
import { Markdown } from "tiptap-markdown";
import Image from "@tiptap/extension-image";

import { Plugin } from "prosemirror-state";

// define your extension array
const extensions = [
  StarterKit,
  Link,

  Image.extend({
    addProseMirrorPlugins: () => {
      return [
        new Plugin({
          props: {
            handleDOMEvents: {
              drop(view, event) {
                const hasFiles =
                  event.dataTransfer &&
                  event.dataTransfer.files &&
                  event.dataTransfer.files.length;

                if (!hasFiles) {
                  return;
                }

                const images = Array.from(event.dataTransfer.files).filter(
                  (file) => /image/i.test(file.type)
                );

                if (images.length === 0) {
                  return;
                }

                event.preventDefault();

                const { schema } = view.state;
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });

                images.forEach((image) => {
                  const reader = new FileReader();

                  reader.onload = (readerEvent) => {
                    const node = schema.nodes.image.create({
                      src: readerEvent.target!.result,
                    });
                    const transaction = view.state.tr.insert(
                      coordinates!.pos,
                      node
                    );
                    view.dispatch(transaction);
                  };
                  reader.readAsDataURL(image);
                });
              },
              paste(view, event) {
                const hasFiles =
                  event.clipboardData &&
                  event.clipboardData.files &&
                  event.clipboardData.files.length;

                if (!hasFiles) {
                  return;
                }

                const images = Array.from(event.clipboardData.files).filter(
                  (file) => /image/i.test(file.type)
                );

                if (images.length === 0) {
                  return;
                }

                event.preventDefault();

                const { schema } = view.state;

                images.forEach((image) => {
                  const reader = new FileReader();

                  reader.onload = (readerEvent) => {
                    const node = schema.nodes.image.create({
                      src: readerEvent.target!.result,
                    });
                    const transaction =
                      view.state.tr.replaceSelectionWith(node);
                    view.dispatch(transaction);
                  };
                  reader.readAsDataURL(image);
                });
              },
            },
          },
        }),
      ];
    },
  }),
  Markdown.configure({
    transformPastedText: true,
    linkify: true,
    breaks: true,
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "Untitled";
      }

      if (node.type.name === "editorBlock") {
        return "";
      }

      return "Type '/' to see commands...";
    },
  }),
];

const content = "# Hello World!";

interface FloatingMenuButtonProps extends ComponentProps<"button"> {
  imgURL: string;
  title: string;
  description: string;
}

const FloatingMenuButton = (props: FloatingMenuButtonProps) => (
  <button
    {...props}
    className="flex items-center gap-2 p-1 rounded min-w-[200px] hover:bg-zinc-600"
  >
    <img
      src={props.imgURL}
      alt={props.title}
      className="w-12 border border-zinc-600 rounded"
    />
    <div className="flex flex-col text-left ">
      <span className="text-sm">{props.title}</span>
      <span className="text-xs text-zinc-400">{props.description}</span>
    </div>
  </button>
);

interface BubbleButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

const BubbleButton = (props: BubbleButtonProps) => (
  <button
    className="p-2 text-zinc-200 text-sl flex items-center gap-1.5 font-medium leading-none  hover:text-[#007535] data-[active=true]:text-[#90b823]"
    {...props}
  />
);

export const Editor = () => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: "prose focus:outline-none",
      },
    },
  });

  return (
    <div>
      {editor && (
        <div className="min-w-max text-sm bg-zinc-700 shadow-xl border border-zinc-600 shadow-black/20 rounded-lg overflow-hidden flex divide-x divide-zinc-600">
          <div className="flex items-center">
            <BubbleButton
              onClick={() =>
                editor.chain().focus().setHeading({ level: 1 }).run()
              }
              data-active={editor.isActive("h1")}
            >
              <LuHeading1 />
            </BubbleButton>
            <BubbleButton
              onClick={() =>
                editor.chain().focus().setHeading({ level: 2 }).run()
              }
              data-active={editor.isActive("h2")}
            >
              <LuHeading2 />
            </BubbleButton>
            <BubbleButton
              onClick={() =>
                editor.chain().focus().setHeading({ level: 3 }).run()
              }
              data-active={editor.isActive("h3")}
            >
              <LuHeading3 />
            </BubbleButton>
            <BubbleButton
              onClick={() =>
                editor.chain().focus().setHeading({ level: 4 }).run()
              }
              data-active={editor.isActive("h4")}
            >
              <LuHeading4 />
            </BubbleButton>
            <BubbleButton
              onClick={() =>
                editor.chain().focus().setHeading({ level: 5 }).run()
              }
              data-active={editor.isActive("h5")}
            >
              <LuHeading5 />
            </BubbleButton>
            <BubbleButton
              onClick={() =>
                editor.chain().focus().setHeading({ level: 6 }).run()
              }
              data-active={editor.isActive("h6")}
            >
              <LuHeading6 />
            </BubbleButton>
            <BubbleButton
              onClick={() =>
                editor.chain().focus().setHeading({ level: 6 }).run()
              }
              data-active={editor.isActive("h6")}
            >
              <LuHeading6 />
            </BubbleButton>
            <BubbleButton
              onClick={() => {
                if (editor.isActive("link")) {
                  editor.chain().focus().unsetLink().run();
                  return;
                }

                const previousUrl = editor.getAttributes("link").href;
                const url = window.prompt("URL", previousUrl);

                // cancelled
                if (url === null) {
                  return;
                }

                // empty
                if (url === "") {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run();

                  return;
                }

                // update link
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url, target: "_blank" })
                  .run();
              }}
              data-active={editor.isActive("link")}
            >
              <LuLink />
            </BubbleButton>

            <BubbleButton
              onClick={() => {
                if (editor.isActive("link")) {
                  editor.chain().focus().unsetLink().run();
                  return;
                }

                const previousUrl = editor.getAttributes("link").href;
                const url = window.prompt("URL", previousUrl);

                // cancelled
                if (url === null) {
                  return;
                }

                // empty
                if (url === "") {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run();

                  return;
                }

                // update link
                editor.chain().focus().setImage({ src: url }).run();
              }}
              data-active={editor.isActive("image")}
            >
              <LuImage />
            </BubbleButton>

            <BubbleButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              data-active={editor.isActive("bold")}
            >
              <RxFontBold className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              data-active={editor.isActive("italic")}
            >
              <RxFontItalic className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              data-active={editor.isActive("strike")}
            >
              <RxStrikethrough className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              data-active={editor.isActive("code")}
            >
              <RxCode className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              data-active={editor.isActive("blockquote")}
            >
              <RxQuote className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              data-active={editor.isActive("bulletList")}
            >
              <RxListBullet className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              data-active={editor.isActive("orderedList")}
            >
              <RxListBullet className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              data-active={editor.isActive("AI")}
            >
              RA IA (Inteligência Artificial)
            </BubbleButton>
          </div>
        </div>
      )}

      <EditorContent editor={editor} className="max-w-[700px] mx-auto pt-16" />
      {editor && (
        <FloatingMenu
          className="min-w-[320px] bg-zinc-700 py-2 px-1 shadow-xl border gap-1 border-zinc-600 shadow-black/20 rounded-lg overflow-hidden flex flex-col"
          editor={editor}
          shouldShow={({ state }) => {
            const { $from } = state.selection;
            const currentLineText = $from.nodeBefore?.textContent;
            return currentLineText === "/";
          }}
        >
          <FloatingMenuButton
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            imgURL="https://www.notion.so/images/blocks/header.57a7576a.png"
            title="Heading 1"
            description="Big section heading."
          ></FloatingMenuButton>

          <FloatingMenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            imgURL="https://www.notion.so/images/blocks/subheader.9aab4769.png"
            title="Heading 2"
            description="Medium section heading."
          ></FloatingMenuButton>

          <FloatingMenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            imgURL="https://www.notion.so/images/blocks/subsubheader.d0ed0bb3.png"
            title="Heading 3"
            description="Small section heading."
          ></FloatingMenuButton>

          <FloatingMenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            imgURL="https://www.notion.so/images/blocks/bulleted-list.0e87e917.png"
            title="Bulleted list"
            description="Create a simple bulleted list."
          ></FloatingMenuButton>

          <FloatingMenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            imgURL="https://www.notion.so/images/blocks/numbered-list.0406affe.png"
            title="Numbered list"
            description="Create a list with numbering."
          ></FloatingMenuButton>

          <FloatingMenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            imgURL="https://www.notion.so/images/blocks/quote/en-US.png"
            title="Quote"
            description="Capture a quote."
          ></FloatingMenuButton>

          <FloatingMenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            imgURL="https://www.notion.so/images/blocks/text/en-US.png"
            title="Code"
            description="Capture a code snippet."
          ></FloatingMenuButton>
        </FloatingMenu>
      )}
      {editor && (
        <BubbleMenu
          className="min-w-max text-sm bg-zinc-700 shadow-xl border border-zinc-600 shadow-black/20 rounded-lg overflow-hidden flex divide-x divide-zinc-600"
          editor={editor}
        >
          <div className="flex items-center">
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              data-active={editor.isActive("bold")}
            >
              <RxFontBold className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              data-active={editor.isActive("italic")}
            >
              <RxFontItalic className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              data-active={editor.isActive("strike")}
            >
              <RxStrikethrough className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              data-active={editor.isActive("code")}
            >
              <RxCode className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              data-active={editor.isActive("blockquote")}
            >
              <RxQuote className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              data-active={editor.isActive("bulletList")}
            >
              <RxListBullet className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              data-active={editor.isActive("orderedList")}
            >
              <RxListBullet className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              data-active={editor.isActive("orderedList")}
            >
              RA IA (Inteligência Artifical)
            </BubbleButton>
          </div>
        </BubbleMenu>
      )}
      {editor && (
        <div className="border-2 border-solid border-[#0c0c0c] mt-44">
          <button
            onClick={() => console.log(editor.storage.markdown.getMarkdown())}
          >
            Salvar
          </button>
          <div style={{ whiteSpace: "pre-line" }} className="mt-3">
            <div>resultado em markdown</div>
            {editor.storage.markdown.getMarkdown()}
          </div>
        </div>
      )}
    </div>
  );
};
