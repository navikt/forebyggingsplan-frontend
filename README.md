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

Appen vil da være tilgjengelig på http://localhost:4000/forebyggingsplan.

NB: hvis du blir redirectet til `http://host.docker.internal:8080/idporten/authorize` og ikke få koblet til, så sjekk at `/etc/hosts` har linjen:
```
127.0.0.1 host.docker.internal
```

# Sanity
Vi bruker Sanity som CMS for å lage innhald og kategoriar til forebyggingsplanen. Dette gjer det lettare for innhaldsprodusentar i eit tverrgfagleg team å vedlikehalde innhaldet på sida.

Slik køyrer du opp Sanity studio for utvikling lokalt
1. `npm install` i mappa /sanity-studio
2. `npm start` i samme mappa
3. Åpne http://localhost:3333 og logg på med Nav-SSO
4. 🎉🎉🎉

Sanity i prod:
https://nav-pia-forebyggingsplan.sanity.studio/desk
Logg på med Nav-SSO. 

For å kunne bruke Nav-SSO til Sanity må du må bestille tilgang gjennom [MyApps](https://myapps.microsoft.com/). 
Kontakt #team-pia på Slack for redigeringstilgang.

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team_pia_utvikling](https://nav-it.slack.com/archives/C02T6RG9AE4).
