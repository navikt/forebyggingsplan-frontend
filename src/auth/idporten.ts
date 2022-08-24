import { createRemoteJWKSet, jwtVerify } from "jose";

let signeringsnøkler: ReturnType<typeof createRemoteJWKSet>;

async function hentSigneringsnøkler() {
    if (!signeringsnøkler)
        signeringsnøkler = createRemoteJWKSet(new URL("IDPORTEN_JWKS_URI"), {
            cooldownDuration: 86400000, // 1 dag
        });
    return signeringsnøkler;
}

const forventetAcrNivå = "Level4";

async function verifiserToken(
    token: string
): Promise<ReturnType<typeof jwtVerify>> {
    const signeringsnøkler = await hentSigneringsnøkler();
    const { payload, protectedHeader, key } = await jwtVerify(
        token,
        signeringsnøkler,
        {
            algorithms: ["RS256"],
            issuer: process.env.IDPORTEN_ISSUER,
        }
    );
    if (payload.client_id !== process.env.IDPORTEN_CLIENT_ID) {
        throw new Error(
            `Client_id ${payload.client_id} på tokenet matcher ikke forventet client_id`
        );
    }
    if (payload.acr !== forventetAcrNivå) {
        throw new Error(
            `ACR nivå ${payload.acr} på tokenet matcher ikke forventet acr nivå ${forventetAcrNivå}`
        );
    }
    return {
        key,
        payload,
        protectedHeader,
    };
}

async function veksleToken(token: string) {}
