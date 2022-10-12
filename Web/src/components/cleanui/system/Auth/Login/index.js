import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Input, Button, Form } from 'antd'
import { Link } from 'react-router-dom'
import style from '../style.module.scss'
import { FormInputPassword } from "components/high-level/form";
import store from 'store'
import general from "utils/general";
import { Actions as ApiCallActions } from "redux/apiCall/reducers";
import { Actions as AuthActions } from "redux/auth/reducers";
import i18next from "i18next";
import Validator from "components/high-level/validator";
import { UserTypeEnum } from 'utils/enums'

const Login = ({ }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = values => {
    setLoading(true);
    dispatch(ApiCallActions.NativePost({
      controller: "auth",
      action: "login",
      data: {
        username: values?.username,
        password: values?.password
      },
      showAlertOnError: true,
      showLoading: true,
      onSuccess: ({ data }) => {
        store.set("token", data?.token);
        dispatch(AuthActions.setAuthState({
          userInfo: data,
          token: data?.token,
          isUserAuthorized: true
        }));
        global.token = data?.token;
        global.roles = [];
        global.userInfo = data;
        window.location.reload();
      },
      onError: x => console.log("err", x),
      callback: () => setLoading(false)
    }))
  }

  const onFinishFailed = errorInfo => {
  }
  const [validator,] = useState(new Validator());
  const validatorScopeKey = validator.generateNewScopeKey();
  return (
    <div>
      <div className="text-center mb-5">
      </div>
      <div className={`card ${style.container}`} style={{ marginTop: "100px" }}>
        <div className="text-dark font-size-24 mb-3" style={{ textAlign: 'center', marginBottom: 10 }}>
          <h1><img src="/resources/images/tf-logo.png" alt="Personal Tracking App" height={90} /></h1>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ username: '', password: '' }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Required" },
            { max: 50, message: "You can enter a maximum of 50 characters" }
            ]}
          >
            <Input placeholder={"Username"} size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Required" },
            { max: 50, message: "You can enter a maximum of 50 characters" }
            ]}
          >
            <Input.Password placeholder={"Password"} size="large" />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            block
            loading={loading}>
            <strong>Login</strong>
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Login;
