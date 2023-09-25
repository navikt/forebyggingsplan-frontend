import { Aktivitet } from "../../types/Aktivitet";
import { ProgressBar } from "../ProgressBar/ProgressBar";

export const AktivitetHeader = ({ aktivitet }: { aktivitet: Aktivitet }) => {
    const max = Math.round(Math.random() * 10);
    const value = Math.round(Math.random() * max);
    return (
        <>
            {aktivitet.tittel}
            <ProgressBar max={max} value={value} label={aktivitet.tittel} />
        </>
    );
};
