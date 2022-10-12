import React from 'react'
import { Dropdown } from 'antd'
import styles from './style.module.scss'

const Actions = () => {
  const menu = (
    <React.Fragment>
      <div className="card cui__utils__shadow width-350 border-0">
        <div className="card-body p-0">
        </div>
      </div>
    </React.Fragment>
  )
  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div className={styles.dropdown}>
        <i className={`${styles.icon} fe fe-bell`} />
      </div>
    </Dropdown>
  )
}

export default Actions
