// components/Skeletons/SkeletonCard.tsx
export default function SkeletonCard() {
    return (
      <div className="animate-pulse bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
        <div className="h-40 bg-gray-700 rounded-md" />
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    );
  }
  