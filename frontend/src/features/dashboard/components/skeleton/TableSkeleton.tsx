export const TableSkeleton = () => (
    <div className="w-full animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded-md" />
                    <div className="h-3 w-32 bg-gray-100 rounded-md" />
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg" />
            </div>
        ))}
    </div>
);