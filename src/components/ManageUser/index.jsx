import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Badge, Button, Descriptions, Divider, Drawer, Form, Input, Modal, Table, message, notification } from 'antd';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { callCreateUser, callFetchListUser, callUpdateUser,callDeleteUser } from '../../services/api-crud-user';

const index = (props) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: 250,
      render: (text, record, index) => {
        return (
          <a  href="#" onClick={() => {showDrawer(record)}}>
            {record._id}
          </a>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số Điện thoại',
      dataIndex: 'phone',
    },
  ];
 
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [formUpdateUser] = Form.useForm();
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setpageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [dataView, setDataView] = useState('');
  const [openAddUser, setOpenAddUser] = useState(false);
  

  const onFinishModal = async (values) => {
    const {fullName, email, password, phone} = values;
    setLoading(true);

    // call API
    const res = await callCreateUser(fullName, email, password, phone);
    setLoading(false);

    if (res?.data?._id) {
      message.success('Tạo user thành công');
      form.resetFields()
      setOpenAddUser(false);
    } else {
      notification.error({
        message: 'có lỗi xảy ra',
        description: res.message,
      });
    }
   
  };

  const showDrawer = (info) => {
    setOpen(true);
    setDataView(info);
    console.log(info)
  };


  const onFinish = async (values) => {
    let query = '';

    if (values.fullName) {
      query += `&fullName=/${values.fullName}/i`;
    }
    if (values.email) {
      query += `&email=/${values.email}/i`;
    }
    if (values.phone) {
      query += `&phone=/${values.phone}/i`;
    }
    if (query) {
      fetchUser(query);
    }
  };

  const fetchUser = async (searchFil) => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`

    if(searchFil){
      query += `${searchFil}`
    }

    const res = await callFetchListUser(query);

    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setpageSize(pagination.pageSize);
      setCurrent(1);
    }

    console.log(pagination, filters, sorter, extra)
  };
  const renderHeader = () => {
    return(
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <span>Table List Users</span>
        <span style={{display:'flex', gap:16}}>
          {/* <Button>export</Button> */}
          <Button icon={<PlusOutlined/>} onClick={()=>{setOpenAddUser(true)}} >Thêm User</Button>
          <Button icon={<ReloadOutlined />} onClick={()=>{}}  />
        </span>
        
      </div>
    )
  }

  const onUpdateUser = async (values) => {
    const { fullName, phone} = values;
    const id = dataView._id
    const avatar = dataView.avatar
    setLoading(true);
    console.log(id,fullName, phone)
    
    const res = await callUpdateUser(id, fullName, phone ,avatar);
    if(res && res.data) {
      message.success('Cập nhật thành công');
      await fetchUser();
      setOpen(false);
    }else{
      notification.error({
        message: 'có lỗi xảy ra',
        description: res.message,
      })
    }
    setLoading(false);
  }

  const onDeleteUser = async () => {
    const id = dataView._id
    console.log(id)
    setLoading(true);
    const res = await callDeleteUser(id);
    if(res && res.data) {
      message.success('Xoá thành công');
      await fetchUser();
      setOpen(false);
    }else{
      notification.error({
        message: 'có lỗi xảy ra',
        description: res.message,
      })
    }
    setLoading(false);
  }

  return (
    <div>
      <div>
        <Divider />
        <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
          <Form.Item name="fullName">
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item name="email">
            <Input type="text" placeholder="Email" />
          </Form.Item>

          <Form.Item name="phone">
            <Input type="text" placeholder="sdt" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Search
            </Button>
          </Form.Item>
        </Form>

        <Button style={{marginTop: 20}} type="default" onClick={() => fetchUser()} htmlType="submit">
          Clear
        </Button>
        <Divider />
      </div>
   
      <Table
        title={renderHeader}
        rowKey="_id"
        pagination={
          {current: current, pageSize: pageSize, 
            showSizeChanger: true, total: total, 
            showTotal: (total,range) => <div>{range[0]}-{[range[1]]} trên {total}</div>}
        }
        onChange={onChange}
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={listUser}
      />
      <Drawer title="Thông tin User" width={'50vw'} placement="right" onClose={()=>setOpen(false)} open={open}>
        <Descriptions  column={2} bordered>
          <Descriptions.Item label="Id">{dataView?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">{dataView?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{dataView?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{dataView?.phone}</Descriptions.Item>
          
          <Descriptions.Item label="Role" span={2}>
            <Badge status="processing" text={dataView?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="ngày tạo">{moment(dataView?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="ngày cập nhật">{moment(dataView?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Button type="primary" onClick={()=>onDeleteUser()} danger>Delete</Button>
        <Divider />
        <Form name="sửa" form={formUpdateUser} style={{maxWidth: 600, margin: '0 auto'}} 
        onFinish={onUpdateUser}
        autoComplete="off"
        >
          <Form.Item labelCol={{span: 24}} label="Tên hiển thị" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item labelCol={{span: 24}} label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{offset: 8, span: 16}}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập Nhật Thông Tin
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Thêm người dùng"
        open={openAddUser}
        // onOk={handleModalOk}
        onOk={()=>{form.submit()}}
        confirmLoading={loading}
        onCancel={()=>{setOpenAddUser(false)}}
        okText={'Thêm'}
        >
          <Form
        name="basic"
        form={form}
        // labelCol={{span: 6}}
        // wrapperCol={{span: 16}}
        style={{maxWidth: 600, margin: '0 auto'}}
        initialValues={{remember: true}}
        onFinish={onFinishModal}
        autoComplete="off"
      >
         <Divider />
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

          </Form>
      </Modal>
    </div>
  );
};

export default index;