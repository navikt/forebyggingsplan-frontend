import { render } from "@testing-library/react";
import { Lovpålagt } from "./Lovpålagt";
import { axe } from "jest-axe";

/*{
    aktivitetsmalId: "67fe672b-8def-4e71-8fe8-1fd6d5226dc9",
    mål: "Du kjenner til hvordan du følger opp sykefravær på en god måte.",
    tittel: "Følg det lovpålagte oppfølgingsløpet ved sykefravær",
    beskrivelse:
        "Følger du opp sykefravær på en god måte er dette med å forebygge ytterligere fravær. Arbeidsgiver har hovedansvaret for å tilrettelegge og følge opp sykemeldte på arbeidsplassen, og arbeidstaker plikter å medvirke til å finne  løsninger som hindrer unødig langvarig sykefravær.",
    innhold: [
        {
            _key: "20f9601bfca4",
            _type: "block",
            children: [
                {
                    _key: "0ff6b408d650",
                    _type: "span",
                    marks: [],
                    text: "",
                },
            ],
            markDefs: [],
            style: "normal",
        },
        {
            _key: "24ba3bb7740a",
            _type: "seksjon",
            seksjonInnhold: [
                {
                    _key: "3f2f41b64148",
                    _type: "block",
                    children: [
                        {
                            _key: "529c84a6b0bd0",
                            _type: "span",
                            marks: [],
                            text: "",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
                {
                    _key: "bfe98d93f368",
                    _type: "lovpalagt",
                    tekst: "Ansatte kan benytte egenmelding inntil tre dager, inntil fire ganger i løpet av 12 måneder.",
                },
                {
                    _key: "db70229285bb",
                    _type: "block",
                    children: [
                        {
                            _key: "aafa878e94fa0",
                            _type: "span",
                            marks: [],
                            text: "",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
                {
                    _key: "4d78bc90e62a",
                    _type: "block",
                    children: [
                        {
                            _key: "d2970709e574",
                            _type: "span",
                            marks: [],
                            text: "Arbeidstakeren må ha arbeidet hos arbeidsgiveren i minst to måneder for å kunne benytte egenmelding.\nDu kan ha en egen avtale om utvidet rett til egenmelding",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
            ],
        },
        {
            _key: "95922a94da6e",
            _type: "seksjon",
            seksjonInnhold: [
                {
                    _key: "ac3a285a0146",
                    _type: "block",
                    children: [
                        {
                            _key: "fab9a20427320",
                            _type: "span",
                            marks: [],
                            text: "",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
                {
                    _key: "f94f2f958547",
                    _type: "lovpalagt",
                    tekst: "Det skal senest etter fire uker utarbeides en oppfølgingsplan ved sykemelding.",
                },
                {
                    _key: "823ed942bbe0",
                    _type: "block",
                    children: [
                        {
                            _key: "d0912f2b292f",
                            _type: "span",
                            marks: [],
                            text: "",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
                {
                    _key: "a1c2f7bd5daf",
                    _type: "block",
                    children: [
                        {
                            _key: "fd238a896392",
                            _type: "span",
                            marks: [],
                            text: "",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
                {
                    _key: "fe77cfcf19ac",
                    _type: "lovpalagt",
                    tekst: "Arbeidstakerne har både en rett og en plikt til å medvirke.",
                },
                {
                    _key: "4f3061becaa8",
                    _type: "block",
                    children: [
                        {
                            _key: "476bebc47f07",
                            _type: "span",
                            marks: [],
                            text: "",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
                {
                    _key: "3c4463b7cf18",
                    _type: "block",
                    children: [
                        {
                            _key: "e393a43c1c8c0",
                            _type: "span",
                            marks: [],
                            text: "Arbeidsgiver skal ifølge folketrygdloven ta initiativ til dialog ved sykmelding\nEn oppfølgingsplan innebærer å gjøre en vurdering av om det er noe som kan gjøres på arbeidsplassen som kan bidra til at den ansatte kan komme raskere tilbake i arbeid, helt eller delvis.\nMuligheter og begrensninger på arbeidsplassen skal vurderes i samarbeid med den ansatte.\nDu kan lage ",
                        },
                        {
                            _key: "b9eb31ef595b",
                            _type: "span",
                            marks: ["add4cf3c7e16"],
                            text: "oppfølgingsplan på nav.no",
                        },
                    ],
                    markDefs: [
                        {
                            _key: "add4cf3c7e16",
                            _type: "href",
                            url: "https://nav.no/",
                        },
                    ],
                    style: "normal",
                },
            ],
        },
        {
            _key: "ea1a0b9169f1",
            _type: "seksjon",
        },
        {
            _key: "a9dd288231ab",
            _type: "seksjon",
        },
        {
            _key: "33c88fa9c2fb",
            _type: "seksjon",
            seksjonInnhold: [
                {
                    _key: "09ce02800ec0",
                    _type: "block",
                    children: [
                        {
                            _key: "d34486cadf7f",
                            _type: "span",
                            marks: [],
                            text: "",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
                {
                    _key: "642f4585a5c8",
                    _type: "block",
                    children: [
                        {
                            _key: "72bd78fc6bf4",
                            _type: "span",
                            marks: [],
                            text: "Heiheihei",
                        },
                    ],
                    markDefs: [],
                    style: "normal",
                },
            ],
        },
    ],
    status: "IKKE_VALGT",
};*/

describe("Lovpålagt", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Lovpålagt
                value={{ tekst: "Heisann" }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
