import { Col, Row } from 'antd'
import React from 'react'
import style from './style.module.scss'

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} >
            <a
              href="https://kazimfiratsucuk.com"
              target="_blank"
              rel="noopener noreferrer"
              className='w-50'
            >
              Kazım Fırat Sucuk
            </a>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} className="flex right" >
            <p className="mb-0">
              © 2022 - Kazım Fırat Sucuk
            </p>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Footer
