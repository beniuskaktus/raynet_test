import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import type { Client } from "@/types/client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ClientRowActionsProps = {
    client: Client
    onEdit: (clientId: string) => void
    onDelete: (clientId: string) => void
}

const ClientRowActions = ({
                              client,
                              onEdit,
                              onDelete
}: ClientRowActionsProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:bg-slate-100"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Otevřít akce</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44 bg-white">
                <DropdownMenuItem
                    onClick={() => onEdit(client.id)}
                    className="flex cursor-pointer items-center gap-2 text-black focus:text-gray-700"
                >
                    <Pencil className="h-4 w-4 text-slate-500" />
                    Upravit
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onDelete(client.id)}
                    className="flex cursor-pointer items-center gap-2 text-black focus:text-gray-700"
                >
                    <Trash2 className="h-4 w-4 text-red-600" />
                    Smazat
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ClientRowActions