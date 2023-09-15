export const oppdaterStatus = async (
    statusId: string,
    orgnr: string,
    status: "startet" | "fullført" | "avbrutt",
) => {
    return await fetch(
        `forebyggingsplan/api/status/${statusId}/orgnr/${orgnr}`,
        {
            method: "POST",
            body: JSON.stringify({ status }),
        },
    );
};
