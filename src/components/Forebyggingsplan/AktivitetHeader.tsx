import { Aktivitet } from "../../types/Aktivitet";
import { ProgressBar } from "../ProgressBar/ProgressBar";
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
                aktivitetStatistikk={aktivitetStatistikk}
                label={aktivitet.tittel}
            />
        </>
    );
};
