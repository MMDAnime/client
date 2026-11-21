interface LoadingProps {
  message?: string;
}

function Loading({ message = "Đang tải dữ liệu..." }: LoadingProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />

      <p className="text-sm font-semibold text-purple-400">{message}</p>
    </div>
  );
}

export default Loading;
