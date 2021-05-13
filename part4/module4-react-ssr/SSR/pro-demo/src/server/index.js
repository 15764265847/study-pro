import { renderToString } from 'react-dom/server'
import React from "react";
import { StaticRouter } from 'react-router-dom'
import { renderRoutes, matchRoutes } from 'react-router-config'
import { Provider } from 'react-redux';

import app from './http'
// import Home from '../share/pages/Home'
import routes from '../share/routes';

import createStore from './createStore';

app.get('*', (req, res) => {
  console.log(req.path, 'req.path')
  const store = createStore()
  const routePromise = matchRoutes(routes, req.path).map(({ route }) => {
    if (route.loadData ) {
      return route.loadData(store)
    }
  })
  Promise.all(routePromise).then(resp => {
    const initialState = store.getState()
    const html = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.path}>
          { renderRoutes(routes) }
        </StaticRouter>
      </Provider>
    )
    res.send(`
      <html>
        <head>
          <title>react ssr</title>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>window.INITAL_STATE=${JSON.stringify(initialState)}</script>
          <script defer src="bundle.js"></script>
        </body>
      </html>
    `)
  })
})
