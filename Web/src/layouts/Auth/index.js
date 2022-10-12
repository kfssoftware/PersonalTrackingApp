import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import Sidebar from 'components/cleanui/layout/Sidebar'
import style from './style.module.scss'
import general from 'utils/general'

const mapStateToProps = ({ settings }) => ({
  logo: settings.logo,
  isGrayTopbar: settings.isGrayTopbar,
  isCardShadow: settings.isCardShadow,
  isSquaredBorders: settings.isSquaredBorders,
  isBorderless: settings.isBorderless,
  authPagesColor: settings.authPagesColor,
})

const AuthLayout = ({
  children,
  logo,
  isGrayTopbar,
  isCardShadow,
  isSquaredBorders,
  isBorderless,
  authPagesColor,
}) => {
  return (
    <Layout>
      <Layout.Content>
        {/* <Sidebar /> */}
        <div
          className={classNames(`${style.container}`, {
            cui__layout__squaredBorders: isSquaredBorders,
            cui__layout__cardsShadow: isCardShadow,
            cui__layout__borderless: isBorderless,
            [style.white]: authPagesColor === 'white',
            [style.gray]: authPagesColor === 'gray',
          })}
          style={{
            backgroundImage: 'url(/resources/images/login-bg.jpg)'
          }}
        >
          <div className="mt-5 pt-3 col-sm-6 col-md-6 col-lg-4">{children}</div>
          <div className="mt-auto pb-5 pt-5">
            <div className="text-center">
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default withRouter(connect(mapStateToProps)(AuthLayout))
