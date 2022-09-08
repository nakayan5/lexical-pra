import '../styles/reset.css'

import { RecoilRoot } from 'recoil'
import { Fragment } from 'react'
import Head from 'next/head'
import { GA_ID } from '@/constants'

function MyApp({ Component, pageProps }: any) {
  return (
    <Fragment>
      <Head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: false });
            `,
          }}
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap'
          rel='stylesheet'
        />
      </Head>
      <RecoilRoot>
        <div style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
          <Component {...pageProps} />
        </div>
      </RecoilRoot>
    </Fragment>
  )
}

export default MyApp
