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
            // backgroundImage:
            //   authPagesColor === 'image' ? 'url(resources/images/content/photos/7.jpg)' : '',
            backgroundImage: 'url(/resources/images/login-bg.jpg)'
          }}
        >
          {/* <div
            className={classNames(`${style.topbar}`, {
              [style.topbarGray]: isGrayTopbar,
            })}
          >
            <div className={style.logoContainer}>
              <div className={style.logo}>
                  <img src="resources/images/logo.png" style={{"align-items": "normal","height": "40px"}} className="mr-2" alt="Clean UI" />
                  {!general.isNullOrEmpty(AppConfig.APP_BY) && <div className={style.descr}>{AppConfig.APP_BY}</div>}
              </div>
            </div>
            
            <div className="d-none d-sm-block">
              <span className="mr-2">Don&#39;t have an account?</span>
              <Link to="/auth/register" className="font-size-16 kit__utils__link">
                Sign up
              </Link>
            </div>

          </div> */}

          <div className="mt-5 pt-3 col-sm-6 col-md-6 col-lg-8">{children}</div>
          <div className="mt-auto pb-5 pt-5">
            {/* <ul
              className={`${style.footerNav} list-unstyled d-flex mb-0 flex-wrap justify-content-center`}
            >
              <li>
                <a href="#" onClick={e => e.preventDefault()}>
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" onClick={e => e.preventDefault()}>
                  Compliance
                </a>
              </li>
              <li>
                <a href="#" onClick={e => e.preventDefault()}>
                  Support
                </a>
              </li>
              <li>
                <a href="#" onClick={e => e.preventDefault()}>
                  Contacts
                </a>
              </li>
            </ul> */}
            <div className="text-center">
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default withRouter(connect(mapStateToProps)(AuthLayout))
