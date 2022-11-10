import { createRemoteJWKSet, jwtVerify } from "jose";
import { Issuer } from "openid-client";

let signeringsnøkler: ReturnType<typeof createRemoteJWKSet>;

let idportenIssuer: Issuer;

async function hentIssuer() {
    const issuerUrl = process.env.IDPORTEN_WELL_KNOWN_URL;
    if (!issuerUrl) throw new Error("Mangler miljøvariabelen 'IDPORTEN_WELL_KNOWN_URL' for å kunne lage en issuer")
    if (!idportenIssuer) {
        idportenIssuer = await Issuer.discover(
            issuerUrl
        );
    }
    return idportenIssuer;
}

async function hentSigneringsnøkler() {
    const issuer = await hentIssuer();
    if (!signeringsnøkler)
        signeringsnøkler = createRemoteJWKSet(
            new URL(
                issuer.metadata.jwks_uri ?? process.env.IDPORTEN_JWKS_URI ?? ""
            ),
            {
                cooldownDuration: 86400000, // 1 dag
            }
        );
    return signeringsnøkler;
}

const forventetAcrNivå = "Level4";

export async function verifiserToken(
    token: string
): Promise<ReturnType<typeof jwtVerify>> {
    const signeringsnøkler = await hentSigneringsnøkler();
    const issuer = await hentIssuer();
    const { payload, protectedHeader, key } = await jwtVerify(
        token,
        signeringsnøkler,
        {
            algorithms: ["RS256"],
            issuer: issuer.metadata.issuer,
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
