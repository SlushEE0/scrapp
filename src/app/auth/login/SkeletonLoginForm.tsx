import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoginForm({}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="ml-auto h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
