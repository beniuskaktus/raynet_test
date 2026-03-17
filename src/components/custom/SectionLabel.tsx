import { cn } from "@/lib/utils"

type SectionLabelProps = {
    children: React.ReactNode
    className?: string
}

const SectionLabel = ({ children, className }: SectionLabelProps) => {
    return (
        <div
            className={cn(
                "mb-2 text-[11px] font-bold uppercase tracking-[0.02em] text-slate-500",
                className
            )}
        >
            {children}
        </div>
    )
}

export default SectionLabel