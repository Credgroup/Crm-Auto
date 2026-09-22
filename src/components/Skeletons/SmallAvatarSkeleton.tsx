export default function SmallAvatarSkeleton() {
  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="w-12 h-12 aspect-square bg-muted rounded-full animate-pulse"></div>
      <div className="w-full flex flex-col gap-2 max-w-52">
        <div className="h-4 bg-muted rounded w-full animate-pulse delay-75"></div>
        <div className="h-4 bg-muted rounded w-3/5 animate-pulse delay-200"></div>
      </div>
    </div>
  );
}
