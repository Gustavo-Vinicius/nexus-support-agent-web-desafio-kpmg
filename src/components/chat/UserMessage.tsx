type UserMessageProps = {
  content: string;
};

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[620px] rounded-lg rounded-br-sm bg-primary px-4 py-3 text-sm leading-[150%] whitespace-pre-wrap text-white">
        {content}
      </div>
    </div>
  );
}
