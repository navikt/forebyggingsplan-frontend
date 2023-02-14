export const isoDato = (dato?: Date) =>
    dato && dato.toISOString().substring(0, 10);

export const norskDatoformat = new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});
