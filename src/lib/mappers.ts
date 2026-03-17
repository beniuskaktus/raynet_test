import type {
    Client,
    ClientStatus,
    RaynetClient,
    RaynetClientPayload,
} from "@/types/client"
import type { CreateClientFormValues } from "@/lib/formSchema"

const mapStateToStatus = (state: string | null): ClientStatus => {
    switch (state) {
        case "B_ACTUAL":
            return "Aktuální"
        case "A_POTENTIAL":
            return "Potenciální"
        default:
            return "Potenciální"
    }
}

const mapRoleToRelation = (role: string | null): string => {
    switch (role) {
        case "E_OWN":
            return "Vlastní firma"
        case "A_SUBSCRIBER":
            return "Odběratel"
        case "C_SUPPLIER":
            return "Dodavatel"
        default:
            return "—"
    }
}

const mapStatusToState = (status: string): string => {
    switch (status) {
        case "actual-client":
            return "B_ACTUAL"
        case "supplier":
            return "C_SHOP"
        case "potential-subscriber":
        default:
            return "A_POTENTIAL"
    }
}

const mapClientTypeToRole = (clientType: "company" | "person"): string => {
    switch (clientType) {
        case "person":
            return "A_SUBSCRIBER"
        case "company":
        default:
            return "B_PARTNER"
    }
}

const mapPhoneType = (phoneType?: string): string | undefined => {
    switch (phoneType) {
        case "work":
            return "pracovní"
        case "mobile":
            return "mobil"
        case "home":
            return "domů"
        default:
            return undefined
    }
}

const mapCategoryToId = (category?: string): number | undefined => {
    switch (category) {
        case "green":
            return 105
        case "blue":
            return 106
        default:
            return undefined
    }
}

const mapTerritoryToId = (territory?: string): number | undefined => {
    switch (territory) {
        case "default":
            return 1
        default:
            return undefined
    }
}

const mapStateToFormStatus = (state: string | null | undefined): CreateClientFormValues["status"] => {
    switch (state) {
        case "B_ACTUAL":
            return "actual-client"
        case "C_SHOP":
            return "supplier"
        case "A_POTENTIAL":
        default:
            return "potential-subscriber"
    }
}

const mapRoleToFormClientType = (
    role: string | null | undefined
): CreateClientFormValues["clientType"] => {
    switch (role) {
        case "A_SUBSCRIBER":
            return "person"
        default:
            return "company"
    }
}

const mapCategoryIdToFormValue = (category?: { id?: number | null } | null) => {
    switch (category?.id) {
        case 105:
            return "green"
        case 106:
            return "blue"
        default:
            return ""
    }
}

const mapTerritoryIdToFormValue = (territory?: { id?: number | null } | number | null) => {
    const territoryId =
        typeof territory === "number" ? territory : territory?.id

    switch (territoryId) {
        case 1:
            return "default"
        default:
            return ""
    }
}

const mapPhoneTypeToFormValue = (phoneType?: string | null) => {
    switch ((phoneType ?? "").toLowerCase()) {
        case "pracovní":
            return "work"
        case "mobil":
            return "mobile"
        case "domů":
            return "home"
        default:
            return ""
    }
}

const cleanObject = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => {
            if (value === undefined || value === null) return false
            if (typeof value === "string" && value.trim() === "") return false
            return !(Array.isArray(value) && value.length === 0);

        })
    ) as Partial<T>
}

export const mapRaynetClientToFormValues = (
    item: RaynetClient
): CreateClientFormValues => {
    const contactAddress = item.contactAddress ?? item.primaryAddress
    const address = contactAddress?.address
    const contactInfo = contactAddress?.contactInfo

    return {
        name: item.name ?? "",
        clientType: mapRoleToFormClientType(item.role),
        category: mapCategoryIdToFormValue(item.category),
        status: mapStateToFormStatus(item.state),
        regNumber: item.regNumber ?? "",
        note: item.notice ?? "",
        email: contactInfo?.email ?? "",
        phone: contactInfo?.tel1 ?? "",
        phoneType: mapPhoneTypeToFormValue(contactInfo?.tel1Type),
        website: contactInfo?.www ?? "",
        street: address?.street ?? "",
        zipCode: address?.zipCode ?? "",
        city: address?.city ?? "",
        region: address?.province ?? "",
        country: address?.countryCode?.toLowerCase() ?? "cz",
        territory: mapTerritoryIdToFormValue(contactAddress?.territory as number | null | undefined),
    }
}

export const mapCreateClientFormToRaynetPayload = (
    values: CreateClientFormValues
): RaynetClientPayload => {
    const address = {
        name: "Sídlo klienta",
        ...cleanObject({
            street: values.street,
            city: values.city,
            province: values.region,
            zipCode: values.zipCode,
            country: values.country?.toUpperCase(),
        }),
    }

    const contactInfo = cleanObject({
        email: values.email,
        tel1: values.phone,
        tel1Type: mapPhoneType(values.phoneType),
        www: values.website,
        doNotSendMM: false,
    })

    const addresses =
        Object.keys(address).length > 0 || Object.keys(contactInfo).length > 0
            ? [
                cleanObject({
                    address,
                    contactInfo,
                    territory: mapTerritoryToId(values.territory),
                }),
            ]
            : undefined

    return cleanObject({
        name: values.name,
        securityLevel: 1,
        rating: "A",
        state: mapStatusToState(values.status),
        role: mapClientTypeToRole(values.clientType),
        notice: values.note,
        category: mapCategoryToId(values.category),
        regNumber: values.regNumber,
        addresses,
        tags: [],
        customFields: {},
    }) as RaynetClientPayload
}

export const mapToClient = (item: RaynetClient): Client => {
    return {
        id: String(item.id),
        name: item.name ?? "—",
        status: mapStateToStatus(item.state),
        soldAmount: 0,
        relation: mapRoleToRelation(item.role),
        rating: item.rating ?? "C",
        lastActivity: item["rowInfo.updatedAt"] ?? item["rowInfo.createdAt"] ?? "",
        owner: item.owner?.fullName ?? "—",
        city: item.primaryAddress?.address?.city ?? "",
        category: item.category?.value ?? "",
        tags:
            item.tags?.map((tag) => tag.name ?? tag.value ?? "").filter(Boolean) ?? [],
    }
}