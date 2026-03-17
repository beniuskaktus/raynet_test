import { flexRender, type Table, type ColumnDef } from "@tanstack/react-table"

import type { Client } from "@/types/client"

import {
    Table as TableComp,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type ClientsTableProps = {
    columns: ColumnDef<Client>[]
    table: Table<Client>
    isLoading?: boolean
    error?: string | null
}

const ClientsTable = ({
                                 columns,
                                 table,
                                 isLoading = false,
                                 error = null,
                             }: ClientsTableProps) => {
    return (
        <div className="overflow-hidden rounded-sm">
            <div className="overflow-x-auto">
                <TableComp className="text-[13px]">
                    <TableHeader className="bg-transparent">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-slate-50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="h-8 border-b border-slate-200 py-0 font-bold uppercase tracking-[0.01em] text-slate-500"
                                        style={{ width: header.getSize() }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody className="border border-slate-200 bg-white">
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-slate-500"
                                >
                                    Načítám klienty...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-red-600"
                                >
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer border-b border-slate-200 hover:bg-slate-50 data-[state=selected]:bg-sky-50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="px-2.5 py-1 align-middle"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-slate-500"
                                >
                                    Žádní klienti nenalezeni.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </TableComp>
            </div>
        </div>
    )
}

export default ClientsTable