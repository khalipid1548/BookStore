import {Divider, InputNumber, Steps, Button, Form, Input, Empty, Result, message, notification} from 'antd';
import './order.scss';
import {useDispatch, useSelector} from 'react-redux';
import {DeleteOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {doUpdateCartAction, doDeleteItemCartAction, doPlaceOrderAction} from '../../redux/order/orderSlice';
import {useEffect, useState} from 'react';
import {callPlaceOrder} from '../../services/api-order';

function Order(props) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const carts = useSelector((state) => state.order.carts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const items = [
    {
      title: 'Đơn Hàng',
    },
    {
      title: 'Check Out',
    },
    {
      title: 'Thanh Toán',
    },
  ];

  const handleChangeInput = (value, book) => {
    console.log('changed', value, book);
    dispatch(doUpdateCartAction({quantity: value, detail: book, _id: book._id}));
  };

  useEffect(() => {
    if (carts) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const onFinish = async (values) => {
    console.log('Success:', values);
    setIsSubmit(true);
    const detailOrder = carts.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });

    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detailOrder,
    };

    const res = await callPlaceOrder(data);
	if(res && res.data){
		message.success('Đặt hàng thành công')
		dispatch(doPlaceOrderAction())
		setCurrentStep(2)
		
	}else{
		notification.error({
			message:'Có lỗi xảy ra',
			description:res.message
		})
	}
	setIsSubmit(false);
	
  };

  return (
    <div style={{backgroundColor: '#f5f5f5', paddingTop: 24}}>
      <div className="container__step">
        <Steps size="small" current={currentStep} items={items} />
      </div>
      <div className="container">
          {currentStep === 0 && (
            <>
              <div className="col-left">
			 
                {carts?.map((book) => (
                  <div key={`book-${book?.detail._id}`}>
                    <div className="item">
                      <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />

                      <div className="name">{book?.detail?.mainText}</div>

                      <div className="price">
                        {' '}
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
                          book?.detail?.price ?? 0
                        )}
                      </div>

                      <InputNumber defaultValue={book?.quantity} min={1} onChange={(value) => handleChangeInput(value, book)} />

                      <div className="total">
                        Tổng:{' '}
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
                          book?.detail?.price * book?.quantity
                        )}
                      </div>

                      <div className="delete" onClick={() => dispatch(doDeleteItemCartAction({_id: book._id}))}>
                        <DeleteOutlined />
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))}
				 {carts.length ===0 && <Empty className='col-left' /> }
              </div>

              <div className="col-right">
                <div>Tạm tính</div>
                <Divider />
                <div>
                  Tổng tiền{' '}
                  {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalPrice || 0)}
                </div>
                <Divider />

                <Button onClick={() => next()} disabled={isSubmit} className="pop-cart-footer" type="text">
                  Đặt Hàng
                </Button>
              </div>
            </>
          )}
          {currentStep === 1 && carts.length !==0 && (
            <>
              <div className="col-left">
                {carts?.map((book) => (
                  <div key={`book-${book?.detail._id}`}>
                    <div className="item">
                      <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />

                      <div className="name">{book?.detail?.mainText}</div>

                      <div className="price">
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
                          book?.detail?.price ?? 0
                        )}
                      </div>

                      {/* <InputNumber min={1} onChange={(value) => handleChangeInput(value, book)} /> */}
                      <div className="total">Số lượng: {book?.quantity}</div>

                      <div className="total">
                        Tổng:{' '}
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
                          book?.detail?.price * book?.quantity
                        )}
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))}
              </div>

              <div className="col-right" style={{height: 'auto'}}>
                <Form
                  form={form}
                  name="basic"
                  labelCol={{span: 24}}
                  wrapperCol={{span: 24}}
                  initialValues={{remember: true}}
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item label="Tên người nhận" name="name" rules={[{required: true, message: 'Tên người nhận'}]}>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{required: true, message: 'Sô điện thoại người nhận'}]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="Địa chỉ" name="address" rules={[{required: true, message: 'Địa chỉ nhận hàng'}]}>
                    <Input />
                  </Form.Item>
                  <Divider />
                  <div>
                    Tổng tiền{' '}
                    {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalPrice || 0)}
                  </div>
                  <Divider />
                  <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button disabled={isSubmit} className="pop-cart-footer" type="text" htmlType="submit">
                      Thanh toán
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <Result
              status="success"
              title="Đơn hàng được đặt thành công"
              extra={[
               
                <Button key="home" onClick={() => navigate('/')}>
                  Trang chủ
                </Button>,
              ]}
            />
          )}
		 
        </div>
		
    </div>
  );
}

export default Order;
