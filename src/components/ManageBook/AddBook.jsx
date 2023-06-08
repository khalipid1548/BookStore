import {LoadingOutlined, PlusOutlined} from '@ant-design/icons'
import {Col, Form, Input, InputNumber, Modal, Row, Select, Upload, message, notification} from 'antd'
import React, {useEffect, useState} from 'react'
import {callCreateBook, callFetchCategory, callUploadBookImg} from '../../services/api-crud-book'

const AddBook = ({openAddBook, setOpenAddBook,fetchBook}) => {
	const [loadingSlider, setLoadingSlider] = useState(false)
	const [loading, setLoading] = useState(false)
	const [formAddBook] = Form.useForm()
	const [listCategory, setListCategory] = useState([])
	const [dataThumbnail, setDataThumbnail] = useState([])
	const [dataSlider, setDataSlider] = useState([])
	const [imageUrl, setImageUrl] = useState('')
	
	const [previewOpen, setPreviewOpen] = useState(false)
	const [previewImage, setPreviewImage] = useState('')
	
	const getBase64 = (img, callback) => {
		const reader = new FileReader()
		reader.addEventListener('load', () => callback(reader.result))
		reader.readAsDataURL(img)
	}

	const onFinishModal = async (values) => {
		const {mainText, author, price, category, quantity, sold} = values

		if (dataThumbnail.length === 0) {
			notification.error({
				message: 'có lỗi xảy ra',
				description: 'vui lòng up thumbnail',
			})
			return
		}

		if (dataSlider.length === 0) {
			notification.error({
				message: 'có lỗi xảy ra',
				description: 'vui lòng up Slider',
			})
			return
		}

		const thumbnail = dataThumbnail[0].name
		const slider = dataSlider.map((item) => item.name)

		setLoading(true)
		const res = await callCreateBook(
			mainText,
			author,
			category,
			price,
			quantity,
			sold,
			thumbnail,
			slider
		)

		if (res && res.data) {
			message.success('Tạo Book thành công')
			formAddBook.resetFields()
			setOpenAddBook(false)
			setDataSlider([])
			setDataThumbnail([])
			await fetchBook()
		} else {
			notification.error({
				message: 'có lỗi xảy ra',
				description: res.message,
			})
		}
		setLoading(false)
	}

	useEffect(() => {
		const fetchCategory = async () => {
			const res = await callFetchCategory()
			if (res && res.data) {
				const d = res.data.map((item) => {
					return {label: item, value: item}
				})
				setListCategory(d)
			}
		}
		fetchCategory()
	}, [listCategory])

	const beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!')
		}
		const isLt2M = file.size / 1024 / 1024 < 2
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!')
		}
		return isJpgOrPng && isLt2M
	}

	const handleChangeImgUpload = (info, type) => {
		if (info.file.status === 'uploading') {
			type ? setLoadingSlider(true) : setLoading(true)
			return
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, (url) => {
				type ? setLoadingSlider(false) : setLoading(false)
				setImageUrl(url)
			})
		}
	}

	const handleUploadFileThumbnail = async ({file, onSuccess, onError}) => {
		const res = await callUploadBookImg(file)
		if (res && res.data) {
			setDataThumbnail([
				{
					name: res.data.fileUploaded,
					uid: file.uid,
				},
			])
			onSuccess('ok')
		} else {
			onError('Đã có lỗi khi upload file Thumbnail')
		}
	}

	const handleUploadFileSlider = async ({file, onSuccess, onError}) => {
		const res = await callUploadBookImg(file)
		if (res && res.data) {
			//copy previous state => upload multiple images
			setDataSlider((dataSlider) => [
				...dataSlider,
				{
					name: res.data.fileUploaded,
					uid: file.uid,
				},
			])
			onSuccess('ok')
		} else {
			onError('Đã có lỗi khi upload file Slider')
		}
	}

	const handleRemoveFile = (file, type) => {
		if (type === 'thumbnail') {
			setDataThumbnail([])
		}
		if (type === 'slider') {
			const newSlider = dataSlider.filter((x) => x.uid !== file.uid)
			setDataSlider(newSlider)
		}
	}

	const handlePreviewUploading = async (file) => {
		if (file.url && !file.originFileObj) {
			setPreviewImage(file.url)
			setPreviewOpen(true)
			
			return
		}
		getBase64(file.originFileObj, (url) => {
			setPreviewImage(url)
			setPreviewOpen(true)
			
		})
	}

	return (
		<Modal
			title='Thêm sách'
			open={openAddBook}
			onOk={() => {
				formAddBook.submit()
			}}
			confirmLoading={loading}
			onCancel={() => {
				setOpenAddBook(false)
				formAddBook.resetFields()
			}}
			okText={'Thêm'}
			width={'50vw'}
			maskClosable={false}>
			<Form form={formAddBook} name='basic' onFinish={onFinishModal} autoComplete='off'>
				<Row gutter={15}>
					<Col span={12}>
						<Form.Item
							labelCol={{span: 24}}
							label='Tên sách'
							name='mainText'
							rules={[{required: true, message: 'Vui lòng nhập tên hiển thị!'}]}>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							labelCol={{span: 24}}
							label='Tác giả'
							name='author'
							rules={[{required: true, message: 'Vui lòng nhập tác giả!'}]}>
							<Input />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item
							labelCol={{span: 24}}
							label='Giá tiền'
							name='price'
							rules={[{required: true, message: 'Vui lòng nhập giá tiền!'}]}>
							<InputNumber
								min={0}
								style={{width: '100%'}}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								addonAfter='VND'
							/>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item
							labelCol={{span: 24}}
							label='Thể loại'
							name='category'
							rules={[{required: true, message: 'Vui lòng chọn thể loại!'}]}>
							<Select defaultValue={null} showSearch allowClear options={listCategory} />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item
							labelCol={{span: 24}}
							label='Số lượng'
							name='quantity'
							rules={[{required: true, message: 'Vui lòng nhập số lượng!'}]}>
							<InputNumber min={1} style={{width: '100%'}} />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item
							labelCol={{span: 24}}
							label='Đã bán'
							name='sold'
							rules={[{required: true, message: 'Vui lòng nhập số lượng đã bán!'}]}
							initialValue={0}>
							<InputNumber min={0} defaultValue={0} style={{width: '100%'}} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item labelCol={{span: 24}} label='Ảnh Thumbnail' name='thumbnail'>
							<Upload
								name='thumbnail'
								listType='picture-card'
								className='avatar-uploader'
								maxCount={1}
								multiple={false}
								customRequest={handleUploadFileThumbnail}
								beforeUpload={beforeUpload}
								onChange={handleChangeImgUpload}
								onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
								onPreview={handlePreviewUploading}>
								<div>
									{loading ? <LoadingOutlined /> : <PlusOutlined />}
									<div style={{marginTop: 8}}>Upload</div>
								</div>
							</Upload>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item labelCol={{span: 24}} label='Ảnh Slider' name='slider'>
							<Upload
								multiple
								name='slider'
								listType='picture-card'
								className='avatar-uploader'
								customRequest={handleUploadFileSlider}
								beforeUpload={beforeUpload}
								onChange={(info) => handleChangeImgUpload(info, 'slider')}
								onRemove={(file) => handleRemoveFile(file, 'slider')}
								onPreview={handlePreviewUploading}>
								<div>
									{loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
									<div style={{marginTop: 8}}>Upload</div>
								</div>
							</Upload>
						</Form.Item>
					</Col>
				</Row>
			</Form>
            <Modal
				open={previewOpen}
				footer={null}
				onCancel={() => setPreviewOpen(false)}>
				<img alt='example' style={{width: '100%'}} src={previewImage} />
			</Modal>
		</Modal>
	)
}

export default AddBook