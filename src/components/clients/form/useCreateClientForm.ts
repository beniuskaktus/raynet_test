import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {type CreateClientFormValues, createClientSchema} from "@/lib/formSchema.ts";

export const useCreateClientForm = () => {
    return useForm<CreateClientFormValues>({
        resolver: zodResolver(createClientSchema),
        defaultValues: {
            name: "",
            clientType: "company",
            category: "",
            status: "potential-subscriber",
            regNumber: "",
            note: "",
            email: "",
            phone: "",
            phoneType: "",
            website: "",
            street: "",
            zipCode: "",
            city: "",
            region: "",
            country: "cz",
            territory: "",
        },
        mode: "onBlur",
    })
}