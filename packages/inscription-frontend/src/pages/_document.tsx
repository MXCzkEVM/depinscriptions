import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html className="dark">
        <Head>
          {/* Other head elements like link to CSS file, etc. */}
          <link rel="shortcut icon" type="image/png" href="https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
