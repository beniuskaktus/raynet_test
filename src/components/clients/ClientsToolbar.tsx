import { Search, ChevronDown, Plus, SlidersHorizontal, MoreHorizontal, Pencil, UserCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ClientsToolbarProps = {
    search: string
    onSearchChange: (value: string) => void
    onAddClient: () => void
}

const ClientsToolbar = ({ search, onSearchChange, onAddClient }: ClientsToolbarProps) => {
    return (
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="mr-2 font-normal leading-none text-slate-800">Klienti</h1>

                <div className="relative w-39">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Hledat..."
                        className="h-7 rounded-full border-slate-200 bg-white pl-9 text-sm placeholder:text-slate-400"
                    />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-full border-slate-200 bg-white px-4 text-sm font-semibold text-slate-500 shadow-none"
                >
                    <UserCircle2 className="mr-2 h-4 w-4  text-slate-400" />
                    Moje filtry
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>

                <div className="mx-1 h-7 w-px bg-slate-300" />

                <Button
                    type="button"
                    variant="outline"
                    className="h-8.5 rounded-full border-slate-200 bg-white px-4 text-sm font-semibold text-slate-500 shadow-none"
                >
                    Vlastník
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8.5 w-8.5 rounded-full border-slate-200 bg-white text-slate-500 shadow-none"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-3 self-end xl:self-auto">
                <Button
                    onClick={onAddClient}
                    type="button"
                    size="icon"
                    className="h-11.5 w-11.5 rounded-full border-0 bg-lime-500 text-white hover:bg-lime-600"
                >
                    <Plus className="h-5 w-5" />
                </Button>

                <Button
                    type="button"
                    className="h-9.5 rounded-full bg-cyan-500 px-5 text-sm font-bold text-white hover:bg-cyan-600"
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filtrování
                </Button>

                <Button
                    type="button"
                    size="icon"
                    className="h-8.5 w-8.5 rounded-full bg-cyan-500 text-white hover:bg-cyan-600"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default ClientsToolbar