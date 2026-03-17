import type { ColumnDef } from "@tanstack/react-table"

import type { Client } from "@/types/client"
import { Checkbox } from "@/components/ui/checkbox"
import SortableHeader from "@/components/custom/SortableHeader.tsx";
import StatusText from "@/components/custom/StatusText.tsx";
import ClientRowActions from "@/components/clients/ClientRowActions.tsx";

type ClientsColumnsOptions = {
    onEdit: (clientId: string) => void
    onDelete: (clientId: string) => void
}

export const getClientsColumns = ({
                                      onEdit,
                                      onDelete,
                                  }: ClientsColumnsOptions): ColumnDef<Client>[] =>
    [{
        id: "select",
        size: 36,
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Vybrat všechny"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Vybrat řádek"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        size: 260,
        header: ({ column }) => (
            <SortableHeader label="Název / jméno" column={column} />
        ),
        cell: ({ row }) => (
            <span className="font-semibold text-slate-800">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "status",
        size: 140,
        header: ({ column }) => (
            <SortableHeader label="Stav" column={column} />
        ),
        cell: ({ row }) => (
            <StatusText status={row.original.status}/>
        ),
    },
    {
        accessorKey: "soldAmount",
        size: 140,
        header: ({ column }) => (
            <SortableHeader label="Prodáno za" column={column} />
        ),
        cell: ({ row }) => {
            const value = row.original.soldAmount
            return (
                <span className="font-semibold text-slate-800">
          {value.toLocaleString("cs-CZ", { minimumFractionDigits: 2 })} Kč
        </span>
            )
        },
    },
    {
        accessorKey: "relation",
        size: 140,
        header: ({ column }) => (
            <SortableHeader label="Vztah" column={column} />
        ),
        cell: ({ row }) => (
            <span className="font-light text-slate-700">{row.original.relation}</span>
        ),
    },
    {
        accessorKey: "rating",
        size: 90,
        header: ({ column }) => (
            <SortableHeader label="Rating" column={column} />
        ),
        cell: ({ row }) => (
            <span className="font-medium text-slate-700">{row.original.rating}</span>
        ),
    },
    {
        accessorKey: "owner",
        size: 180,
        header: ({ column }) => (
            <SortableHeader label="Vlastník" column={column} />
        ),
        cell: ({ row }) => (
            <span className="font-medium text-slate-800">{row.original.owner}</span>
        ),
    },
    {
        accessorKey: "city",
        size: 140,
        header: ({ column }) => (
            <SortableHeader label="Město" column={column} />
        ),
        cell: ({ row }) => (
            <span className="font-light text-slate-600">{row.original.city || "—"}</span>
        ),
    },
    {
        accessorKey: "category",
        size: 140,
        header: ({ column }) => (
            <SortableHeader label="Kategorie" column={column} />
        ),
        cell: ({ row }) => (
            <span className="font-light text-slate-600">{row.original.category || "—"}</span>
        ),
    },
    {
        accessorKey: "tags",
        size: 140,
        header: ({ column }) => (
            <SortableHeader label="Štítky" column={column} />
        ),
        cell: ({ row }) => (
            <span className="font-light text-slate-600">{row.original.tags || "—"}</span>
        ),
    },
    {
        id: "actions",
        size: 36,
        header: () => null,
        cell: ({ row }) => (
            <ClientRowActions
                client={row.original}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
]