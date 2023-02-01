import { erGyldigOrgnr } from "./utils";

describe("Valider orgnr", () => {
    it("Sjekk at tom string ikke er gyldig orgnr", async () => {
        expect(erGyldigOrgnr("")).toBe(false);
    });

    it("Sjekk at orgnr som ikke er 9 siffer ikke er gyldig", async () => {
        expect(erGyldigOrgnr("Hei")).toBe(false);
        expect(erGyldigOrgnr("Hei9876")).toBe(false);
        expect(erGyldigOrgnr("1234567890")).toBe(false);
    });

    it("9 siffer orgnr er gyldig", async () => {
        expect(erGyldigOrgnr("123456789")).toBe(true);
    });
});
