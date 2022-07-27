import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta property="title" content="$name$ NFT" />
          <meta property="og:url" content="$param.base_url$" />
          <meta property="og:type" content="website" />

          <meta property="og:title" content="$name$" />
          <meta
            property="og:description"
            content="$param.description$"
          />
          <meta
            property="description"
            content="$param.description$"
          />

          {/* --- Twitter Meta Tags --- */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="https://$param.base_url$" />
          <meta
            property="twitter:url"
            content="https://$param.base_url$/"
          />
          <meta name="twitter:title" content="$name$" />
          <meta
            name="twitter:description"
            content="$param.description$"
          />
          <meta
            name="twitter:image"
            content="https://$param.base_url$/img/logo.png"
          />
          {/* --- Twitter Meta Tags ends --- */}
        </Head>
        <body>
          <div className="bg1 w-full"></div>
          <div className="bg2 w-full"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

