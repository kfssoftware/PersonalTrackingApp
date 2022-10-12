import React, { useState } from 'react'
import { Input, Button, Form } from 'antd'
import { Link, useParams, useLocation, BrowserRouter as Router, Redirect, useHistory } from 'react-router-dom'
import style from '../style.module.scss'
import i18next from "i18next";
import { useDispatch } from 'react-redux';
import store from 'store'
import { Actions as ApiCallActions } from "redux/apiCall/reducers";
import { Actions as AuthActions } from "redux/auth/reducers";
import general from 'utils/general'
import { CloseOutlined, MailOutlined, PhoneOutlined, SaveOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';


const ResetPassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const queryParams = new URLSearchParams(useLocation().search);
  const key = queryParams.get('key');

  const onFinish = values => {
    setLoading(true);
    if (values?.password === values?.password_repeat) {

      dispatch(ApiCallActions.NativePost({
        controller: "user",
        action: "resetPassword",
        data: { ...values, passwordKey: key },
        showAlertOnError: true,
        showLoading: true,
        onSuccess: ({ data }) => {
          if (data == true) {
            general.notificationSuccess("general.your_password_change_you_can_login");
            history.push("/auth/login");
          }
          else
            general.notificationError("general.error_occured");
        },
        onError: x => console.log("err", x),
        callback: () => setLoading(false)
      }))
    }
  }

  const onFinishFailed = errorInfo => {
  }

  return (
    <div>
      <div className={`card ${style.container}`}>
        <div className="text-dark font-size-24 mb-4">
          <strong>{i18next.t("action.create_password")}</strong>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: i18next.t("validation.password_required") },
            { min: 6, message: i18next.t("validation.min_string_length").replace("[length]", 6) }, { max: 20, message: i18next.t("validation.max_string_length").replace("[length]", 20) }]}
          >
            <Input.Password
              prefix={<KeyOutlined />}
              allowClear
              size="large"
              placeholder={i18next.t("general.password")}
            />
          </Form.Item>
          <Form.Item
            name="password_repeat"
            rules={[
              { required: true, message: i18next.t("validation.password_repeat_required") },
              { min: 6, message: i18next.t("validation.min_string_length").replace("[length]", 6) },
              { max: 20, message: i18next.t("validation.max_string_length").replace("[length]", 20) },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(i18next.t('message.warning.please_fill_same_password')));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined />}
              allowClear
              size="large"
              placeholder={i18next.t("general.password_repeat")}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" className="text-center w-100">
            <strong>{i18next.t("action.create_password")}</strong>
          </Button>
        </Form>
        <Link to="/auth/login" className="kit__utils__link font-size-16">
          <i className="fe fe-arrow-left mr-1 align-middle" />
          {i18next.t("action.or_login")}
        </Link>
      </div>
    </div >
  )
}

export default ResetPassword
