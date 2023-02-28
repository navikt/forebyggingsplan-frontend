import { Aktivitet } from "../../types/Aktivitet";
import { useEffect, useState } from "react";
import { Link } from "@navikt/ds-react";

const lagKalender = ({
    tittel,
    frist: aktivitetFrist,
    aktivitetsmalId,
    aktivitetsId,
}: Aktivitet) => {
    if (!aktivitetFrist) return "";
    const startDato = new Date(aktivitetFrist);
    const start = startDato.toISOString().substring(0, 10).replaceAll("-", "");
    const sluttDato = new Date(startDato);
    sluttDato.setDate(
        sluttDato.getDate() + 1
    ); /* Gjør dette til en heldagsevent. */
    const slutt = sluttDato.toISOString().substring(0, 10).replaceAll("-", "");
    const uid = `${aktivitetsmalId}-${aktivitetsId}@nav.no`;
    return `BEGIN:VCALENDAR
PRODID:-//NAV/Forebyggingsplan//NONSGML v1.0//NO
VERSION:2.0
BEGIN:VEVENT
UID:${uid}
DTSTART;VALUE=DATE:${start}
DTEND;VALUE=DATE:${slutt}
SUMMARY:Påminnelse om forebyggende aktivitet
DESCRIPTION:${tittel}
END:VEVENT
END:VCALENDAR`;
};

interface EksporterTilKalenderProps {
    aktivitet: Aktivitet;
}

export const EksporterTilKalender = ({
    aktivitet,
}: EksporterTilKalenderProps) => {
    const [lastnedUrl, setLastnedUrl] = useState("");
    useEffect(() => {
        if (!aktivitet.frist) return;
        const blob = new Blob([lagKalender(aktivitet)], {
            type: "text/calendar",
        });
        const url = URL.createObjectURL(blob);
        setLastnedUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [aktivitet]);
    return aktivitet.frist && aktivitet.status !== "FULLFØRT" ? (
        <Link href={lastnedUrl} download="kalendar.ics">
            Last ned til kalender (ics)
        </Link>
    ) : null;
};
