import React, { useState, useRef, useMemo, useCallback } from 'react';

interface ContentItem {
  type: 'tag' | 'text';
  value: string;
  offset?: number;
}

const initialTags = ['React', 'Next.js', 'Tailwind', 'Hire', 'Przemek','JavaScript', 'CSS'];

const DynamicInput: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>(initialTags);
  const editorRef = useRef<HTMLDivElement>(null);

  const suggestionTags = useMemo(() => availableTags, [availableTags]);

  const removeTag = useCallback(
    (tagToRemove: string) => {
      setContent(prevContent => prevContent.filter(item => item.value !== tagToRemove));
      setAvailableTags(prevTags => [...prevTags, tagToRemove]);
    },
    []
  );

  const createTagElement = useCallback(
    (tag: string) => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'inline-block bg-blue-500 text-blue-100 px-2 py-1 mx-2 mb-2 rounded-lg whitespace-nowrap';
      tagSpan.textContent = tag;
      tagSpan.contentEditable = 'false';

      const removeButton = document.createElement('button');
      removeButton.className = 'ml-2 text-red-500';
      removeButton.textContent = '(x)';
      removeButton.onclick = () => {
        removeTag(tag);
        tagSpan.remove();
      };
      tagSpan.appendChild(removeButton);

      return tagSpan;
    },
    [removeTag]
  );

  const addTag = useCallback(
    (tag: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      let range = getCurrentRange();
      if (!range || !editor.contains(range.startContainer)) {
        moveCaretToEnd(editor);
        range = getCurrentRange();
      }

      const textBeforeTag = inputText.trim();
      const newContent: ContentItem[] = [
        ...content,
        { type: 'text', value: textBeforeTag },
        { type: 'tag', value: tag }
      ];

      setInputText('');
      setContent(newContent);
      setAvailableTags(tags => tags.filter(t => t !== tag));

      if (range) {
        const tagElement = createTagElement(tag);
        range.deleteContents();
        range.insertNode(tagElement);
        positionCaretAfter(tagElement);
      }
    },
    [content, inputText, createTagElement]
  );

  const getCurrentRange = () => {
    const selection = window.getSelection();
    return selection?.rangeCount ? selection.getRangeAt(0) : null;
  };

  const positionCaretAfter = (element: HTMLElement) => {
    const nextRange = document.createRange();
    nextRange.setStartAfter(element);
    nextRange.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(nextRange);
    editorRef.current?.focus();
  };

  const moveCaretToEnd = (element: HTMLDivElement) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.focus();
  };

  return (
    <div className="max-w-md mx-auto my-10 p-4 border border-gray-800 rounded-lg bg-gray-900 text-white">
      <div className="flex flex-wrap mb-2">
        {suggestionTags.map((tag, index) => (
          <button
            key={index}
            className="mr-2 mb-2 px-2 py-1 bg-blue-800 text-blue-300 rounded-lg hover:bg-blue-600"
            onClick={() => addTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="border border-gray-800 rounded-lg p-2 focus-within:border-blue-500 bg-gray-800 text-white"
        contentEditable
        suppressContentEditableWarning={true}
      >
        {/* Content to be rendered */}
      </div>
    </div>
  );
};

export default DynamicInput;
