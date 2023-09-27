import { Aktivitet } from "../../types/Aktivitet";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { getAktivitetStatusBeskrivelseTekst } from "./Aktivitetsmal/AktivitetsstatusBeskrivelse";
import { AktivitetStatistikkType } from "./useAktivitetStatistikk";

export const AktivitetHeader = ({
    aktivitet,
    aktivitetStatistikk,
}: {
    aktivitet: Aktivitet;
    aktivitetStatistikk: AktivitetStatistikkType;
}) => {
    return (
        <>
            {aktivitet.tittel}
            <ProgressBar
                max={aktivitetStatistikk.totalt}
                value={aktivitetStatistikk.ferdige}
                partial={aktivitetStatistikk.påbegynte}
                title={getAktivitetStatusBeskrivelseTekst(aktivitetStatistikk)}
                navn={aktivitet.tittel}
            />
        </>
    );
};
