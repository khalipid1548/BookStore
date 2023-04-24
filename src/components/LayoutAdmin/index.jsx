import {useDispatch, useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';
import React, {useState} from 'react';
import {Dropdown, Space, theme, message, Avatar} from 'antd';
import {
  DownOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import {Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import {callLogout} from '../../services/api-auth';
import {doLogoutAction} from '../../redux/account/accountSlice';

const {Content, Footer, Sider, Header} = Layout;

const index = () => {
  const user = useSelector((state) => state.account.user);
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

  const dispatch = useDispatch();
  const {token: {colorBgContainer}} = theme.useToken();
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success('Đăng xuất thành công');
      Navigate('/');
    }
  };

  const items = [
    {
      label: <Link to="/admin">Dash Board Admin</Link>,
      key: 'dashboard',
      icon: <DesktopOutlined />,
    },
    {
      label: <Link to="/admin/user">Manage Users</Link>,
      key: 'crud',
      icon: <TeamOutlined />,
    },
    {
      label: <Link to="/admin/book">Manage Books</Link>,
      key: 'book',
      icon: <FileOutlined />,
    },
   
  ];

  const itemsDropDown = [
    {
      label: <Link to='/' >Trang chủ</Link>,
      key: 'home',
    },
    {
      label: <label>Account</label>,
      key: 'accountAdmin',
    },
    {
      label: (
        <label style={{cursor: 'pointer'}} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: 'logout',
    },
  ];

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Sider theme="light">
        <Menu defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{padding: 0, background: colorBgContainer,display:'flex',justifyContent:'end',padding:'0 40'}}>
          <Dropdown menu={{items: itemsDropDown}}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar src={urlAvatar} />
                {user?.fullName}</Space>
              <DownOutlined />
            </a>
          </Dropdown>
        </Header>
        <Content style={{margin: '0 16px'}}>
          <Outlet />
        </Content>
        <Footer style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default index;
