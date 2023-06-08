import {Badge, Button, Descriptions, Divider, Drawer, Form, Input} from 'antd'
import moment from 'moment/moment'
const InfoUser = ({onOpen, dataView, onClose, handleDeleteUser}) => {
	return (
		<Drawer title='Thông tin User' width={'50vw'} placement='right' onClose={onClose} open={onOpen}>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='Id'>{dataView?._id}</Descriptions.Item>
				<Descriptions.Item label='Tên hiển thị'>{dataView?.fullName}</Descriptions.Item>
				<Descriptions.Item label='Email'>{dataView?.email}</Descriptions.Item>
				<Descriptions.Item label='Phone'>{dataView?.phone}</Descriptions.Item>

				<Descriptions.Item label='Role' span={2}>
					<Badge status='processing' text={dataView?.role} />
				</Descriptions.Item>
				<Descriptions.Item label='ngày tạo'>
					{moment(dataView?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
				</Descriptions.Item>
				<Descriptions.Item label='ngày cập nhật'>
					{moment(dataView?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
				</Descriptions.Item>
			</Descriptions>
			<Divider />
			<Button
				type='primary'
				onClick={() => {
					handleDeleteUser(dataView._id)
					onClose()
				}}
				danger>
				Delete
			</Button>
		</Drawer>
	)
}

export default InfoUser
