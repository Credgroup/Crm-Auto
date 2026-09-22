export default function ProductSkeleton(){
    return (
        <div className="w-full aspect-[3/4] p-4 flex flex-col justify-between bg-muted/80 animate-pulse transition-all group hover:shadow-lg rounded-md">
            <div className="w-full h-4 bg-muted rounded-md"></div>
            <div className="flex flex-col justify-center items-center gap-2">
                <div className="w-1/2 h-4 bg-muted rounded-md"></div>
                <div className="w-full h-4 bg-muted rounded-md"></div>
            </div>
        </div>
    )
}