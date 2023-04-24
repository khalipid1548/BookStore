import {PlusOutlined, ReloadOutlined, LoadingOutlined} from '@ant-design/icons';
import {
  Badge,
  Button,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  message,
  notification,
  Upload,
  Row,
  Select,
  Col,
} from 'antd';
import moment from 'moment/moment';
import React, {useEffect, useState} from 'react';
import {
  callFetchListBook,
  callCreateBook,
  callUpdateBook,
  callDeleteBook,
  callFetchCategory,
  callUploadBookImg,
} from '../../services/api-crud-book';
import {v4 as uuidv4} from 'uuid';

const index = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: 250,
      render: (text, record, index) => {
        return (
          <a
            href="#"
            onClick={() => {
              showDrawer(record);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: 'Tên sách',
      width: 333,
      dataIndex: 'mainText',
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
    },

    {
      title: 'Giá bán',
      dataIndex: 'price',
      render: (text) => <p>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(text ?? 0)}</p>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Đã bán',
      dataIndex: 'sold',
    },
    {
      title: 'action',
      dataIndex: 'action',
      render: (text, record, index) => {
        return (
          <Button
            onClick={() => {
              showModalUpdateBook(record);
            }}
            style={{cursor: 'pointer'}}
          >
            Edit
          </Button>
        );
      },
    },
  ];
  const [initForm, setInitForm] = useState(null);

  const [loading, setLoading] = useState(false);
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setpageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [dataView, setDataView] = useState('');
  const [formUpdateBook] = Form.useForm();
  const [formAddBook] = Form.useForm();
  const [openAddBook, setOpenAddBook] = useState(false);
  const [openUpdateBook, setOpenUpdateBook] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  //------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------

  const onClose = () => {
    setOpen(false);
    setDataView(null);
  };

  const onFinish = async (values) => {
    let query = '';

    if (values.mainText) {
      query += `&mainText=/${values.mainText}/i`;
    }
    if (values.author) {
      query += `&author=/${values.author}/i`;
    }
    if (values.category) {
      query += `&category=/${values.category}/i`;
    }
    if (query) {
      fetchBook(query);
    }
  };

  const fetchBook = async (searchFil) => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;

    if (searchFil) {
      query += `${searchFil}`;
    }

    const res = await callFetchListBook(query);

    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBook();
  }, [current, pageSize]);

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setpageSize(pagination.pageSize);
      setCurrent(1);
    }

    console.log(pagination, filters, sorter, extra);
  };

  const renderHeader = () => {
    return (
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span>Table List Book</span>
        <span style={{display: 'flex', gap: 16}}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenAddBook(true);
            }}
          >
            Thêm Book
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => {}} />
        </span>
      </div>
    );
  };

  const showDrawer = (info) => {
    setOpen(true);
    setDataView(info);
    console.log(info);
  };

  const onFinishModal = async (values) => {
    const {mainText, author, price, category, quantity, sold} = values;

    if (dataThumbnail.length === 0) {
      notification.error({
        message: 'có lỗi xảy ra',
        description: 'vui lòng up thumbnail',
      });
      return;
    }

    if (dataSlider.length === 0) {
      notification.error({
        message: 'có lỗi xảy ra',
        description: 'vui lòng up Slider',
      });
      return;
    }

    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);

    setLoading(true);
    const res = await callCreateBook(mainText, author, category, price, quantity, sold, thumbnail, slider);

    if (res && res.data) {
      message.success('Tạo Book thành công');
      formAddBook.resetFields();
      setOpenAddBook(false);
      setDataSlider([]);
      setDataThumbnail([]);
      await fetchBook();
    } else {
      notification.error({
        message: 'có lỗi xảy ra',
        description: res.message,
      });
    }
    setLoading(false);
  };

  //   const onUpdateBook = async (values) => {
  //     const {fullName, phone} = values;
  //     const id = dataView._id;
  //     const avatar = dataView.avatar;
  //     setLoading(true);
  //     console.log(id, fullName, phone);

  //     const res = await callUpdateBook(id, fullName, phone, avatar);
  //     if (res && res.data) {
  //       message.success('Cập nhật thành công');
  //       await fetchBook();
  //       setOpen(false);
  //     } else {
  //       notification.error({
  //         message: 'có lỗi xảy ra',
  //         description: res.message,
  //       });
  //     }
  //     setLoading(false);
  //   };

  const onDeleteBook = async () => {
    const id = dataView._id;
    console.log(id);
    setLoading(true);
    const res = await callDeleteBook(id);
    if (res && res.data) {
      message.success('Xoá thành công');
      await fetchBook();
      setOpen(false);
    } else {
      notification.error({
        message: 'có lỗi xảy ra',
        description: res.message,
      });
    }
    setLoading(false);
  };

  // -----------------------------------------------------------------------------------------

  useEffect(() => {
    if (dataView) {
      let imgThumb = {},
        imgSlider = [];

      if (dataView.thumbnail) {
        imgThumb = {
          uid: uuidv4(),
          name: dataView.thumbnail,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataView.thumbnail}`,
        };
      }
      if (dataView.slider && dataView.slider.length > 0) {
        dataView.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: 'done',
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumb, ...imgSlider]);
    }
  }, [dataView]);

  const handlePreview = async (file) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({fileList: newFileList}) => {
    setFileList(newFileList);
  };

  //------------------------------------------------------------------------------------

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callFetchCategory();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return {label: item, value: item};
        });
        setListCategory(d);
      }
    };
    fetchCategory();
  }, []);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChangeImgUpload = (info, type) => {
    if (info.file.status === 'uploading') {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUploadFileThumbnail = async ({file, onSuccess, onError}) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess('ok');
    } else {
      onError('Đã có lỗi khi upload file');
    }
  };

  const handleUploadFileSlider = async ({file, onSuccess, onError}) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      //copy previous state => upload multiple images
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess('ok');
    } else {
      onError('Đã có lỗi khi upload file');
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === 'thumbnail') {
      setDataThumbnail([]);
    }
    if (type === 'slider') {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };

  const handlePreviewUploading = async (file) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
      return;
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    });
  };

  //------------------------------------------------------------------------------------
  useEffect(() => {
    if (dataView?._id) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: dataView.thumbnail,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataView.thumbnail}`,
        },
      ];

      const arrSlider = dataView?.slider?.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });

      const init = {
        _id: dataView._id,
        mainText: dataView.mainText,
        author: dataView.author,
        price: dataView.price,
        category: dataView.category,
        quantity: dataView.quantity,
        sold: dataView.sold,
        thumbnail: {fileList: arrThumbnail},
        slider: {fileList: arrSlider},
      };
      setInitForm(init);
      setDataThumbnail(arrThumbnail);
      setDataSlider(arrSlider);
      formUpdateBook.setFieldsValue(init);
    }
    return () => {
      formUpdateBook.resetFields();
    };
  }, [dataView]);

  const showModalUpdateBook = (record) => {
    setDataView(record);
    setOpenUpdateBook(true);
    console.log(record);
  };

  const onFinishModalUpdate = async (values) => {
    const {_id, mainText, author, price, sold, quantity, category} = values;

    if (dataThumbnail.length === 0) {
      notification.error({
        message: 'lỗi validate',
        description: 'vui lòng up thumbnail',
      });
      return;
    }

    if (dataSlider.length === 0) {
      notification.error({
        message: 'lỗi validate',
        description: 'vui lòng up Slider',
      });
      return;
    }

    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);
    console.log(_id, thumbnail, slider, mainText, author, price, sold, quantity, category);
    setLoading(true);

    const res = await callUpdateBook(_id, thumbnail, slider, mainText, author, price, sold, quantity, category);

    if (res && res.data) {
      message.success('Update thành công');
      formUpdateBook.resetFields();
      setDataSlider([]);
      setDataThumbnail([]);
      setOpenUpdateBook(false);
      await fetchBook();
    } else {
      notification.error({
        message: 'đã có lỗi',
        description: res.message,
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <div>
        <Divider />
        <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
          <Form.Item name="mainText">
            <Input placeholder="Tên sách" />
          </Form.Item>

          <Form.Item name="author">
            <Input type="text" placeholder="Tác giả" />
          </Form.Item>

          <Form.Item name="category">
            <Input type="text" placeholder="thể loại" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Search
            </Button>
          </Form.Item>
        </Form>

        <Button style={{marginTop: 20}} type="default" onClick={() => fetchBook()} htmlType="submit">
          Clear
        </Button>
        <Divider />
      </div>
      <Table
        title={renderHeader}
        rowKey="_id"
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => (
            <div>
              {range[0]}-{[range[1]]} trên {total}
            </div>
          ),
        }}
        onChange={onChange}
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={listBook}
      />

      <Drawer title="Thông tin Sách" width={'50vw'} placement="right" onClose={onClose} open={open}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Id">{dataView?._id}</Descriptions.Item>
          <Descriptions.Item label="Tên sách">{dataView?.mainText}</Descriptions.Item>
          <Descriptions.Item label="Tác giả">{dataView?.author}</Descriptions.Item>
          <Descriptions.Item label="Giá bán">
            {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(dataView?.price ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng">{dataView?.quantity}</Descriptions.Item>
          <Descriptions.Item label="Đã bán">{dataView?.sold}</Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={2}>
            <Badge status="processing" text={dataView?.category} />
          </Descriptions.Item>
          <Descriptions.Item label="ngày tạo">
            {moment(dataView?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="ngày cập nhật">
            {moment(dataView?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Button type="primary" onClick={() => onDeleteBook()} danger>
          Delete
        </Button>
        <Divider />
        {/* <Form
          name="sửa"
          form={formUpdateBook}
          style={{maxWidth: 600, margin: '0 auto'}}
          onFinish={onUpdateBook}
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
        </Form> */}
        <Divider orientation="left"> Ảnh Books </Divider>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{showRemoveIcon: false}}
        />
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
          <img alt="example" style={{width: '100%'}} src={previewImage} />
        </Modal>
      </Drawer>
      {/* -------------------------------Modal Thêm------------------------------------------- */}
      <Modal
        title="Thêm sách"
        open={openAddBook}
        onOk={() => {
          formAddBook.submit();
        }}
        confirmLoading={loading}
        onCancel={() => {
          setOpenAddBook(false);
          formAddBook.resetFields();
          setInitForm(null);
          setDataView(null);
        }}
        okText={'Thêm'}
        width={'50vw'}
        maskClosable={false}
      >
        <Form form={formAddBook} name="basic" onFinish={onFinishModal} autoComplete="off">
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                labelCol={{span: 24}}
                label="Tên sách"
                name="mainText"
                rules={[{required: true, message: 'Vui lòng nhập tên hiển thị!'}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{span: 24}}
                label="Tác giả"
                name="author"
                rules={[{required: true, message: 'Vui lòng nhập tác giả!'}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{span: 24}}
                label="Giá tiền"
                name="price"
                rules={[{required: true, message: 'Vui lòng nhập giá tiền!'}]}
              >
                <InputNumber
                  min={0}
                  style={{width: '100%'}}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{span: 24}}
                label="Thể loại"
                name="category"
                rules={[{required: true, message: 'Vui lòng chọn thể loại!'}]}
              >
                <Select defaultValue={null} showSearch allowClear options={listCategory} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{span: 24}}
                label="Số lượng"
                name="quantity"
                rules={[{required: true, message: 'Vui lòng nhập số lượng!'}]}
              >
                <InputNumber min={1} style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{span: 24}}
                label="Đã bán"
                name="sold"
                rules={[{required: true, message: 'Vui lòng nhập số lượng đã bán!'}]}
                initialValue={0}
              >
                <InputNumber min={0} defaultValue={0} style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 24}} label="Ảnh Thumbnail" name="thumbnail">
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChangeImgUpload}
                  onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                  onPreview={handlePreviewUploading}
                  //   defaultFileList={initForm?.thumbnail?.fileList ?? []}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{marginTop: 8}}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 24}} label="Ảnh Slider" name="slider">
                <Upload
                  multiple
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChangeImgUpload(info, 'slider')}
                  onRemove={(file) => handleRemoveFile(file, 'slider')}
                  onPreview={handlePreviewUploading}
                  //   defaultFileList={initForm?.slider?.fileList ?? []}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{marginTop: 8}}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* ------------------------------Modal update------------------------------------------- */}
      <Modal
        title="Update sách"
        open={openUpdateBook}
        onOk={() => {
          formUpdateBook.submit();
        }}
        confirmLoading={loading}
        onCancel={() => {
          setOpenUpdateBook(false);
          formUpdateBook.resetFields();
          setInitForm(null);
          setDataView(null);
        }}
        okText={'Update'}
        width={'50vw'}
        maskClosable={false}
      >
        <Form form={formUpdateBook} name="basic" onFinish={onFinishModalUpdate} autoComplete="off">
          <Row gutter={15}>
            <Col hidden>
              <Form.Item labelCol={{span: 24}} label="id" name="_id">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{span: 24}}
                label="Tên sách"
                name="mainText"
                rules={[{required: true, message: 'Vui lòng nhập tên hiển thị!'}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{span: 24}}
                label="Tác giả"
                name="author"
                rules={[{required: true, message: 'Vui lòng nhập tác giả!'}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{span: 24}}
                label="Giá tiền"
                name="price"
                rules={[{required: true, message: 'Vui lòng nhập giá tiền!'}]}
              >
                <InputNumber
                  min={0}
                  style={{width: '100%'}}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{span: 24}}
                label="Thể loại"
                name="category"
                rules={[{required: true, message: 'Vui lòng chọn thể loại!'}]}
              >
                <Select defaultValue={null} showSearch allowClear options={listCategory} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{span: 24}}
                label="Số lượng"
                name="quantity"
                rules={[{required: true, message: 'Vui lòng nhập số lượng!'}]}
              >
                <InputNumber min={1} style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{span: 24}}
                label="Đã bán"
                name="sold"
                rules={[{required: true, message: 'Vui lòng nhập số lượng đã bán!'}]}
                initialValue={0}
              >
                <InputNumber min={0} defaultValue={0} style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 24}} label="Ảnh Thumbnail" name="thumbnail">
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChangeImgUpload}
                  onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                  onPreview={handlePreviewUploading}
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{marginTop: 8}}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{span: 24}} label="Ảnh Slider" name="slider">
                <Upload
                  multiple
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChangeImgUpload(info, 'slider')}
                  onRemove={(file) => handleRemoveFile(file, 'slider')}
                  onPreview={handlePreviewUploading}
                  defaultFileList={initForm?.slider?.fileList ?? []}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{marginTop: 8}}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default index;
