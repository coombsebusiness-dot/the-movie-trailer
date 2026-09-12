"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  content?: string;

  onChange?: (
    html: string,
  ) => void;
};

const toolbarButton =
  "inline-flex min-h-10 items-center justify-center border border-white/10 bg-[#111317] px-3 py-2 text-sm font-black text-white/80 transition hover:border-[#f21f2b]/60 hover:bg-[#17191e] hover:text-white disabled:cursor-not-allowed disabled:opacity-30";

const activeToolbarButton =
  "!border-[#f21f2b] !bg-[#f21f2b] !text-white";

export default function RichTextEditor({
  content = "",
  onChange,
}: RichTextEditorProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    imageError,
    setImageError,
  ] = useState("");

  const editor =
    useEditor({
      immediatelyRender:
        false,

      extensions: [
        StarterKit,

        TextAlign.configure({
          types: [
            "heading",
            "paragraph",
          ],
        }),

        Link.configure({
          openOnClick:
            false,

          autolink:
            true,

          defaultProtocol:
            "https",

          HTMLAttributes: {
            class:
              "font-bold text-[#f21f2b] underline decoration-[#f21f2b]/40 underline-offset-4 transition hover:text-white",
          },
        }),

        Image.configure({
          HTMLAttributes: {
            class:
              "my-8 h-auto max-w-full border border-white/10",
          },
        }),
      ],

      content:
        content ||
        "<p></p>",

      editorProps: {
        attributes: {
          class:
            "min-h-[360px] px-5 py-5 text-base font-medium leading-8 text-white outline-none [&_p]:my-4 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-black [&_h2]:leading-tight [&_h2]:tracking-tight [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-2xl [&_h3]:font-black [&_h3]:leading-tight [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#f21f2b] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-white/60",
        },
      },

      onUpdate({
        editor,
      }) {
        onChange?.(
          editor.getHTML(),
        );
      },
    });

  useEffect(
    () => {
      if (!editor) {
        return;
      }

      const currentHtml =
        editor.getHTML();

      if (
        content !==
        currentHtml
      ) {
        editor.commands.setContent(
          content ||
            "<p></p>",
          {
            emitUpdate:
              false,
          },
        );
      }
    },
    [
      content,
      editor,
    ],
  );

  if (!editor) {
    return (
      <div className="min-h-[460px] border border-white/10 bg-[#090a0c]" />
    );
  }

  function setLink() {
    if (!editor) {
      return;
    }

    const previousUrl =
      editor
        .getAttributes(
          "link",
        )
        .href as
        | string
        | undefined;

    const url =
      window.prompt(
        "Enter the link URL",
        previousUrl ??
          "",
      );

    if (
      url ===
      null
    ) {
      return;
    }

    const trimmedUrl =
      url.trim();

    if (
      !trimmedUrl
    ) {
      editor
        .chain()
        .focus()
        .extendMarkRange(
          "link",
        )
        .unsetLink()
        .run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange(
        "link",
      )
      .setLink({
        href:
          trimmedUrl,
      })
      .run();
  }

  function openImagePicker() {
    if (
      uploadingImage
    ) {
      return;
    }

    setImageError("");

    fileInputRef
      .current
      ?.click();
  }

  async function handleImageUpload(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setImageError(
        "Please choose an image file.",
      );

      event.target.value =
        "";

      return;
    }

    const maxFileSize =
      10 *
      1024 *
      1024;

    if (
      file.size >
      maxFileSize
    ) {
      setImageError(
        "Image must be smaller than 10MB.",
      );

      event.target.value =
        "";

      return;
    }

    if (!editor) {
      return;
    }

    setUploadingImage(
      true,
    );

    setImageError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/admin/movies/upload",
          {
            method:
              "POST",

            body:
              formData,
          },
        );

      const data =
        (await response.json()) as {
          url?: string;
          error?: string;
        };

      if (
        !response.ok ||
        !data.url
      ) {
        throw new Error(
          data.error ??
            "Image upload failed.",
        );
      }

      const altText =
        window.prompt(
          "Image alt text",
          file.name
            .replace(
              /\.[^/.]+$/,
              "",
            )
            .replace(
              /[-_]+/g,
              " ",
            ),
        ) ?? "";

      editor
        .chain()
        .focus()
        .setImage({
          src:
            data.url,

          alt:
            altText.trim(),
        })
        .run();
    } catch (
      error
    ) {
      setImageError(
        error instanceof Error
          ? error.message
          : "Image upload failed.",
      );
    } finally {
      setUploadingImage(
        false,
      );

      event.target.value =
        "";
    }
  }

  return (
    <div className="overflow-hidden border border-white/10 bg-[#090a0c] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
      <input
        ref={
          fileInputRef
        }
        type="file"
        accept="image/*"
        hidden
        onChange={
          handleImageUpload
        }
      />

      <div className="border-b border-white/10 bg-[#0d0f12] p-3">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
            Editorial Desk
          </p>

          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
            Format Article
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            title="Bold"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            disabled={
              !editor
                .can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive(
                "bold",
              )
                ? activeToolbarButton
                : ""
            }`}
          >
            <strong>
              B
            </strong>
          </button>

          <button
            type="button"
            title="Italic"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={`${toolbarButton} italic ${
              editor.isActive(
                "italic",
              )
                ? activeToolbarButton
                : ""
            }`}
          >
            I
          </button>

          <button
            type="button"
            title="Heading 2"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level:
                    2,
                })
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive(
                "heading",
                {
                  level:
                    2,
                },
              )
                ? activeToolbarButton
                : ""
            }`}
          >
            H2
          </button>

          <button
            type="button"
            title="Heading 3"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level:
                    3,
                })
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive(
                "heading",
                {
                  level:
                    3,
                },
              )
                ? activeToolbarButton
                : ""
            }`}
          >
            H3
          </button>

          <div className="mx-1 hidden w-px bg-white/10 sm:block" />

          <button
            type="button"
            title="Align left"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign(
                  "left",
                )
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive({
                textAlign:
                  "left",
              })
                ? activeToolbarButton
                : ""
            }`}
          >
            ←
          </button>

          <button
            type="button"
            title="Align centre"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign(
                  "center",
                )
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive({
                textAlign:
                  "center",
              })
                ? activeToolbarButton
                : ""
            }`}
          >
            ↔
          </button>

          <button
            type="button"
            title="Align right"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign(
                  "right",
                )
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive({
                textAlign:
                  "right",
              })
                ? activeToolbarButton
                : ""
            }`}
          >
            →
          </button>

          <div className="mx-1 hidden w-px bg-white/10 sm:block" />

          <button
            type="button"
            title="Bullet list"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive(
                "bulletList",
              )
                ? activeToolbarButton
                : ""
            }`}
          >
            • List
          </button>

          <button
            type="button"
            title="Numbered list"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive(
                "orderedList",
              )
                ? activeToolbarButton
                : ""
            }`}
          >
            1. List
          </button>

          <button
            type="button"
            title="Quote"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBlockquote()
                .run()
            }
            className={`${toolbarButton} ${
              editor.isActive(
                "blockquote",
              )
                ? activeToolbarButton
                : ""
            }`}
          >
            “ Quote
          </button>

          <div className="mx-1 hidden w-px bg-white/10 sm:block" />

          <button
            type="button"
            title="Add or edit link"
            onClick={
              setLink
            }
            className={`${toolbarButton} ${
              editor.isActive(
                "link",
              )
                ? activeToolbarButton
                : ""
            }`}
          >
            Link
          </button>

          {editor.isActive(
            "link",
          ) ? (
            <button
              type="button"
              title="Remove link"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .unsetLink()
                  .run()
              }
              className={
                toolbarButton
              }
            >
              Unlink
            </button>
          ) : null}

          <button
            type="button"
            title="Upload image"
            onClick={
              openImagePicker
            }
            disabled={
              uploadingImage
            }
            className={
              toolbarButton
            }
          >
            {uploadingImage
              ? "Uploading..."
              : "Image"}
          </button>

          <div className="mx-1 hidden w-px bg-white/10 sm:block" />

          <button
            type="button"
            title="Undo"
            onClick={() =>
              editor
                .chain()
                .focus()
                .undo()
                .run()
            }
            disabled={
              !editor
                .can()
                .undo()
            }
            className={
              toolbarButton
            }
          >
            ↶
          </button>

          <button
            type="button"
            title="Redo"
            onClick={() =>
              editor
                .chain()
                .focus()
                .redo()
                .run()
            }
            disabled={
              !editor
                .can()
                .redo()
            }
            className={
              toolbarButton
            }
          >
            ↷
          </button>
        </div>
      </div>

      {imageError ? (
        <div className="border-b border-[#f21f2b]/40 bg-[#f21f2b]/10 px-4 py-3 text-sm font-bold text-red-300">
          {imageError}
        </div>
      ) : null}

      <div className="bg-[#090a0c]">
        <EditorContent
          editor={
            editor
          }
        />
      </div>

      <div className="border-t border-white/10 bg-[#0d0f12] px-4 py-3">
        <p className="text-xs font-semibold leading-5 text-white/35">
          Highlight text to format it or add a hyperlink.
          Images are inserted at the current cursor position.
        </p>
      </div>
    </div>
  );
}