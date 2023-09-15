import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { RemixServer } from '@remix-run/react'
import type { EntryContext } from '@remix-run/node'
import createEmotionCache from './src/createEmotionCache'
import theme from './src/theme'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  function MuiRemixServer() {
    return (
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RemixServer context={remixContext} url={request.url} />
        </ThemeProvider>
      </CacheProvider>
    )
  }

  const html = ReactDOMServer.renderToString(<MuiRemixServer />)
  const { styles } = extractCriticalToChunks(html)

  let stylesHTML = ''

  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`
    stylesHTML = `${stylesHTML}${newStyleTag}`
  })

  const markup = html.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
