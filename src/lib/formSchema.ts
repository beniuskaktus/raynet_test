import { z } from "zod"

export const createClientSchema = z.object({
    name: z.string().min(1, "Zadejte jméno nebo název klienta.").max(120),

    clientType: z.enum(["company", "person"]),

    category: z.string().optional(),
    status: z.string().min(1, "Vyberte status."),
    regNumber: z.string().max(20).optional().or(z.literal("")),

    note: z.string().max(1000).optional().or(z.literal("")),

    email: z.string().email("Zadejte platný e-mail.").optional().or(z.literal("")),
    phone: z.string().max(30).optional().or(z.literal("")),
    phoneType: z.string().optional(),
    website: z.string().max(120).optional().or(z.literal("")),

    street: z.string().max(120).optional().or(z.literal("")),
    zipCode: z.string().max(20).optional().or(z.literal("")),
    city: z.string().max(80).optional().or(z.literal("")),
    region: z.string().max(80).optional().or(z.literal("")),
    country: z.string().optional(),
    territory: z.string().optional(),
})

export type CreateClientFormValues = z.infer<typeof createClientSchema>