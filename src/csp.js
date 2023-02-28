const csp = {
    "default-src": ["'self'", "arbeidsgiver.nav.no"],
    "script-src": [
        "'self'",
        "'report-sample'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        "static.hotjar.com",
        "script.hotjar.com",
        "*.psplugin.com",
        "*.taskanalytics.com/tm.js",
        "*.nav.no",
        "www.nav.no",
    ],
    "style-src": ["'self'", "blob:", "'unsafe-inline'", "*.nav.no"],
    "connect-src": [
        "'self'",
        "*.nav.no",
        "oidc-ver2.difi.no/idporten-oidc-provider/authorize",
        "idporten-ver2.difi.no/opensso/SSORedirect/metaAlias/norge.no/idp4",
        "amplitude.nav.no",
        "*.psplugin.com",
        "*.hotjar.com",
        "*.vc.hotjar.com",
        "*.hotjar.io",
        "*.vc.hotjar.io",
        "wss://*.hotjar.com",
    ],
    "font-src": [
        "'self'",
        "data:",
        "*.hotjar.com",
        "*.psplugin.com",
        "www.nav.no",
        "cdn.nav.no",
    ],
    "frame-src": ["vars.hotjar.com", "*.nav.no"],
    "img-src": ["'self'", "*.hotjar.com", "nav.no", "*.nav.no", "data:"],
    "manifest-src": ["'self'", "www.nav.no", "dekoratoren.ekstern.dev.nav.no"],
    "media-src": ["'self'", "blob:"],
    "object-src": ["'self'", "blob:"],
    "worker-src": ["'self'", "blob:"],
};

const stringified = Object.entries(csp)
    .map((entry) => `${entry[0]} ${entry[1].join(" ")}`)
    .join("; ");

module.exports = stringified;
