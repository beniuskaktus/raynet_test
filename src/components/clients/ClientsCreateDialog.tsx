import { useEffect, useMemo, useState } from "react"
import { Lock, X } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import ClientContactFields from "@/components/clients/form/ClientContactFields"
import ClientAddressFields from "@/components/clients/form/ClientAddressFields"
import ClientGeneralFields from "@/components/clients/form/ClientsGeneralFields"
import { useCreateClientForm } from "@/components/clients/form/useCreateClientForm"
import type { CreateClientFormValues } from "@/lib/formSchema"
import {
    createClient,
    fetchClientById,
    updateClient,
} from "@/api"
import { mapRaynetClientToFormValues } from "@/lib/mappers"
import {emptyFormValues} from "@/types/client.ts";

type ClientsCreateDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    clientId?: string | null
    onSuccess: () => Promise<void> | void
}

const ClientsCreateDialog = ({
                                 open,
                                 onOpenChange,
                                 clientId = null,
                                 onSuccess,
                             }: ClientsCreateDialogProps) => {
    const form = useCreateClientForm()
    const [submitAction, setSubmitAction] = useState<"save" | "save-open">("save")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)

    const isEdit = useMemo(() => Boolean(clientId), [clientId])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = form

    useEffect(() => {
        if (!open) return

        const loadClientDetail = async () => {
            if (!clientId) {
                reset(emptyFormValues)
                return
            }

            try {
                setIsLoadingDetail(true)
                const clientDetail = await fetchClientById(clientId)
                const formValues = mapRaynetClientToFormValues(clientDetail.data)

                console.log("edit detail", clientDetail)
                console.log("mapped form values", formValues)

                reset(formValues)
            } catch (error) {
                console.error("Failed to load client detail", error)
            } finally {
                setIsLoadingDetail(false)
            }
        }

        loadClientDetail()
    }, [open, clientId, reset])

    const onSubmit = async (values: CreateClientFormValues) => {
        try {
            setIsSubmitting(true)

            if (clientId) {
                await updateClient(clientId, values)
            } else {
                await createClient(values)
            }

            await onSuccess()

            if (submitAction === "save") {
                onOpenChange(false)
                reset()
            }
        } catch (error) {
            console.error("Submit failed", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                onOpenChange(nextOpen)
                if (!nextOpen) {
                    reset()
                }
            }}
        >
            <DialogContent
                showCloseButton={false}
                className="w-auto! max-w-none! gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none"
            >
                <DialogTitle className="sr-only">
                    {isEdit ? "Upravit klienta" : "Vytvořit klienta"}
                </DialogTitle>

                <div className="w-[calc(100vw-32px)] max-w-240 overflow-hidden rounded-[10px] bg-white shadow-2xl">
                    {isLoadingDetail ? (
                        <div className="p-10 text-sm text-slate-500">
                            Načítám detail klienta...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="relative border-b border-slate-200 px-10 pb-7 pt-9">
                                <Button
                                    type="button"
                                    onClick={() => onOpenChange(false)}
                                    className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
                                >
                                    <X className="h-6 w-6" />
                                </Button>

                                <input
                                    {...register("name")}
                                    autoFocus
                                    placeholder="Napište jméno nebo název klienta"
                                    className="w-full border-0 bg-transparent px-0 text-[28px] text-slate-700 outline-none placeholder:text-slate-400"
                                />

                                <div className="mt-2 h-0.5 bg-cyan-400" />

                                {errors.name?.message && (
                                    <p className="pt-2 text-xs text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 bg-slate-100 md:grid-cols-[1.1fr_0.9fr]">
                                <div className="border-r border-slate-200 px-10 py-10">
                                    <ClientGeneralFields form={form} />
                                </div>

                                <div className="px-10 py-10">
                                    <ClientContactFields form={form} />
                                    <ClientAddressFields form={form} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-white px-5 py-5">
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        onClick={() => setSubmitAction("save-open")}
                                        className="h-9 rounded-full bg-lime-500 px-5 text-sm font-bold text-white hover:bg-lime-600"
                                    >
                                        ULOŽIT & OTEVŘÍT
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        onClick={() => setSubmitAction("save")}
                                        className="h-9 rounded-full bg-cyan-500 px-5 text-sm font-bold text-white hover:bg-cyan-600"
                                    >
                                        ULOŽIT
                                    </Button>
                                </div>

                                <Button
                                    type="button"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
                                >
                                    <Lock className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ClientsCreateDialog