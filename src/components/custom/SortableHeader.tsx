import type {Column} from "@tanstack/react-table";
import type {Client} from "@/types/client.ts";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown} from "lucide-react";

type SortableHeaderProps = {
    label: string
    column: Column<Client>
}

const SortableHeader = ({ label, column}: SortableHeaderProps)=> {
    return (
        <Button
            variant="ghost"
            className="h-auto p-0 text-[11px] font-bold uppercase tracking-[0.01em] text-slate-500 hover:bg-transparent hover:text-slate-700 hover:border-slate-200!"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {label}
            <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
    )
}

export default SortableHeader