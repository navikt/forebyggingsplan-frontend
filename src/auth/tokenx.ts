import { JWK } from "jose";
import { Issuer } from "openid-client";

function createIssuer() {
    return new Issuer({
        issuer: process.env.TOKEN_X_ISSUER!!,
        token_endpoint: process.env.TOKEN_X_TOKEN_ENDPOINT,
        token_endpoint_auth_signing_alg_values_supported: ["RS256"],
    });
}

export async function veksleToken(token: string, intendedAudience: string) {
    const { Client } = createIssuer();
    const client = new Client(
        {
            token_endpoint_auth_method: "private_key_jwt",
            client_id: process.env.TOKEN_X_CLIENT_ID!!,
        },
        {
            keys: [
                JSON.parse(process.env.TOKEN_X_PRIVATE_JWK!!) as unknown as JWK,
            ],
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
