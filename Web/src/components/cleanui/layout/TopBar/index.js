import React from 'react'
import FavPages from './FavPages'
import Search from './Search'
import IssuesHistory from './IssuesHistory'
import ProjectManagement from './ProjectManagement'
import Actions from './Actions'
import UserMenu from './UserMenu'
import Notification from './Notification'
import style from './style.module.scss'


const TopBar = () => {
  return (
    <div className={style.topbar}>
      <div className="mr-4">
        {/* <FavPages /> */}
      </div>
      <div className="mr-auto">
        {/* <Search /> */}
      </div>
      <div className="mr-4 d-none d-md-block">
        {/* <IssuesHistory /> */}
      </div>
      <div className="mb-0 mr-auto d-xl-block d-none">
        {/* <ProjectManagement /> */}
      </div>
      <div className="mr-4 d-none d-sm-block">
        {/* <Actions /> */}

      </div>
        <Notification />
        <UserMenu />
    </div>
  )
}

export default TopBar
