import { createRemoteJWKSet, jwtVerify } from "jose";
import { Issuer } from "openid-client";
import { logger } from "../lib/logger";

let signeringsnøkler: ReturnType<typeof createRemoteJWKSet>;

let idportenIssuer: Issuer;

async function hentIssuer() {
    const issuerUrl = process.env.IDPORTEN_WELL_KNOWN_URL;
    if (!issuerUrl)
        throw new Error(
            "Mangler miljøvariabelen 'IDPORTEN_WELL_KNOWN_URL' for å kunne lage en issuer"
        );
    if (!idportenIssuer) {
        idportenIssuer = await Issuer.discover(issuerUrl);
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

const forventetAcrNivå = ["Level4", "idporten-loa-high"];

export async function verifiserToken(
    token: string
): Promise<ReturnType<typeof jwtVerify>> {
    const signeringsnøkler = await hentSigneringsnøkler().catch((e) => {
        logger.error(`Feilet under henting av signeringsnøkler ${e}`);
        throw new Error(`Feilet under kontakt med IDporten`);
    });
    const issuer = await hentIssuer().catch((e) => {
        logger.error(`Feilet under henting av signeringsnøkler ${e}`);
        throw new Error(`Feilet under kontakt med IDporten`);
    });
    const { payload, protectedHeader, key } = await jwtVerify(
        token,
        signeringsnøkler,
        {
            algorithms: ["RS256"],
            issuer: issuer.metadata.issuer,
        }
    ).catch((e) => {
        logger.error(`Token validering har feilet: ${e}`);
        throw new Error(`Token validering har feilet`);
    });
    if (payload.client_id !== process.env.IDPORTEN_CLIENT_ID) {
        logger.error(
            `Client_id ${payload.client_id} på tokenet matcher ikke forventet client_id`
        );
        throw new Error(`Token validering har feilet`);
    }
    if (!forventetAcrNivå.includes(payload.acr as string)) {
        logger.error(
            `ACR nivå ${payload.acr} på tokenet matcher ikke forventet acr nivå ${forventetAcrNivå}`
        );
        throw new Error(`Token validering har feilet`);
    }
    return {
        key,
        payload,
        protectedHeader,
    };
}
