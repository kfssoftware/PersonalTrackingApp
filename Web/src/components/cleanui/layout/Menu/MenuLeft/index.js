import React, { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import { StatusEnum, RoleActionEnum } from "utils/enums";
import classNames from 'classnames'
import store from 'store'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { find } from 'lodash'
import style from './style.module.scss'
import general from 'utils/general'
import getMenuData from 'services/menu'
import i18next from 'i18next';

const mapStateToProps = ({ menu, settings, user }) => ({
  menuData: menu.menuData,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isMenuUnfixed: settings.isMenuUnfixed,
  isMenuShadow: settings.isMenuShadow,
  leftMenuWidth: settings.leftMenuWidth,
  menuColor: settings.menuColor,
  logo: settings.logo,
  // role: user.Role,
})

const MenuLeft = ({
  dispatch,
  menuData = [],
  location: { pathname },
  isMenuCollapsed,
  isMobileView,
  isMenuUnfixed,
  isMenuShadow,
  leftMenuWidth,
  menuColor,
  logo,
  // role,
}) => {

  var curretUser = useSelector(state => state.auth?.userInfo);
  var loginUser = JSON.parse(JSON.stringify(curretUser));

  useEffect(async () => {
    const menuData = await getMenuData();
    dispatch({
      type: 'menu/SET_STATE',
      payload: {
        menuData,
      },
    })
  }, []);
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || [])
  const [openedKeys, setOpenedKeys] = useState(!isMenuCollapsed && (store.get('app.menu.openedKeys') || []))

  useEffect(() => {
    applySelectedKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const applySelectedKeys = () => {
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])

    var selectedItem = find(flattenItems(menuData, 'children'), ['url', pathname])

    if (pathname.toString().includes("/device/detail/")) {
      selectedItem = { title: "left_menu.device_list", key: "device-list", url: "/device/list" };
    }
    setSelectedKeys(selectedItem ? [selectedItem.key] : [])

  }

  const onCollapse = (value, type) => {
    if (type === 'responsive' && isMenuCollapsed) {
      return
    }
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    })
    setOpenedKeys([])
  }

  const onOpenChange = keys => {
    store.set('app.menu.openedKeys', keys)
    setOpenedKeys(keys)
  }

  const handleClick = e => {
    store.set('app.menu.selectedKeys', [e.key])
    setSelectedKeys([e.key])
  }

  const toggleMobileMenu = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: false,
      },
    })
  }
  const generateMenuItems = () => {
    const generateItem = item => {
      const { key, title, url, Icon, disabled, count } = item
      if (item.category) {
        return <Menu.ItemGroup key={Math.random()} title={i18next.t(item.title)} />
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            {item.target && (
              <a href={url} target={item.target} rel="noopener noreferrer" className="flex alignCenter">
                {Icon ? <Icon variant="Broken" size={22} className="mr-2" /> : null}
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}

              </a>
            )}
            {!item.target && (
              <Link to={url} onClick={toggleMobileMenu} className="flex alignCenter">
                {Icon ? <Icon variant="Broken" size={22} className="mr-2" /> : null}
                <span className={style.title} >{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}

              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled} className="flex alignCenter">
          {Icon ? <Icon variant="Broken" size={22} className="mr-2" /> : null}
          <span className={style.title}>{title}</span>
          {count && <span className="badge badge-success ml-2">{count}</span>}
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              <span className={style.title}>{i18next.t(menuItem.title)}</span>
              {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
              {menuItem.Icon ? <menuItem.Icon variant="Broken" size={18} color="#F53C51" /> : null}
            </span>
          )
          return (
            <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </Menu.SubMenu>
          )
        }
        return generateItem(menuItem)
      })

    return menuData.map(menuItem => {
      // if (menuItem.roles && !menuItem.roles.includes(role)) {
      //   return null
      // }
      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            {menuItem.Icon ? <menuItem.Icon variant="Broken" size={18} color="#F53C51" /> : null}
            <span className={style.title}>{i18next.t(menuItem.title)}</span>
            {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
          </span>
        )
        return (
          <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </Menu.SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  const menuSettings = isMobileView
    ? {
      width: leftMenuWidth,
      collapsible: false,
      collapsed: false,
      onCollapse,
    }
    : {
      width: leftMenuWidth,
      collapsible: true,
      collapsed: isMenuCollapsed,
      onCollapse,
      breakpoint: 'lg',
    }

  return (
    <Layout.Sider
      {...menuSettings}
      className={classNames(`${style.menu}`, {
        [style.white]: menuColor === 'white',
        [style.gray]: menuColor === 'gray',
        [style.dark]: menuColor === 'dark',
        [style.unfixed]: isMenuUnfixed,
        [style.shadow]: isMenuShadow,
      })}
    >
      <div
        className={style.menuOuter}
        style={{
          width: isMenuCollapsed && !isMobileView ? 80 : leftMenuWidth,
          height: isMobileView || isMenuUnfixed ? 'calc(100% - 64px)' : 'calc(100% - 110px)',
        }}
      >
        <div className={style.logoContainer} style={{ cursor: "pointer", borderBottom: '1px solid #e4e9f0', marginBottom: 15 }} onClick={() => document.location.href = "/#/dashboard/alpha"}>
          <div className={style.logo}>
            <img src="resources/images/tf-logo.png" style={{ width: "135px", marginLeft: isMenuCollapsed ? 80 : 20 }} className="mr-2 mt-2" alt="Personal Tracking App" />
            {loginUser.fullName && <div className={style.descr}>{loginUser.fullName}</div>}
          </div>
        </div>
        <PerfectScrollbar>
          <Menu
            onClick={handleClick}
            selectedKeys={selectedKeys}
            openKeys={openedKeys}
            onOpenChange={onOpenChange}
            mode="inline"
            className={style.navigation}
            inlineIndent="15"
          >
            {generateMenuItems()}
          </Menu>
        </PerfectScrollbar>
      </div>
    </Layout.Sider>
  )
}

export default withRouter(connect(mapStateToProps)(MenuLeft))
