import { Divider, Form, Input, Modal, message, notification} from 'antd'
import {callUpdateUser} from '../../services/api-crud-user'
import {useEffect} from 'react'

const EditUser = ({openEditUser, dataView, loading, setLoading, onClose,fetchUser}) => {
	const [form] = Form.useForm()

	const onFinishModal = async (values) => {
        const {_id, fullName, phone} = values
        const avatar = dataView.avatar

        const res = await callUpdateUser(_id, fullName, phone, avatar)
        if (res.data) {
            message.success('Cập nhật thành công')
            onClose()
            await fetchUser()
        }else{
            message.error('Cập nhật thất bại')
            notification.error('Cập nhật thất bại')
        }
    }

	useEffect(() => {
		form.setFieldsValue(dataView)
	}, [dataView])

    

	return (
		<Modal
			title='Chỉnh sửa người dùng'
			open={openEditUser}
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
                    hidden
					labelCol={{span: 24}}
					label='id'
					name='_id'
					rules={[{required: true}]}>
					<Input />
				</Form.Item>

				<Form.Item
					labelCol={{span: 24}}
					label='Full name'
					name='fullName'
					rules={[{required: true}]}>
					<Input />
				</Form.Item>

				<Form.Item
					labelCol={{span: 24}}
					label='Email'
					name='email'
					rules={[{required: true, message: 'Please input your email!', type: 'email'}]}>
					<Input disabled />
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

export default EditUser
