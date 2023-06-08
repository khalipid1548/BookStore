import {Divider, Form, Input, Modal, message, notification} from 'antd'
import { callCreateUser } from '../../services/api-crud-user'

const AddUser = ({open, onClose, loading,setLoading,setOpenAddUser}) => {
	const [form] = Form.useForm()

	const onFinishModal = async (values) => {
		const {fullName, email, password, phone} = values
		setLoading(true)

		const res = await callCreateUser(fullName, email, password, phone)
		setLoading(false)

		if (res?.data?._id) {
			message.success('Tạo user thành công')
			form.resetFields()
			setOpenAddUser(false)
		} else {
			notification.error({
				message: 'có lỗi xảy ra',
				description: res.message,
			})
		}
	}
	return (
		<Modal
			title='Thêm người dùng'
			open={open}
			onOk={() => {
				form.submit()
			}}
			confirmLoading={loading}
			onCancel={onClose}
			okText={'Thêm'}>
			<Form
				name='basic'
				form={form}
				style={{maxWidth: 600, margin: '0 auto'}}
				initialValues={{remember: true}}
				onFinish={onFinishModal}
				autoComplete='off'>
				<Divider />
				<Form.Item
					labelCol={{span: 24}}
					label='Full name'
					name='fullName'
					rules={[{required: true, message: 'Please input your username!'}]}>
					<Input />
				</Form.Item>

				<Form.Item
					labelCol={{span: 24}}
					label='Email'
					name='email'
					rules={[{required: true, message: 'Please input your email!', type: 'email'}]}>
					<Input />
				</Form.Item>

				<Form.Item
					labelCol={{span: 24}}
					label='Password'
					name='password'
					rules={[{required: true, message: 'Please input your password!'}]}>
					<Input.Password />
				</Form.Item>

				<Form.Item
					labelCol={{span: 24}}
					label='Phone'
					name='phone'
					rules={[{required: true, message: 'Please input your phone!'}]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default AddUser
