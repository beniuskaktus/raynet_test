import type {Client} from "@/types/client.ts";

type StatusTextProps = {
    status: Client["status"]
}

const StatusText = ({ status }: StatusTextProps) => {
    if (status !== "Aktuální") {
        return <span className="font-semibold text-amber-400">{status}</span>
    }

    return <span className="font-semibold text-green-800">{status}</span>
}

export default StatusText