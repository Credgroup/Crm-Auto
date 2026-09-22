import { cn } from "@/lib/utils";
import SmallAvatarSkeleton from "./SmallAvatarSkeleton";

type ContactsSkeletonProps = {
  className?: string;
};

export default function ContactsSkeleton({
  className,
}: Readonly<ContactsSkeletonProps>) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <SmallAvatarSkeleton />
      <div className="flex flex-col gap-y-2">
        <div className="h-10 bg-muted rounded-md w-full animate-pulse delay-75"></div>
        <div className="h-10 bg-muted rounded-md w-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
}
