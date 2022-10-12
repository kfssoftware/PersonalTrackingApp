import React, { Fragment } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
import PublicLayout from './Public'
import AuthLayout from './Auth'
import MainLayout from './Main'
import InviteLayout from './Invite'


const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  main: MainLayout,
  invite: InviteLayout,
  account: AuthLayout,
}

const Layout = ({ children, location: { pathname, search, previousPath } }) => {

  const appIsLoading = useSelector(state => state.root.appIsLoading);
  const i18nextLoading = useSelector(state => state.root.i18nextLoading);
  const isUserAuthorized = useSelector(state => state.auth.isUserAuthorized);

  // Layout Rendering
  const getLayout = () => {
    if (/^\/auth(?=\/|$)/i.test(pathname)) {
      return 'auth'
    } else if (/^\/invite(?=\/|$)/i.test(pathname)) {
      return 'invite'
    }
    else if (/^\/account(?=\/|$)/i.test(pathname)) {
      return 'account'
    }
    else if (/^\/device\/downloadPdf(?=\/|$)/i.test(pathname)) {
      return 'invite'
    }
    return 'main'
  }

  const Container = Layouts[getLayout()]
  const isAuthLayout = getLayout() === 'auth'
  const isInviteLayout = getLayout() === 'invite'
  const isAccountLayout = getLayout() === 'account'

  const BootstrappedLayout = () => {
    // show loader when user in check authorization process, not authorized yet and not on login pages
    if (appIsLoading || i18nextLoading) {
      return <div className="initial__loading"></div>;
    }
    // redirect to login page if current is not login page and user not authorized
    if (!isAuthLayout && !isInviteLayout && !isUserAuthorized && !isAccountLayout) {
      return <Redirect to="/auth/login" />
    }

    //redirect to dashboard page if user logged in
    if (isUserAuthorized && isAuthLayout && !isAccountLayout) {
      return <Redirect to="/dashboard/alpha" />
    }

    // in other case render previously set layout
    return <Container>{children}</Container>
  }

  return (
    <Fragment>
      <Helmet titleTemplate="Personal Tracking App | %s" title="Personal Tracking App" />
      {BootstrappedLayout()}
    </Fragment>
  )
}

export default withRouter(Layout)
