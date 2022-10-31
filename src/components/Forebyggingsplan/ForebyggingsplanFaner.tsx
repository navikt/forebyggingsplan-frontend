import { ValgtAktivitet } from "../../types/ValgtAktivitet";
import { Tabs } from "@navikt/ds-react";
import { Aktivitetsmaler } from "./Aktivitetsmaler";
import { MinPlan } from "./MinPlan";
import { Kategori } from "../../types/kategori";

const navigasjonKonstanter = {
    aktiviteterTab: {
        label: "Aktiviteter",
        key: "aktiviteter",
    },
    minPlanTab: {
        label: "Min plan",
        key: "minPlan",
    },
};

interface Props {
    kategorier: Kategori[];
    valgteAktiviteter: ValgtAktivitet[];
}

export function ForebyggingsplanFaner({
    kategorier,
    valgteAktiviteter,
}: Props) {
    return (
        <Tabs
            defaultValue={navigasjonKonstanter.aktiviteterTab.key}
            size="medium"
        >
            <Tabs.List>
                <Tabs.Tab
                    value={navigasjonKonstanter.aktiviteterTab.key}
                    label={navigasjonKonstanter.aktiviteterTab.label}
                />
                <Tabs.Tab
                    value={navigasjonKonstanter.minPlanTab.key}
                    label={navigasjonKonstanter.minPlanTab.label}
                />
            </Tabs.List>
            <Tabs.Panel value={navigasjonKonstanter.aktiviteterTab.key}>
                <Aktivitetsmaler kategorier={kategorier} />
            </Tabs.Panel>
            <Tabs.Panel value={navigasjonKonstanter.minPlanTab.key}>
                <MinPlan valgteAktiviteter={valgteAktiviteter} />
            </Tabs.Panel>
        </Tabs>
    );
}
