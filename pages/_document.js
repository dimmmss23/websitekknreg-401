import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* ...existing meta tags... */}
        <meta name="google-site-verification" content="duLCtbbMorjEClcOh8ObvAxQmJakTp8hD8DwjS3NW3E" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
