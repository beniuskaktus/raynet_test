import { useCallback, useMemo, useState, useEffect } from "react"
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table"

import type { Client } from "@/types/client"
import { deleteClient, fetchClients } from "@/api"
import { getClientsColumns } from "@/components/clients/ClientsColumns"
import { ClientsPagination } from "@/components/clients/ClientsPagination"
import { ClientsTable } from "@/components/clients/ClientsTable"
import { ClientsToolbar } from "@/components/clients/ClientsToolbar"
import ClientsCreateDialog from "@/components/clients/ClientsCreateDialog"

const ClientsPage = () => {
    const [search, setSearch] = useState("")
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sorting, setSorting] = useState<SortingState>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

    const loadClients = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await fetchClients()
            setClients(data)
        } catch (err) {
            console.error(err)
            setError("Nepodařilo se načíst klienty z Raynetu.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadClients()
    }, [loadClients])

    const handleCreateClient = () => {
        setSelectedClientId(null)
        setDialogOpen(true)
    }

    const handleEditClient = (clientId: string) => {
        setSelectedClientId(clientId)
        setDialogOpen(true)
    }

    const handleDeleteClient = async (clientId: string) => {
        const confirmed = window.confirm("Opravdu chcete smazat tohoto klienta?")
        if (!confirmed) return

        try {
            await deleteClient(clientId)
            await loadClients()
        } catch (error) {
            console.error(error)
            alert("Nepodařilo se smazat klienta.")
        }
    }

    const filteredClients = useMemo(() => {
        const query = search.trim().toLowerCase()

        if (!query) return clients

        return clients.filter((client) => {
            const haystack = [
                client.name,
                client.status,
                client.relation,
                client.rating,
                client.owner,
                client.city ?? "",
                client.category ?? "",
                client.tags?.join(" "),
            ]
                .join(" ")
                .toLowerCase()

            return haystack.includes(query)
        })
    }, [clients, search])

    const columns = useMemo(
        () =>
            getClientsColumns({
                onEdit: handleEditClient,
                onDelete: handleDeleteClient,
            }),
        [handleDeleteClient]
    )

    const table = useReactTable({
        data: filteredClients,
        columns,
        state: {
            sorting,
            rowSelection,
            pagination,
        },
        enableRowSelection: true,
        columnResizeMode: "onChange",
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="h-px w-full bg-slate-300" />

            <div className="flex min-h-[calc(100vh-1px)] flex-col">
                <div className="px-4 pt-6 md:px-8 xl:px-10">
                    <ClientsToolbar
                        search={search}
                        onSearchChange={setSearch}
                        onAddClient={handleCreateClient}
                    />

                    <ClientsTable
                        columns={clients}
                        table={table}
                        isLoading={loading}
                        error={error}
                    />
                </div>

                <div className="mt-auto">
                    {!loading && !error && <ClientsPagination table={table} />}
                </div>
            </div>

            <ClientsCreateDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                clientId={selectedClientId}
                onSuccess={loadClients}
            />
        </div>
    )
}

export default ClientsPage