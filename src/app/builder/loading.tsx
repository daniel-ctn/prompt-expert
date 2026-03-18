import { Skeleton } from "@/components/ui/skeleton";

export default function BuilderLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[600px] rounded-lg" />
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    </div>
  );
}
