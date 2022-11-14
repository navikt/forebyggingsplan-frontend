import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const tittel = req.body.tittel;
    const frist = new Date(req.body.frist);
    const start = `${frist.getFullYear()}${
        frist.getMonth() + 1
    }${frist.getDate()}`;
    const slutt =
        /* Sett slutt tid en dag frem. Obs! muterer frist */
        frist.setDate(frist.getDate() + 1) &&
        `${frist.getFullYear()}${frist.getMonth() + 1}${frist.getDate()}`;
    const uid = `${req.body.aktivitetsmalId}-${req.body.aktivitetsId}@nav.no`;
    const kalender = `BEGIN:VCALENDAR
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
    return res
        .setHeader("Content-Type", "text/calendar")
        .setHeader("Content-Disposition", 'attachment; filename="kalender.ics"')
        .status(200)
        .send(kalender);
}
