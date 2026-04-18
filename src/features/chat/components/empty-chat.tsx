export const EmptyChat = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-700">
          메시지를 선택하세요
        </h3>
        <p className="text-gray-500">
          왼쪽 목록에서 대화를 선택하거나
          <br />새 메시지를 시작하세요
        </p>
      </div>
    </div>
  );
};
