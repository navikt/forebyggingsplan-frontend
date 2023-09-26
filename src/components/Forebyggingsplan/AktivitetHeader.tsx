import { Aktivitet } from "../../types/Aktivitet";
import { ProgressBar } from "../ProgressBar/ProgressBar";

export const AktivitetHeader = ({
    aktivitet,
    max,
    value,
    inProgress,
}: {
    aktivitet: Aktivitet;
    max: number;
    value: number;
    inProgress: number;
}) => {
    return (
        <>
            {aktivitet.tittel}
            <ProgressBar
                max={max}
                value={value}
                inProgress={inProgress}
                label={aktivitet.tittel}
            />
        </>
    );
};
