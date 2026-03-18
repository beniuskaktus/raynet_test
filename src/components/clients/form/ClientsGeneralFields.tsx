import type { UseFormReturn } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type {CreateClientFormValues} from "@/lib/formSchema.ts";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import SectionLabel from "@/components/custom/SectionLabel.tsx";
import FieldError from "@/components/custom/FieldError.tsx";

type Props = {
    form: UseFormReturn<CreateClientFormValues>
}

const ClientGeneralFields = ({ form }: Props) => {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form

    return (
        <>
            <div className="grid grid-cols-2 gap-10">
                <ToggleGroup
                    type="single"
                    value={watch("clientType")}
                    onValueChange={(value) => {
                        if (value) {
                            setValue("clientType", value as "company" | "person", {
                                shouldValidate: true
                            })
                        }
                    }}
                    className="h-8 rounded-full border border-slate-200 bg-white p-1"
                >
                    <ToggleGroupItem
                        value="company"
                        className="rounded-full px-4 text-sm data-[state=on]:bg-slate-200"
                    >
                        Firma
                    </ToggleGroupItem>

                    <ToggleGroupItem
                        value="person"
                        className="rounded-full px-4 text-sm data-[state=on]:bg-slate-200"
                    >
                        Fyzická osoba
                    </ToggleGroupItem>
                </ToggleGroup>
                <div>
                    <SectionLabel className="ml-2">Status</SectionLabel>
                    <Select
                        value={watch("status")}
                        onValueChange={(value) => setValue("status", value, { shouldValidate: true })}
                    >
                        <SelectTrigger className="h-8 w-full rounded-xl! font-medium! border-amber-200 bg-amber-100 text-amber-900">
                            <SelectValue placeholder="Potenciální odběratel" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="!rounded-[3px] border-slate-200 bg-white">
                            <SelectItem value="potential-subscriber">Potenciální odběratel</SelectItem>
                            <SelectItem value="actual-client">Aktuální klient</SelectItem>
                            <SelectItem value="supplier">Dodavatel</SelectItem>
                        </SelectContent>
                    </Select>
                    <FieldError message={errors.status?.message} />
                </div>
            </div>

            <div className="mt-2 grid grid-cols-[2fr_1fr] gap-4">
                <div>
                    <SectionLabel>Kategorie</SectionLabel>
                    <Select
                        value={watch("category") || ""}
                        onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
                    >
                        <SelectTrigger className="h-8 w-full rounded-[3px]! border-slate-200! bg-white text-slate-400">
                            <SelectValue placeholder="Vyberte kategorii" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="!rounded-[3px] border-slate-200 bg-white">
                            <SelectItem value="green">[zelená]</SelectItem>
                            <SelectItem value="blue">[modrá]</SelectItem>
                        </SelectContent>
                    </Select>
                    <FieldError message={errors.category?.message} />
                </div>

                <div>
                    <SectionLabel>IČO</SectionLabel>
                    <Input
                        {...register("regNumber")}
                        className="h-8 rounded-[3px] border-slate-200 bg-white focus-visible:ring-1! focus-visible:ring-gray-500!"
                    />
                    <FieldError message={errors.regNumber?.message} />
                </div>

                <div className="col-span-3">
                    <SectionLabel>Poznámka</SectionLabel>
                    <Textarea
                        {...register("note")}
                        className="min-h-47.5 resize-none rounded-[3px] border-slate-200 bg-white focus-visible:ring-1! focus-visible:ring-gray-500!"
                    />
                    <FieldError message={errors.note?.message} />
                </div>
            </div>
        </>
    )
}

export default ClientGeneralFields