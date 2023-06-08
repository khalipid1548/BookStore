import {Button, Divider, Form, Input} from 'antd'

const SearchTerm = ({loading, onFinish, fetchBook}) => {
	const [form] = Form.useForm()

	const handleClick = async () => {
		form.resetFields()
		await fetchBook()
	}

	return (
		<div style={{marginTop: 30}}>
			<Form form={form} name='horizontal_login' layout='inline' onFinish={onFinish}>
				<Form.Item name='mainText'>
					<Input placeholder='Tên sách' />
				</Form.Item>

				<Form.Item name='author'>
					<Input type='text' placeholder='Tác giả' />
				</Form.Item>

				<Form.Item name='category'>
					<Input type='text' placeholder='thể loại' />
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
