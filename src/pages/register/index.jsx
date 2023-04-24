import React, {useState} from 'react';
import {Button, Divider, Form, Input, message, notification} from 'antd';
import {callRegister} from '../../services/api-auth';
import {Link, useNavigate} from 'react-router-dom';



function RegisterPage() {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const {fullName, email, password, phone} = values;
    setIsSubmit(true);

    // call API
    const res = await callRegister(fullName, email, password, phone);
    setIsSubmit(false);

    if (res?.data?._id) {
      message.success('Đăng ký tài khoản thành công');
      navigate('/login');
    } else {
      notification.error({
        message: 'có lỗi xảy ra',
        duration: 5,
        description: res.message && Array.isArray(res.message) ? res.message : "k thành công",
      });
    }
   
  };

  return (
    <div style={{padding: 30}}>
      <h3 style={{textAlign: 'center'}}>Đăng ký người dùng mới</h3>
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
          label="Full name"
          name="fullName"
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{span: 24}}
          label="Email"
          name="email"
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

        <Form.Item
          labelCol={{span: 24}}
          label="Phone"
          name="phone"
          rules={[{required: true, message: 'Please input your email!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng Ký
          </Button>
        </Form.Item>
      </Form>
      <Divider>Or</Divider>
      <p style={{textAlign: 'center'}}>Đã có tài khoản ? <Link to="/login">Đăng Nhập</Link></p>
    </div>
  );
}

export default RegisterPage;
