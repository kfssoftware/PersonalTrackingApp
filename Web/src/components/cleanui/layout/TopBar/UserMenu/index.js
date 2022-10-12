import React, { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Avatar, Badge, Popover, Button } from 'antd'
import styles from './style.module.scss'
import store from "store";
import { Actions as AuthActions } from "redux/auth/reducers";
import general from 'utils/general'
import i18next from 'i18next';
import { FormSelect } from 'components/high-level/form'
import { RoleActionEnum, UserTypeEnum } from 'utils/enums'
import ModalTypes from 'utils/modal-types'
import { Actions as ModalActions } from 'redux/modal/reducers'

const mapStateToProps = ({ user }) => ({ user })

const ProfileMenu = ({ user }) => {
  const [count, setCount] = useState(7)
  const dispatch = useDispatch();

  const modals = useSelector(state => state.modal.modals);
  const logout = e => {
    e.preventDefault()
    const languageId = store.get("userLanguageId");
    store.remove("token");
    localStorage.clear();
    store.set("userLanguageId", languageId);
    general.notificationSuccess("general.logout_success");
    dispatch(AuthActions.setAuthState({
      isUserAuthorized: false,
      token: "",
    }));
    window.location.reload();
    // dispatch({
    //   type: 'user/LOGOUT',
    // })
  }

  const changePassword = e => {
    e.preventDefault();
    dispatch(ModalActions.openModal({
      type: ModalTypes.CHANGE_PASSWORD_PROFILE_MODAL,
      modalProps: {}
    }))
  }

  var curretUser = useSelector(state => state.auth?.userInfo);
  var loginUser = JSON.parse(JSON.stringify(curretUser));

  const addCount = () => {
    setCount(count + 1)
  }
  const menu = (
    <Menu selectable={false}>
      <Menu.Item>
        <div style={{ textAlign: "center" }}>
          <strong>
            {loginUser.fullname}
          </strong>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={logout} style={{ display: "inline-block" }}>
          <i className="fe fe-log-out mr-2" />
          {"Log out"}
        </a>
      </Menu.Item>
    </Menu>
  )
  return (
    <>
      <Dropdown overlay={menu} trigger={['click']} onVisibleChange={addCount}>
        <div className={styles.dropdown}>
          <Badge>
            {
              global?.userInfo?.ProfilePhoto ?
                <img src={global?.userInfo?.ProfilePhoto} style={{ width: "50px" }} />
                :
                <Avatar className={styles.avatar} shape="square" size="large" icon={<UserOutlined />} />
            }
          </Badge>
        </div>
      </Dropdown>
    </>
  )
}

export default connect(mapStateToProps)(ProfileMenu)
