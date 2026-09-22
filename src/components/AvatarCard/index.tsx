import { cn } from "@/lib/utils";

type AvatarCardProps = {
    title: string;
    subtitle: string;
    avatar?: string;
    className?: string;
    avatarImageStyle?: "circle" | "square";
    abbreviateContent?: boolean;
    avatarAlign?: "top" | "center";
}

export default function AvatarCard({title, subtitle, avatar, className, avatarImageStyle, abbreviateContent = true, avatarAlign = "center"}: Readonly<AvatarCardProps>) {
    
    const getInitials = (name: string) => {
        const nameParts = name.split(" ");
        let initials = nameParts.map(part => part[0]).join("").toUpperCase()
        return initials.length > 2 ? initials.substring(0, 2) : initials;
    }

    const avatarImage = avatar ?? getInitials(title);
    
    // Extract nested ternary operations into independent statements
    const getDisplayText = (text: string, shouldAbbreviate: boolean) => {
        if (!shouldAbbreviate) return text;
        return text?.length > 20 ? text?.substring(0, 15) + "..." : text;
    };
    
    const displayTitle = getDisplayText(title, abbreviateContent);
    const displaySubtitle = getDisplayText(subtitle, abbreviateContent);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className={cn("flex gap-2", avatarAlign === "top" ? "items-start" : "items-center")}>
                <div className={cn("w-8 h-8 min-w-8 min-h-8 rounded-full bg-muted overflow-hidden shadow-md shadow-zinc-300 dark:shadow-zinc-950/50 border", avatarImageStyle === "square" ? "rounded-md" : "rounded-full")}>
                    {
                        avatar ? (
                            <img src={avatar} alt={title} className={cn("w-full h-full rounded-full", avatarImageStyle === "circle" ? "rounded-full" : "rounded-md")} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                                {avatarImage}
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col">
                    {/* limit title and subtitle to 1 line and 20 characters */}
                    <h1 className={cn("text-base font-bold", abbreviateContent ? "truncate" : "")}>
                        {displayTitle}
                    </h1>
                    <p className={cn("text-xs text-gray-500", abbreviateContent ? "max-w-[150px]" : "max-w-full")}>
                        {displaySubtitle}
                    </p>
                </div>
            </div>
        </div>
    )
}