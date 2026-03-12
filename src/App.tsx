import React, { useEffect, useMemo, useState } from "react";
import { Search, Building2, User2, Mail, Phone, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

/**
 * Raynet Master-Detail demo
 *
 * Co je potřeba napojit:
 * 1) Vytvořit backend/proxy endpoint GET /api/raynet/clients?q=...
 * 2) Endpoint by měl vracet normalizovaný seznam klientů ve tvaru Client[]
 * 3) Frontend pak řeší master-detail, fulltext i detail klienta
 *
 * Proč přes backend:
 * - API klíč do Raynetu nepatří do browseru
 * - backend může řešit autentizaci, paging, retry i transformaci dat
 */

// ---------- Types ----------
type Client = {
    id: string;
    name: string;
    type: "company" | "person";
    companyName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    web?: string;
    city?: string;
    street?: string;
    zipCode?: string;
    country?: string;
    tags?: string[];
    note?: string;
    regNumber?: string;
    taxNumber?: string;
    fulltext: string;
};

type ApiState = "idle" | "loading" | "success" | "error";

// ---------- Helpers ----------
function normalizeText(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function buildAddress(client: Client) {
    return [client.street, client.city, client.zipCode, client.country].filter(Boolean).join(", ");
}

function buildDisplayName(client: Client) {
    if (client.type === "company") return client.name || client.companyName || "Bez názvu";
    return client.name || [client.firstName, client.lastName].filter(Boolean).join(" ") || "Bez jména";
}

function matchesFulltext(client: Client, query: string) {
    if (!query) return true;
    return normalizeText(client.fulltext).includes(normalizeText(query));
}

async function fetchClientsFromProxy(query: string): Promise<Client[]> {
    const url = new URL("/api/raynet/clients", window.location.origin);
    if (query.trim()) url.searchParams.set("q", query.trim());

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error(`Načtení klientů selhalo: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.items ?? [];
}

// ---------- Mock data fallback ----------
const MOCK_CLIENTS: Client[] = [
    {
        id: "1",
        name: "Acme s.r.o.",
        type: "company",
        companyName: "Acme s.r.o.",
        email: "info@acme.cz",
        phone: "+420 555 111 222",
        web: "https://acme.cz",
        city: "Praha",
        street: "Vinohradská 12",
        zipCode: "120 00",
        country: "Česko",
        regNumber: "12345678",
        taxNumber: "CZ12345678",
        tags: ["VIP", "B2B"],
        note: "Dlouhodobý klient.",
        fulltext: "Acme s.r.o. info@acme.cz +420 555 111 222 Praha Vinohradská 12 120 00 Česko VIP B2B 12345678 CZ12345678",
    },
    {
        id: "2",
        name: "Jan Novák",
        type: "person",
        firstName: "Jan",
        lastName: "Novák",
        companyName: "Novák Consulting",
        email: "jan.novak@example.com",
        mobile: "+420 777 222 333",
        city: "Brno",
        country: "Česko",
        tags: ["Lead"],
        note: "Má zájem o novou nabídku.",
        fulltext: "Jan Novák Novák Consulting jan.novak@example.com +420 777 222 333 Brno Česko Lead",
    },
    {
        id: "3",
        name: "BlueSoft a.s.",
        type: "company",
        companyName: "BlueSoft a.s.",
        email: "office@bluesoft.cz",
        phone: "+420 222 444 888",
        city: "Ostrava",
        country: "Česko",
        tags: ["Dodavatel"],
        note: "Technologický partner.",
        fulltext: "BlueSoft a.s. office@bluesoft.cz +420 222 444 888 Ostrava Česko Dodavatel",
    },
];

function DetailRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value?: string; href?: string }) {
    if (!value) return null;
    const content = href ? (
        <a className="underline underline-offset-4" href={href} target="_blank" rel="noreferrer">
            {value}
        </a>
    ) : (
        <span>{value}</span>
    );

    return (
        <div className="flex items-start gap-3 py-2">
            <div className="mt-0.5 text-slate-500">{icon}</div>
            <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
                <div className="break-words text-sm text-slate-900">{content}</div>
            </div>
        </div>
    );
}

export default function App() {
    const [query, setQuery] = useState("");
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [state, setState] = useState<ApiState>("idle");
    const [error, setError] = useState<string | null>(null);
    const [useMock, setUseMock] = useState(false);

    async function loadClients(forceMock = false) {
        setState("loading");
        setError(null);

        try {
            const items = forceMock ? MOCK_CLIENTS : await fetchClientsFromProxy(query);
            setClients(items);
            setSelectedId((current) => current ?? items[0]?.id ?? null);
            setState("success");
            setUseMock(forceMock);
        } catch (e) {
            if (!forceMock) {
                setClients(MOCK_CLIENTS);
                setSelectedId(MOCK_CLIENTS[0]?.id ?? null);
                setState("success");
                setUseMock(true);
                setError("Proxy API není dostupné, zobrazuji mock data.");
            } else {
                setState("error");
                setError(e instanceof Error ? e.message : "Neočekávaná chyba");
            }
        }
    }

    useEffect(() => {
        loadClients(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredClients = useMemo(() => {
        return clients.filter((client) => matchesFulltext(client, query));
    }, [clients, query]);

    useEffect(() => {
        if (!filteredClients.length) {
            setSelectedId(null);
            return;
        }

        const exists = filteredClients.some((c) => c.id === selectedId);
        if (!exists) setSelectedId(filteredClients[0].id);
    }, [filteredClients, selectedId]);

    const selectedClient = filteredClients.find((client) => client.id === selectedId) ?? null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Klienti z Raynetu</h1>
                        <p className="text-sm text-slate-600">Master-detail přehled s fulltextovým filtrem</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative min-w-[280px]">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Hledat podle jména, firmy, e-mailu, telefonu…"
                                className="pl-9"
                            />
                        </div>
                        <Button onClick={() => loadClients(useMock)} variant="outline" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Obnovit
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                                <span>Seznam klientů</span>
                                <Badge variant="secondary">{filteredClients.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[65vh] pr-3">
                                <div className="space-y-2">
                                    {state === "loading" && <div className="text-sm text-slate-500">Načítám klienty…</div>}

                                    {!state.includes("loading") && filteredClients.length === 0 && (
                                        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                                            Žádní klienti neodpovídají zadanému filtru.
                                        </div>
                                    )}

                                    {filteredClients.map((client) => {
                                        const active = client.id === selectedId;
                                        return (
                                            <button
                                                key={client.id}
                                                onClick={() => setSelectedId(client.id)}
                                                className={`w-full rounded-2xl border p-4 text-left transition hover:bg-slate-50 ${
                                                    active ? "border-slate-900 bg-slate-100" : "border-slate-200 bg-white"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="truncate font-medium text-slate-900">{buildDisplayName(client)}</div>
                                                        <div className="mt-1 truncate text-sm text-slate-500">
                                                            {client.companyName && client.type === "person"
                                                                ? client.companyName
                                                                : client.email || client.phone || client.mobile || "Bez kontaktu"}
                                                        </div>
                                                    </div>
                                                    <Badge variant={client.type === "company" ? "default" : "secondary"}>
                                                        {client.type === "company" ? "Firma" : "Osoba"}
                                                    </Badge>
                                                </div>

                                                {(client.city || client.phone || client.mobile) && (
                                                    <div className="mt-3 text-xs text-slate-500">
                                                        {[client.city, client.phone || client.mobile].filter(Boolean).join(" • ")}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Detail klienta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!selectedClient ? (
                                <div className="rounded-xl border border-dashed p-10 text-center text-sm text-slate-500">
                                    Vyber klienta ze seznamu vlevo.
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                {selectedClient.type === "company" ? (
                                                    <Building2 className="h-5 w-5 text-slate-500" />
                                                ) : (
                                                    <User2 className="h-5 w-5 text-slate-500" />
                                                )}
                                                <h2 className="truncate text-2xl font-semibold">{buildDisplayName(selectedClient)}</h2>
                                            </div>

                                            {selectedClient.companyName && selectedClient.type === "person" && (
                                                <p className="mt-2 text-sm text-slate-600">{selectedClient.companyName}</p>
                                            )}
                                        </div>

                                        <Badge variant={selectedClient.type === "company" ? "default" : "secondary"}>
                                            {selectedClient.type === "company" ? "Firma" : "Osoba"}
                                        </Badge>
                                    </div>

                                    {!!selectedClient.tags?.length && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedClient.tags.map((tag) => (
                                                <Badge key={tag} variant="outline">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <h3 className="mb-2 text-sm font-medium text-slate-700">Kontaktní údaje</h3>
                                            <DetailRow icon={<Mail className="h-4 w-4" />} label="E-mail" value={selectedClient.email} href={selectedClient.email ? `mailto:${selectedClient.email}` : undefined} />
                                            <DetailRow icon={<Phone className="h-4 w-4" />} label="Telefon" value={selectedClient.phone} href={selectedClient.phone ? `tel:${selectedClient.phone}` : undefined} />
                                            <DetailRow icon={<Phone className="h-4 w-4" />} label="Mobil" value={selectedClient.mobile} href={selectedClient.mobile ? `tel:${selectedClient.mobile}` : undefined} />
                                            <DetailRow icon={<MapPin className="h-4 w-4" />} label="Adresa" value={buildAddress(selectedClient)} />
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-sm font-medium text-slate-700">Firemní informace</h3>
                                            <DetailRow icon={<Building2 className="h-4 w-4" />} label="IČO" value={selectedClient.regNumber} />
                                            <DetailRow icon={<Building2 className="h-4 w-4" />} label="DIČ" value={selectedClient.taxNumber} />
                                            <DetailRow icon={<Building2 className="h-4 w-4" />} label="Web" value={selectedClient.web} href={selectedClient.web} />
                                        </div>
                                    </div>

                                    {selectedClient.note && (
                                        <>
                                            <Separator />
                                            <div>
                                                <h3 className="mb-2 text-sm font-medium text-slate-700">Poznámka</h3>
                                                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{selectedClient.note}</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/**
 * ------------------------------------------------------------
 * Příklad backend normalizace (Node/Express pseudo-code)
 * ------------------------------------------------------------
 *
 * app.get('/api/raynet/clients', async (req, res) => {
 *   const q = String(req.query.q ?? '');
 *
 *   // 1) Zavolej Raynet endpoint(y) pro firmy a osoby.
 *   // 2) Výsledek převeď na Client[]
 *   // 3) fulltext slož z relevantních polí
 *
 *   const companies = await raynet.getCompanies(q);
 *   const persons = await raynet.getPersons(q);
 *
 *   const items = [...mapCompanies(companies), ...mapPersons(persons)];
 *   res.json({ items });
 * });
 */
