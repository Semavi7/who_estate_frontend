import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "../ui/utils"

export function PropertyCardSkeleton({ className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col space-y-3 rounded-xl border shadow-lg bg-card animate-pulse", className)}>
      <Skeleton className="h-[200px] w-full rounded-t-xl" />
      <div className="space-y-2 p-2">
        <Skeleton className="h-6 w-2/5 rounded-xl" />
        <Skeleton className="h-5 w-4/5 rounded-xl" />
        <Skeleton className="h-4 w-1/3 rounded-xl" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-4 w-1/4 rounded-xl" />
          <Skeleton className="h-4 w-1/4 rounded-xl" />
          <Skeleton className="h-4 w-1/4 rounded-xl" />
        </div>
      </div>
      <div className="p-4">
          <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}