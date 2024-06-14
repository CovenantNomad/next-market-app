import { Skeleton } from "@/components/ui/skeleton";

type MarkdownSkeletonProps = {}

const MarkdownSkeleton = ({}: MarkdownSkeletonProps) => {
  return (
    <Skeleton className="h-[300px]"/>
  );
};

export default MarkdownSkeleton;
