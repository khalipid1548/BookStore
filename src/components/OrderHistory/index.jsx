
import {Badge, Button, Descriptions, Divider, Drawer, Form, Input, Modal, Table, message, notification,Tag} from 'antd';
import moment from 'moment/moment';
import React, {useEffect, useState} from 'react';
import {callHistoryOrder} from '../../services/api-order';

function OrderHistory() {
  const [listOrder, setListOrder] = useState([]);
  const columns = [
    {
      title: 'Người đặt hàng',
      dataIndex: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      width: 250,
      render: (text, record, index) => {
        return (
            <>{moment(text).format('DD-MM-YYYY HH:mm:ss')}</>
        );
      },
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalPrice',
      render: (text, record, index) => {
        return (
            <>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(text)}</>
        );
      },
    },
    {
      title: 'Trạng thái',
    //   dataIndex: 'detail',
      render: (text, record, index) => {
        return (
            <Tag color="green">Thành Công</Tag>
        );
      },
    },
  ];

  const fetchOder = async (searchFil) => {
    const res = await callHistoryOrder();

    if (res && res.data) {
      console.log(res.data.result);
      setListOrder(res.data.result);
    }
  };

  useEffect(() => {
    fetchOder();
  }, []);

  return (
    <div style={{maxWidth: 1200, textAlign: 'center', margin: '0 auto'}}>
      <Table
        pagination={false}
        rowKey="_id"
        // onChange={onChange}
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={listOrder}
      />
    </div>
  );
}

export default OrderHistory;
