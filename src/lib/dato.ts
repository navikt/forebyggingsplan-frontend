export const isoDato = (dato?: Date) =>
    dato &&
    new Intl.DateTimeFormat("en-CA", { dateStyle: "short" }).format(dato);
