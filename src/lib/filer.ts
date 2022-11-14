export const lastNedFil = (blob: Blob) => {
    const imageURL = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = imageURL;
    anchor.download = "kalender.ics";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(imageURL);
};
