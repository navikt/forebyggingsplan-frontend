export const erGyldigOrgnr = (orgnr: unknown | undefined): boolean => {
    if (!orgnr) return false;
    const validerOrgnr = new RegExp("^[0-9]{9}$");
    return validerOrgnr.test(orgnr.toString());
};
