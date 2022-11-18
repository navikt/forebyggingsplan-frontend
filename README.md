# Forebyggingsplan-frontend

Flate der arbeidsgivere kan jobbe med å forebygge sykefravær i sin virksomhet

# Komme i gang

## Før du køyrer opp ting fyrste gong
Lag eit personleg access-token (PAT) slik at vi får tilgang til dependencies frå @navikt på gpr (github package registry/repository-ish). 
1. Logg inn i GitHub
2. Gå til [Settings / Developer settings / Personal access tokens / Tokens (classic)](https://github.com/settings/tokens)
3. Generate new token (classic)
4. Gje tokenet scope `read:packages`
5. "Generate token"
6. Kopier PAT
7. Køyr `npm login --registry https://npm.pkg.github.com` i terminal
8. Skru på SSO

## Køyre opp appen
For å kjøre appen lokalt, kjør følgende kommandoer i terminal:

-   `docker-compose up`
-   `npm install`
-   `npm run dev`

Appen vil da være tilgjengelig på http://localhost:4000.

# Sanity

// TODO skriv litt om sanity

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team_pia_utvikling](https://nav-it.slack.com/archives/C02T6RG9AE4).
