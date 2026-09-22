export default function LeadDetailsPageSkeleton() {
  return (
    <div className="w-full flex flex-row justify-start items-start gap-4 py-4">
      <div className="w-full max-w-52 h-full space-y-2">
        <div className="bg-muted rounded w-10 h-10 aspect-square mb-5 animate-pulse delay-75"></div>
        <div className="h-8 bg-muted rounded w-full animate-pulse delay-200"></div>
        <div className="h-8 bg-muted rounded w-3/4 animate-pulse delay-75"></div>
        <div className="h-8 bg-muted rounded w-3/6 animate-pulse delay-300"></div>
        <div className="h-8 bg-muted rounded w-3/5 animate-pulse delay-100"></div>
      </div>
      <div className="w-full h-fit pl-2 pr-4 space-y-20">
        <div className="w-full flex flex-row justify-start items-start h-full space-y-4">
          <div className="flex items-center mt-2">
            <div className="w-28 h-28 bg-muted rounded-full animate-pulse mr-4 "></div>
            <div className="flex flex-col gap-y-3">
              <div className="h-6 bg-muted rounded w-64 animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex gap-10 flex-col">
          <div className="w-full flex flex-col gap-4">
            <div className="h-8 bg-muted rounded w-52 animate-pulse delay-75"></div>
            <div className="w-full flex flex-row gap-4">
              <div className="h-56 bg-muted rounded w-full animate-pulse delay-300"></div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="h-8 bg-muted rounded w-52 animate-pulse delay-75"></div>
            <div className="w-full flex flex-row gap-4">
              <div className="h-56 bg-muted rounded w-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
