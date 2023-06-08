import {Button, Divider, Form, Input} from 'antd'

const SearchTerm = ({loading, onFinish, fetchUser}) => {
	const [form] = Form.useForm()

	const handleClick = async () => {
		form.resetFields()
		await fetchUser()
	}

	return (
		<div style={{marginTop: 30}}>
			<Form
				form={form}
				name='horizontal_login'
				layout='inline'
				onFinish={onFinish}
				style={{width: '100%'}}>
				<Form.Item name='fullName'>
					<Input placeholder='Name' />
				</Form.Item>

				<Form.Item name='email'>
					<Input type='text' placeholder='Email' />
				</Form.Item>

				<Form.Item name='phone'>
					<Input type='text' placeholder='Số Điện thoại' />
				</Form.Item>

				<Form.Item>
					<Button type='primary' htmlType='submit' loading={loading}>
						Search
					</Button>
					<Button style={{marginLeft: 10}} type='default' onClick={handleClick}>
						Clear
					</Button>
				</Form.Item>
			</Form>

			<Divider />
		</div>
	)
}

export default SearchTerm
