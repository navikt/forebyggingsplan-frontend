import {
    DocumentContext,
    DocumentInitialProps,
    Html,
    Head,
    Main,
    default as Document,
    NextScript,
} from "next/document";
import {
    Components,
    fetchDecoratorReact,
} from "@navikt/nav-dekoratoren-moduler/ssr";

interface Props {
    Dekoratør: Components;
}

export default class MyDocument extends Document<Props> {
    static async getInitialProps(
        ctx: DocumentContext
    ): Promise<DocumentInitialProps & Props> {
        const initialProps = await Document.getInitialProps(ctx);

        const Dekoratør = await fetchDecoratorReact({
            env: process.env.NAIS_CLUSTER_NAME === "prod-gcp" ? "prod" : "dev",
            chatbot: false,
            context: "arbeidsgiver",
            breadcrumbs: [],
        });

        return { ...initialProps, Dekoratør };
    }

    render(): JSX.Element {
        const { Dekoratør } = this.props;

        return (
            <Html lang="no">
                <Head>
                    <Dekoratør.Styles />
                </Head>
                <body>
                    <Dekoratør.Header />
                    <Main />
                    <Dekoratør.Footer />
                    <Dekoratør.Scripts />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
