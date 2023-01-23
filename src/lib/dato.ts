export const isoDato = (dato?: Date) =>
    dato &&
    new Intl.DateTimeFormat("en-CA", { dateStyle: "short" }).format(dato);

export const norskDatoformat = new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});
