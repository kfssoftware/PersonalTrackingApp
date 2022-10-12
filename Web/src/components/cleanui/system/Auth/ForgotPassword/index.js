import React, { useState } from 'react'
import { Input, Button, Form } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import style from '../style.module.scss'
import i18next from "i18next";
import { useDispatch } from 'react-redux';
import store from 'store'
import { Actions as ApiCallActions } from "redux/apiCall/reducers";
import { Actions as AuthActions } from "redux/auth/reducers";
import general from 'utils/general'
import { Modal } from 'antd';
import Icon from '@ant-design/icons';
import { PlusOutlined, CheckSquareOutlined, CloseSquareOutlined, CheckOutlined, KeyOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const history = useHistory();

  const onFinish = values => {

    setLoading(true);
    dispatch(ApiCallActions.NativePost({
      controller: "user",
      action: "forgotPassword",
      data: values,
      showAlertOnError: true,
      showLoading: true,
      onSuccess: ({ data }) => {
        if (data == true) {
          setShowSuccess(true)
          //general.notificationSuccess("general.new_password_work_sended");
          //history.push("/auth/login");
        }
        else
          general.notificationError("general.error_occured");
      },
      onError: x => console.log("err", x),
      callback: () => setLoading(false)
    }))
  }

  const onFinishFailed = errorInfo => {
  }



  return (
    <>
      {showSuccess &&
        <div>
          <div className={`card ${style.container}`}>
            <div className="text-dark font-size-24 mb-4">
              <Icon component={KeyOutlined} /> <strong>{i18next.t("general.new_password_work")}</strong>
            </div>
            <div style={{ fontSize: "16px", marginBottom: "20px" }}>
              {i18next.t("general.new_password_work_sended")}
            </div>
            <Link to="/auth/login" className="kit__utils__link font-size-16">
              <i className="fe fe-arrow-left mr-1 align-middle" />
              {i18next.t("action.or_login")}
            </Link>
          </div>
        </div>
      }
      {!showSuccess &&
        <div>
          <div className={`card ${style.container}`}>
            <div style={{ position: "absolute", right: "20px", top: "60px" }}>
              <LanguageSwitcher />
            </div>
            <div className="text-dark font-size-24 mb-4">
              <strong>{i18next.t("action.reset")}</strong>
            </div>
            <Form
              layout="vertical"
              hideRequiredMark
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="mb-4"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: i18next.t("validation.email_or_login_id") },
                { max: 50, message: i18next.t("validation.max_string_length").replace("[length]", 50) }
                ]}
              >
                <Input size="large"
                  type="text" placeholder={i18next.t("general.email")} />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="text-center w-100">
                <strong>{i18next.t("action.reset")}</strong>
              </Button>
            </Form>
            <Link to="/auth/login" className="kit__utils__link font-size-16">
              <i className="fe fe-arrow-left mr-1 align-middle" />
              {i18next.t("action.or_login")}
            </Link>
          </div>
        </div>
      }
    </>
  )
}

export default ForgotPassword
