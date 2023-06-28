export const erGyldigOrgnr = (orgnr?: string): boolean => {
    const orgnrPattern = new RegExp("^[0-9]{9}$");
    return orgnrPattern.test(orgnr || "");
};
