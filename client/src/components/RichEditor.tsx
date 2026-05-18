import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import Link from '@tiptap/extension-link';
import styles from './RichEditor.module.css';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

function ToolbarButton({ onClick, active, disabled, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.toolbarBtn} ${active ? styles.active : ''}`}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, CodeBlock, Link.configure({ openOnClick: false })],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <ToolbarButton
          title="굵게 (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="기울임 (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          I
        </ToolbarButton>
        <div className={styles.divider} />
        {([1, 2, 3] as const).map((level) => (
          <ToolbarButton
            key={level}
            title={`제목 ${level}`}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })}
          >
            H{level}
          </ToolbarButton>
        ))}
        <div className={styles.divider} />
        <ToolbarButton
          title="인라인 코드"
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
        >
          {'<>'}
        </ToolbarButton>
        <ToolbarButton
          title="코드 블록"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
        >
          {'{ }'}
        </ToolbarButton>
        <div className={styles.divider} />
        <ToolbarButton
          title="글머리 목록"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          title="번호 목록"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          1.
        </ToolbarButton>
        <div className={styles.divider} />
        <ToolbarButton
          title="실행 취소"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          title="다시 실행"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↪
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
}
