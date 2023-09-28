export const isoDato = (dato?: Date) => {
    if (dato) {
        dato.setHours(12);
        return dato.toISOString().substring(0, 10);
    }
    return undefined;
};

new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});
