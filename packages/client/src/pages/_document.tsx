import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html className="dark">
        <Head>
          {/* Other head elements like link to CSS file, etc. */}
          <link href="https://assets-global.website-files.com/6253d5b96f29fe54ae351282/627917a839187b51f7812807_Group%203631.png" rel="shortcut icon" type="image/x-icon" />
          <link href="https://assets-global.website-files.com/6253d5b96f29fe54ae351282/62aa00cbcec5059a2108556c_MXC_New_Logo_Webflow_256.png" rel="apple-touch-icon" />
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
