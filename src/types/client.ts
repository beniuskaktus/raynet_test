export type ClientStatus = "Aktuální" | "Potenciální"
export type ClientRating = "A" | "B" | "C"

export type Client = {
    id: string
    name: string
    status: ClientStatus
    soldAmount: number
    relation: string
    rating: ClientRating
    lastActivity?: string
    owner: string
    city?: string
    category?: string
    tags: string[]
}

export type RaynetClient = {
    id: number
    name: string | null
    person: boolean
    role: string | null
    state: string | null
    rating: "A" | "B" | "C" | null

    owner?: {
        id: number
        fullName: string
    } | null

    regNumber?: string | null
    taxNumber?: string | null
    notice?: string | null

    category?: {
        id: number
        value: string
    } | null

    tags?: Array<{
        id?: number
        name?: string
        value?: string
    }>

    primaryAddress?: {
        id?: number
        primary?: boolean
        contactAddress?: boolean
        territory?:
            | {
            id?: number
            name?: string
        }
            | number
            | null
        address?: {
            id?: number
            city?: string | null
            country?: string | null
            countryCode?: string | null
            name?: string | null
            province?: string | null
            street?: string | null
            zipCode?: string | null
            lat?: number | null
            lng?: number | null
        } | null
        contactInfo?: {
            primary?: boolean
            email?: string | null
            email2?: string | null
            tel1?: string | null
            tel1Type?: string | null
            tel2?: string | null
            tel2Type?: string | null
            fax?: string | null
            www?: string | null
            otherContact?: string | null
            doNotSendMM?: boolean
        } | null
    } | null

    contactAddress?: {
        id?: number
        primary?: boolean
        contactAddress?: boolean
        territory?:
            | {
            id?: number
            name?: string
        }
            | number
            | null
        address?: {
            id?: number
            city?: string | null
            country?: string | null
            countryCode?: string | null
            name?: string | null
            province?: string | null
            street?: string | null
            zipCode?: string | null
            lat?: number | null
            lng?: number | null
        } | null
        contactInfo?: {
            primary?: boolean
            email?: string | null
            email2?: string | null
            tel1?: string | null
            tel1Type?: string | null
            tel2?: string | null
            tel2Type?: string | null
            fax?: string | null
            www?: string | null
            otherContact?: string | null
            doNotSendMM?: boolean
        } | null
    } | null

    ["rowInfo.createdAt"]?: string | null
    ["rowInfo.updatedAt"]?: string | null
}

export type RaynetClientResponse = {
    success: boolean
    data: RaynetClient[]
}

export type RaynetClientPayload = {
    name: string
    securityLevel?: number
    owner?: number
    rating?: "A" | "B" | "C"
    state?: string
    role?: string
    notice?: string
    category?: number
    contactSource?: number
    employeesNumber?: number
    legalForm?: number
    paymentTerm?: number
    turnover?: number
    economyActivity?: number
    companyClassification1?: number
    companyClassification2?: number
    companyClassification3?: number
    regNumber?: string
    taxNumber?: string
    taxPayer?: "YES" | "NO"
    bankAccount?: string
    addresses?: Array<{
        address: {
            name?: string
            street?: string
            city?: string
            province?: string
            zipCode?: string
            country?: string
            lat?: number
            lng?: number
        }
        contactInfo?: {
            email?: string
            email2?: string
            fax?: string
            otherContact?: string
            tel1?: string
            tel1Type?: string
            tel2?: string
            tel2Type?: string
            www?: string
            doNotSendMM?: boolean
        }
        territory?: number
    }>
    tags?: string[]
    customFields?: Record<string, string | number | boolean | null>
}