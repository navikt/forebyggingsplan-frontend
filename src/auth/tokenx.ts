import { JWK } from "jose";
import { Issuer } from "openid-client";

function createIssuer() {
    const issuer = process.env.TOKEN_X_ISSUER;
    if (!issuer)
        throw new Error("Må ha en tokenx issuer for å kunne veksle tokens");

    return new Issuer({
        issuer,
        token_endpoint: process.env.TOKEN_X_TOKEN_ENDPOINT,
        token_endpoint_auth_signing_alg_values_supported: ["RS256"],
    });
}

export async function veksleToken(token: string, intendedAudience?: string) {
    const client_id = process.env.TOKEN_X_CLIENT_ID;
    const jwkString = process.env.TOKEN_X_PRIVATE_JWK;

    if (!intendedAudience) {
        throw new Error("Kan ikke veksle et token uten audience!");
    }
    if (!client_id) {
        throw new Error(
            "Mangler miljøvariabel 'TOKEN_X_CLIENT_ID' for å kunne lage en tokenutvekslings-klient"
        );
    }
    if (!jwkString) {
        throw new Error(
            "Mangler miljøvariabel 'TOKEN_X_PRIVATE_JWK' for å kunne lage en tokenutvekslings-klient"
        );
    }
    const { Client } = createIssuer();
    const client = new Client(
        {
            token_endpoint_auth_method: "private_key_jwt",
            client_id,
        },
        {
            keys: [JSON.parse(jwkString) as unknown as JWK],
        }
    );
    const tokenSet = await client.grant(
        {
            grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
            client_assertion_type:
                "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
            subject_token: token,
            audience: intendedAudience,
        },
        {
            clientAssertionPayload: {
                nbf: Math.floor(Date.now() / 1000),
                aud: process.env.TOKEN_X_TOKEN_ENDPOINT,
            },
        }
    );
    return tokenSet?.access_token;
}
