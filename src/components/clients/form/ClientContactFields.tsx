import type { UseFormReturn } from "react-hook-form"
import { Globe, Mail, Phone } from "lucide-react"

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

const ClientContactFields = ({ form }: Props) => {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form

    return (
        <div className="mb-6">
            <SectionLabel>Kontakty</SectionLabel>

            <div className="space-y-2">
                <div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            {...register("email")}
                            placeholder="Email"
                            className="h-8 rounded-[3px] border-slate-200 bg-white pl-9 focus-visible:ring-1! focus-visible:ring-gray-500!"
                        />
                    </div>
                    <FieldError message={errors.email?.message} />
                </div>

                <div className="grid grid-cols-[2fr_1fr]">
                    <div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                {...register("phone")}
                                placeholder="Telefon"
                                className="h-8 rounded-[3px] border-slate-200 bg-white pl-9 focus-visible:ring-1! focus-visible:ring-gray-500!"
                            />
                        </div>

                        <FieldError message={errors.phone?.message} />
                    </div>

                    <div>
                        <Select
                            value={watch("phoneType") ?? undefined}
                            onValueChange={(value) =>
                                setValue("phoneType", value === "none" ? "" : value, {
                                    shouldValidate: true,
                                })
                            }
                        >
                            <SelectTrigger className="h-8 w-full font-medium! rounded-[3px]! border-slate-200! bg-white text-slate-700!">
                                <SelectValue placeholder="Typ" />
                            </SelectTrigger>

                            <SelectContent className="bg-white rounded-[3px]!">
                                <SelectItem value="none">—</SelectItem>
                                <SelectItem value="work">Pracovní</SelectItem>
                                <SelectItem value="mobile">Mobil</SelectItem>
                                <SelectItem value="home">Domů</SelectItem>
                            </SelectContent>
                        </Select>

                        <FieldError message={errors.phoneType?.message} />
                    </div>
                </div>

                <div>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            {...register("website")}
                            placeholder="WWW"
                            className="h-8 rounded-[3px] border-slate-200 bg-white pl-9 focus-visible:ring-1! focus-visible:ring-gray-500!"
                        />
                    </div>
                    <FieldError message={errors.website?.message} />
                </div>
            </div>
        </div>
    )
}

export default ClientContactFields