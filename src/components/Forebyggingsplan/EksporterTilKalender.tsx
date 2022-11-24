import styles from "./Aktivitetsmal.module.css";
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
    const frist = new Date(aktivitetFrist);
    const start = `${frist.getFullYear()}${
        frist.getMonth() + 1
    }${frist.getDate()}`;
    const slutt =
        /* Sett slutt tid en dag frem. Obs! muterer frist */
        frist.setDate(frist.getDate() + 1) &&
        `${frist.getFullYear()}${frist.getMonth() + 1}${frist.getDate()}`;
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
    return aktivitet.frist ? (
        <Link
            className={styles.detteHarViGjortKnapp}
            href={lastnedUrl}
            download="kalendar.ics"
        >
            Legg til i kalender
        </Link>
    ) : null;
};
