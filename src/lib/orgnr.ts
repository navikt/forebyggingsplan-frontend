export const erGyldigOrgnr = (orgnr: string): boolean => {
    const validerOrgnr = new RegExp("^[0-9]{9}$");
    return validerOrgnr.test(orgnr);
};
