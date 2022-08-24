import { JWK } from "jose";
import { Issuer } from "openid-client";

let tokenxIssuer: Issuer;

async function createIssuer() {
    if (!tokenxIssuer) {
        tokenxIssuer = await Issuer.discover(
            process.env.TOKEN_X_WELL_KNOWN_URL!!
        );
    }
    return tokenxIssuer;
}

export async function veksleToken(token: string, intendedAudience: string) {
    const { Client, metadata } = await createIssuer();
    const client = new Client(
        {
            ...metadata,
            token_endpoint_auth_method: "private_key_jwt",
            client_id: process.env.IDPORTEN_CLIENT_ID!!,
        },
        {
            keys: [process.env.TOKEN_X_PRIVATE_JWK as unknown as JWK],
        }
    );
    return client.grant(
        {
            grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
            subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
            subject_token: token,
            audience: intendedAudience,
        },
        {
            clientAssertionPayload: {
                nbf: Math.floor(Date.now() / 1000),
            },
        }
    );
}
