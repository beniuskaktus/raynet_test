import type { Table } from "@tanstack/react-table"
import type { Client } from "@/types/client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type ClientsPaginationProps = {
    table: Table<Client>
}

const ClientsPagination = ({ table }: ClientsPaginationProps) => {
    const pageCount = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1

    return (
        <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <div>
                    Počet{" "}
                    <span className="font-semibold text-slate-900">
            {table.getFilteredRowModel().rows.length}
          </span>
                </div>

                <div>
                    Vybráno{" "}
                    <span className="font-semibold text-slate-900">
            {table.getFilteredSelectedRowModel().rows.length}
          </span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <span>Na stránce</span>

                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-9 w-22">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" className="!rounded-[3px] border-slate-200 bg-white">
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    Stránka{" "}
                    <span className="font-semibold text-slate-900">{currentPage}</span>{" "}
                    z <span className="font-semibold text-slate-900">{pageCount}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Předchozí
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Další
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ClientsPagination