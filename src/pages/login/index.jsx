import React, {useState} from 'react';
import {Button, Divider, Form, Input, message, notification} from 'antd';
import {callLogin} from '../../services/api-auth';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';


function LoginPage() {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const {username, password} = values;
    setIsSubmit(true);

    // call API
    const res = await callLogin(username, password);
    setIsSubmit(false);

    if (res?.data) {
      localStorage.setItem('access_token' , res.data.access_token)
      dispatch(doLoginAction(res.data.user))
      message.success('Đăng Nhập thành công');
      navigate('/');
    } else {
      notification.error({
        message: 'có lỗi xảy ra',
        duration: 5,
        description: res.message && Array.isArray(res.message) ? res.message : 'k thành công',
      });
    }
    
  };

  return (
    <div style={{padding: 30}}>
      <h3 style={{textAlign: 'center'}}>Đăng Nhập</h3>
      <Divider />
      <Form
        name="basic"
        labelCol={{span: 6}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 600, margin: '0 auto'}}
        initialValues={{remember: true}}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          labelCol={{span: 24}}
          label="Email"
          name="username"
          rules={[{required: true, message: 'Please input your email!', type: 'email'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{span: 24}}
          label="Password"
          name="password"
          rules={[{required: true, message: 'Please input your password!'}]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng Nhập
          </Button>
        </Form.Item>
      </Form>
      <Divider>Or</Divider>
      <p style={{textAlign: 'center'}}>
        Chưa có tài khoản ? <Link to="/register">Đăng Ký</Link>
      </p>
    </div>
  );
}

export default LoginPage;
