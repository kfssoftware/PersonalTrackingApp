import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from 'layouts'

const routes = [
  // Dashboards
  {
    path: '/dashboard/alpha',
    Component: lazy(() => import('pages/dashboard/alpha')),
    exact: true,
  },

  // Auth Pages
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/login/:language',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  const reload = () => window.location.reload();

  return (
    <>
      <ConnectedRouter history={history}>
        <Layout>
          <Route
            render={state => {
              const { location } = state
              return (
                <SwitchTransition>
                  <CSSTransition
                    key={location.pathname}
                    appear
                    classNames={routerAnimation}
                    timeout={routerAnimation === 'none' ? 0 : 300}
                  >
                    <Switch location={location}>
                      <Route path="/apple-app-site-association" onEnter={reload} />
                      <Route exact path="/" render={() => <Redirect to="/dashboard/alpha" />} />
                      {routes.map(({ path, Component, exact }) => (
                        <Route
                          path={path}
                          key={path}
                          exact={exact}
                          render={() => {
                            return (
                              <div className={routerAnimation}>
                                <Suspense fallback={null}>
                                  <Component />
                                </Suspense>
                              </div>
                            )
                          }}
                        />
                      ))}
                      <Redirect to="/auth/404" />
                    </Switch>
                  </CSSTransition>
                </SwitchTransition>
              )
            }}
          />
        </Layout>
      </ConnectedRouter>
    </>
  )
}

export default connect(mapStateToProps)(Router)
