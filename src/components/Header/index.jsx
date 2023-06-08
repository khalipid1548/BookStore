import {
    Avatar,
    Badge,
    Button,
    Divider,
    Drawer,
    Dropdown,
    Form,
    Input,
    Modal,
    Popover,
    Space,
    Tabs,
    message,
    notification,
} from 'antd'
import React, { useState } from 'react'
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi'
import { VscSearchFuzzy } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { doLogoutAction, doUpdateUserInfoAction } from '../../redux/account/accountSlice'
import { callLogout, callUpdatePass } from '../../services/api-auth'
import { callUpdateUser } from '../../services/api-crud-user'
import './header.scss'

function index(props) {
	const [openDrawer, setOpenDrawer] = useState(false)
	const [openModal, setOpenModal] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const isAuthenticated = useSelector((state) => state.account.isAuthenticated)
	const user = useSelector((state) => state.account.user)
	const carts = useSelector((state) => state.order.carts)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const [formPassword] = Form.useForm()

	const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

	const handleLogout = async () => {
		const res = await callLogout()
		if (res && res.data) {
			dispatch(doLogoutAction())
			message.success('Đăng xuất thành công')
			navigate('/')
		}
	}

	let items = [
		{
			label: <Link to='/history'>Lịch sử mua hàng</Link>,
			key: 'history',
		},
		{
			label: (
				<label style={{cursor: 'pointer'}} onClick={() => setOpenModal(true)}>
					Quản lý tài khoản
				</label>
			),
			key: 'account',
		},
		{
			label: (
				<label style={{cursor: 'pointer'}} onClick={() => handleLogout()}>
					Đăng xuất
				</label>
			),
			key: 'logout',
		},
	]

	if (user?.role === 'ADMIN') {
		items.unshift({
			label: <Link to='/admin'>Trang Quản trị</Link>,
			key: 'admin',
		})
	}

	const contentPopover = () => (
		<div className='pop-cart-body'>
			<div className='pop-cart-content'>
				{carts?.map((book, index) => (
					<div className='book' key={`book-${index}`}>
						<img
							src={`${import.meta.env.VITE_BACKEND_URL}/images/book/
							${book?.detail?.thumbnail}`}
						/>
						<div>{book?.detail?.mainText}</div>
						<div className='price'>
							{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
								book?.detail?.price ?? 0
							)}
						</div>
					</div>
				))}
			</div>
			{carts.length !== 0 && (
				<div className='pop-cart-footer'>
					<button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
				</div>
			)}
		</div>
	)

	function handleInputChange(event) {
		props.setSearchTerm(event.target.value)
	}

	const onFinishForm = async (values) => {
		console.log('Success:', values)
		const {_id, fullName, phone, avatar} = values
		const res = await callUpdateUser(_id, fullName, phone, avatar)
		if (res && res.data) {
			dispatch(doUpdateUserInfoAction({fullName, phone}))
			message.success('Cập nhật thành công')
			setOpenModal(false)
		} else {
			notification.error({
				message: 'có lỗi xảy ra',
				description: res.message,
			})
		}
	}

	const onFinishFormResetPass = async (values) => {
		console.log('Success:', values)
		const {email, oldpass, newpass} = values
		const res = await callUpdatePass(email, oldpass, newpass)
		if (res && res.data) {
			message.success('Cập nhật mật khẩu thành công')
			formPassword.setFieldValue('oldpass', '')
			formPassword.setFieldValue('newpass', '')
		} else {
			notification.error({
				message: 'có lỗi xảy ra',
				description: res.message,
			})
		}
	}

	const initialValuesForm = {
		_id: user.id,
		email: user.email,
		fullName: user.fullName,
		phone: user.phone,
		avatar: user.avatar,
	}

	const itemsTab = [
		{
			key: '1',
			label: `Cập nhật thông tin`,
			children: (
				<>
					<Form
						form={form}
						initialValues={initialValuesForm}
						name='basic'
						labelCol={{span: 24}}
						wrapperCol={{span: 24}}
						style={{maxWidth: 600}}
						// initialValues={{remember: true}}
						onFinish={onFinishForm}
						autoComplete='off'>
						<Form.Item hidden name='_id'>
							<Input disabled />
						</Form.Item>

						<Form.Item label='Email' name='email'>
							<Input disabled />
						</Form.Item>

						<Form.Item
							label='Tên hiển thị'
							name='fullName'
							rules={[{required: true, message: 'Please input your tên!'}]}>
							<Input />
						</Form.Item>

						<Form.Item
							label='Số điên thoại'
							name='phone'
							rules={[{required: true, message: 'Please input your tên!'}]}>
							<Input />
						</Form.Item>
						<Form.Item hidden name='avatar'>
							<Input disabled />
						</Form.Item>
						<Form.Item>
							<Button type='primary' htmlType='submit'>
								Update
							</Button>
						</Form.Item>
					</Form>
				</>
			),
		},
		{
			key: '2',
			label: `Đổi mật khẩu`,
			children: (
				<>
					<Form
						form={formPassword}
						initialValues={initialValuesForm}
						name='reset'
						labelCol={{span: 24}}
						wrapperCol={{span: 24}}
						style={{maxWidth: 600}}
						// initialValues={{remember: true}}
						onFinish={onFinishFormResetPass}
						autoComplete='off'>
						<Form.Item label='Email' name='email'>
							<Input disabled />
						</Form.Item>

						<Form.Item
							label='Mật khẩu cũ'
							name='oldpass'
							rules={[{required: true, message: 'Please input your Mật khẩu cũ!'}]}>
							<Input.Password />
						</Form.Item>

						<Form.Item
							label='Mật khẩu mới'
							name='newpass'
							rules={[{required: true, message: 'Please input your Mật khẩu mới!'}]}>
							<Input.Password />
						</Form.Item>

						<Form.Item>
							<Button type='primary' htmlType='submit'>
								Đổi mật khẩu
							</Button>
						</Form.Item>
					</Form>
				</>
			),
		},
	]

	return (
		<div className='header-container'>
			<header className='page-header' style={{justifyContent: 'center'}}>
				<div className='page-header__top'>
					<div className='page-header__toggle' onClick={() => setOpenDrawer(true)}>
						=
					</div>
					<div className='page-header__logo'>
						<span className='logo' onClick={() => navigate('/')}>
							<FaReact className='rotate icon-react' />
							ABC DEF
							<VscSearchFuzzy className='icon-search' />
						</span>
						<input
							className='input-search'
							value={props.searchTerm}
							onChange={handleInputChange}
							type='text'
							placeholder='bạn tìm gì?'
						/>
					</div>
				</div>
				<nav className='page-header__bottom'>
					<ul id='navigation' className='navigation'>
						<li className='navigation__item'>
							<Popover
								content={contentPopover}
								placement='bottomRight'
								className='popover-carts'
								rootClassName='popover-carts'
								arrow={true}
								title={'Giỏ hàng'}>
								<Badge count={carts?.length ?? 0} size='small' showZero>
									<FiShoppingCart className='icon-cart' />
								</Badge>
							</Popover>
						</li>
						<li className='navigation__item mobile'>
							<Divider type='vertical' />
						</li>
						<li className='navigation__item mobile'>
							{isAuthenticated ? (
								<Dropdown menu={{items}} trigger={['click']}>
									<a onClick={(e) => e.preventDefault()}>
										<Space>
											<Avatar src={urlAvatar} />
											{user?.fullName}
										</Space>
										{/* <DownOutlined /> */}
									</a>
								</Dropdown>
							) : (
								<span onClick={() => navigate('/login')}>Tài khoản</span>
							)}
						</li>
					</ul>
				</nav>
			</header>
			<Drawer
				title='menu chức năng'
				placement='left'
				open={openDrawer}
				onClose={() => setOpenDrawer(false)}>
				<p>Quản lý tài khoản</p>
				<Divider />
				<p onClick={() => handleLogout()}>đăng xuất</p>
			</Drawer>
			<Modal
				title='Quản lý tài khoản'
				open={openModal}
				// width={'60vw'}
				confirmLoading={confirmLoading}
				onCancel={() => {
					setOpenModal(false)
				}}
				footer={null}>
				<Tabs defaultActiveKey='1' items={itemsTab} />
			</Modal>
		</div>
	)
}

export default index
