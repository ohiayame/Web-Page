import "@/styles/globals.css";
import Layout from "@/components/layout";

import { siteMeta } from '@/lib/constans';
const { siteMeta } = siteMeta;

// Font Awesome :setting
import '@fortawesome/fonttawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export default function RootLayout({ children }) {
  return (
    <html lang={siteMeta}>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
