import { isoDato } from "./dato";

describe("date.ts", () => {
    it("Formaterer dato riktig", async () => {
        const results = isoDato(new Date(2023, 2, 8, 0));
        expect(results).toBe("2023-03-08");
    });
    it("Formaterer tom dato riktig", async () => {
        const results = isoDato(undefined);
        expect(results).toBe(undefined);
    });
});
