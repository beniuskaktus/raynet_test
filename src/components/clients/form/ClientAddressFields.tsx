import type { UseFormReturn } from "react-hook-form"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type {CreateClientFormValues} from "@/lib/formSchema.ts";
import SectionLabel from "@/components/custom/SectionLabel.tsx";
import FieldError from "@/components/custom/FieldError.tsx";

type Props = {
    form: UseFormReturn<CreateClientFormValues>
}

const ClientAddressFields = ({ form }: Props) => {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form

    return (
        <div>
            <SectionLabel>Adresa</SectionLabel>

            <div className="space-y-2">
                <div>
                    <Input
                        {...register("street")}
                        placeholder="Ulice"
                        className="h-8 rounded-[3px] border-slate-200 bg-white focus-visible:ring-1! focus-visible:ring-gray-500!"
                    />
                    <FieldError message={errors.street?.message} />
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div>
                        <Input
                            {...register("zipCode")}
                            placeholder="PSČ"
                            className="h-8 rounded-[3px] border-slate-200 bg-white focus-visible:ring-1! focus-visible:ring-gray-500!"
                        />
                        <FieldError message={errors.zipCode?.message} />
                    </div>

                    <div>
                        <Input
                            {...register("city")}
                            placeholder="Město"
                            className="h-8 rounded-[3px] border-slate-200 bg-white focus-visible:ring-1! focus-visible:ring-gray-500!"
                        />
                        <FieldError message={errors.city?.message} />
                    </div>
                </div>

                <div>
                    <Input
                        {...register("region")}
                        placeholder="Kraj"
                        className="h-8 rounded-[3px] border-slate-200 bg-white focus-visible:ring-1! focus-visible:ring-gray-500!"
                    />
                    <FieldError message={errors.region?.message} />
                </div>

                <div>
                    <Select
                        value={watch("country") || ""}
                        onValueChange={(value) => setValue("country", value, { shouldValidate: true })}
                    >
                        <SelectTrigger className="h-8 w-full !font-medium !rounded-[3px] border-slate-200 bg-white focus:ring-1 focus:ring-gray-500">
                            <SelectValue placeholder="Země" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="!rounded-[3px] border-slate-200 bg-white">
                            <SelectItem value="cz">Česká republika</SelectItem>
                            <SelectItem value="sk">Slovensko</SelectItem>
                            <SelectItem value="pl">Polsko</SelectItem>
                        </SelectContent>
                    </Select>
                    <FieldError message={errors.country?.message} />
                </div>

                <div>
                    <Select
                        value={watch("territory") || ""}
                        onValueChange={(value) => setValue("territory", value, { shouldValidate: true })}
                    >
                        <SelectTrigger className="h-8 w-full !font-medium !rounded-[3px] border-slate-200 bg-white px-3 text-sm focus:ring-1 focus:ring-gray-500">
                            <SelectValue placeholder="Obchodní teritorium" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="!rounded-[3px] border-slate-200 bg-white">
                            <SelectItem value="default">Výchozí teritorium</SelectItem>
                        </SelectContent>
                    </Select>
                    <FieldError message={errors.territory?.message} />
                </div>
            </div>
        </div>
    )
}

export default ClientAddressFields