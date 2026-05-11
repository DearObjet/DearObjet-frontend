import { useEffect, useRef, useState } from 'react';

interface ExpandableTextProps {
  content: string;
  lineClamp?: number;
  className?: string;
}

export const ExpandableText = ({
  content,
  lineClamp = 6,
  className = '',
}: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight);
  }, [content]);

  return (
    <div className="flex flex-col gap-1">
      <p
        ref={textRef}
        style={{ WebkitLineClamp: isExpanded ? 'unset' : lineClamp }}
        className={`text-sm text-theme-700 ${
          isExpanded ? '' : 'line-clamp-6'
        } ${className}`}
      >
        {content}
      </p>

      {isClamped && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 self-start text-xs text-theme-500 hover:text-theme-900"
        >
          {isExpanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  );
};
