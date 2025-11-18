'use clinet';

type QuestionCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};
export function QuestionCard({
  title,
  description,
  onClick,
}: QuestionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full text-left rounded-xl border border-zinc-300/40 
        dark:border-zinc-700/60 px-4 py-3 mb-3
        bg-zinc-50 dark:bg-zinc-900/60
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        transition-colors duration-200
        cursor-pointer
      "
    >
      <div className="font-medium">{title}</div>
      {description && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
    </button>
  );
}
