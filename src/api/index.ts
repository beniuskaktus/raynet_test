import type {Client, RaynetClientPayload, RaynetClientResponse} from "@/types/client"
import {mapCreateClientFormToRaynetPayload, mapToClient} from "@/lib/mappers.ts";
import type {CreateClientFormValues} from "@/lib/formSchema.ts";

const RAYNET_USERNAME = import.meta.env.VITE_RAYNET_USERNAME
const RAYNET_API_KEY = import.meta.env.VITE_RAYNET_API_KEY
const RAYNET_INSTANCE = import.meta.env.VITE_RAYNET_INSTANCE

const getAuthHeaders = () => {
    const auth = btoa(`${RAYNET_USERNAME}:${RAYNET_API_KEY}`)

    return {
        Authorization: `Basic ${auth}`,
        "X-Instance-Name": RAYNET_INSTANCE,
        Accept: "application/json",
        "Content-Type": "application/json",
    }
}

export const fetchClients = async (): Promise<Client[]> => {
    const response = await fetch("https://app.raynet.cz/api/v2/company/", {
        method: "GET",
        headers: getAuthHeaders()
    })

    if (!response.ok) {
        throw new Error(`Raynet request failed: ${response.status}`)
    }

    const json = (await response.json()) as RaynetClientResponse

    return json.data.map(mapToClient)
}

export const createClient = async (values: CreateClientFormValues) => {
    const payload: RaynetClientPayload =
        mapCreateClientFormToRaynetPayload(values)

    const response = await fetch("https://app.raynet.cz/api/v2/company/", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Create client failed: ${response.status} ${errorText}`)
    }

    return response.json()
}

export const fetchClientById = async (clientId: string | number) => {
    const response = await fetch(`https://app.raynet.cz/api/v2/company/${clientId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error(`Fetch client detail failed: ${response.status}`)
    }

    return (await response.json()) as RaynetClientResponse
}

export const updateClient = async (
    clientId: string | number,
    values: CreateClientFormValues
) => {
    const payload: RaynetClientPayload = mapCreateClientFormToRaynetPayload(values)

    const response = await fetch(`https://app.raynet.cz/api/v2/company/${clientId}/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Update client failed: ${response.status} ${errorText}`)
    }

    return response.json()
}

export const deleteClient = async (clientId: string | number) => {
    const response = await fetch(`https://app.raynet.cz/api/v2/company/${clientId}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Delete client failed: ${response.status} ${errorText}`)
    }

    return true
}