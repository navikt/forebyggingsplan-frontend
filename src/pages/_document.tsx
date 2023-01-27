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
    Env,
    Components,
    fetchDecoratorReact,
} from "@navikt/nav-dekoratoren-moduler/ssr";

interface Props {
    Dekoratør: Components;
}

const decoratorEnv = process.env.DECORATOR_ENV as Exclude<Env, "localhost">;

export default class MyDocument extends Document<Props> {
    static async getInitialProps(
        ctx: DocumentContext
    ): Promise<DocumentInitialProps & Props> {
        const initialProps = await Document.getInitialProps(ctx);

        const Dekoratør = await fetchDecoratorReact({
            env: decoratorEnv ?? "prod",
            chatbot: false,
            context: "arbeidsgiver",
            breadcrumbs: [
                // {
                //     title: "Forebygge fravær",
                //     url: "/min-ia",
                // },
                {
                    title: "Slik forebygger dere sykefravær",
                    url: "/forebyggingsplan",
                },
            ],
            urlLookupTable: false,
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
