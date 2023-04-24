import {Card, Col, Row, Statistic} from 'antd';
import {useEffect, useState} from 'react';
import {callFetchdashboard} from '../../services/api-crud-user';

const index = () => {
  const [user, setUser] = useState(0);
  const [order, setOrder] = useState(0);

  const Fetchdashboard = async () => {
    const res = await callFetchdashboard();
    if (res && res.data) {
      setOrder(res.data.countOrder);
      setUser(res.data.countUser);
    }
  };

  useEffect(() => {
    Fetchdashboard();
  }, []);

  return (
    <Row gutter={16} style={{marginTop: 36, alignContent: 'center'}}>
      <Col span={10}>
        <Card bordered={false}>
          <Statistic title="Tổng số người dùng" value={user} precision={2} valueStyle={{color: '#3f8600'}} />
        </Card>
      </Col>
      <Col span={10}>
        <Card bordered={false}>
          <Statistic title="Tổng đơn hàng" value={order} precision={2} valueStyle={{color: '#cf1322'}} />
        </Card>
      </Col>
    </Row>
  );
};

export default index;
