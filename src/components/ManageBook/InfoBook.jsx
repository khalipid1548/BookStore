import {Badge, Button, Descriptions, Divider, Drawer, Modal, Upload} from 'antd'
import moment from 'moment/moment'
import {useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid'
const InfoBook = ({openInfoBook, dataView, onClose}) => {
	const [previewOpen, setPreviewOpen] = useState(false)
	const [previewImage, setPreviewImage] = useState('')
	// const [previewTitle, setPreviewTitle] = useState('')
	const [fileList, setFileList] = useState([])

	const handlePreview = async (file) => {
		
		setPreviewImage(file.url)
		setPreviewOpen(true)
		// setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
	}

	const handleChange = ({fileList: newFileList}) => {
		setFileList(newFileList)
	}

	useEffect(() => {
		if (dataView) {
			let imgThumb = {}, imgSlider = []

			if (dataView.thumbnail) {
				imgThumb = {
					uid: uuidv4(),
					name: dataView.thumbnail,
					status: 'done',
					url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataView.thumbnail}`,
				}
			}
			if (dataView.slider && dataView.slider.length > 0) {
				dataView.slider.map((item) => {
					imgSlider.push({
						uid: uuidv4(),
						name: item,
						status: 'done',
						url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
					})
				})
			}
			setFileList([imgThumb, ...imgSlider])
		}
	}, [dataView])

	

	return (
		<Drawer
			title='Thông tin Sách'
			width={'50vw'}
			placement='right'
			onClose={onClose}
			open={openInfoBook}>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='Id'>{dataView?._id}</Descriptions.Item>
				<Descriptions.Item label='Tên sách'>{dataView?.mainText}</Descriptions.Item>
				<Descriptions.Item label='Tác giả'>{dataView?.author}</Descriptions.Item>
				<Descriptions.Item label='Giá bán'>
					{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
						dataView?.price ?? 0
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Số lượng'>{dataView?.quantity}</Descriptions.Item>
				<Descriptions.Item label='Đã bán'>{dataView?.sold}</Descriptions.Item>
				<Descriptions.Item label='Thể loại' span={2}>
					<Badge status='processing' text={dataView?.category} />
				</Descriptions.Item>
				<Descriptions.Item label='ngày tạo'>
					{moment(dataView?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
				</Descriptions.Item>
				<Descriptions.Item label='ngày cập nhật'>
					{moment(dataView?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
				</Descriptions.Item>
			</Descriptions>

			<Divider />

			<Divider orientation='left'> Ảnh Books </Divider>
			<Upload
				action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
				listType='picture-card'
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChange}
				showUploadList={{showRemoveIcon: false}}
			/>
			<Modal
				open={previewOpen}
				// title={previewTitle}
				footer={null}
				onCancel={() => setPreviewOpen(false)}>
				<img alt='example' style={{width: '100%'}} src={previewImage} />
			</Modal>
		</Drawer>
	)
}

export default InfoBook
