import {ExportOutlined, PlusOutlined, ReloadOutlined, UploadOutlined} from '@ant-design/icons'
import {Button, Popconfirm, Space, Table, message, notification} from 'antd'
import React, {useCallback, useEffect, useState} from 'react'
import * as XLSX from 'xlsx'
import {callDeleteUser, callFetchListUser} from '../../services/api-crud-user'
import AddUser from './AddUser'
import EditUser from './EditUser'
import InfoUser from './InfoUser'
import SearchTerm from './SearchTerm'
import UploadUser from './UploadUser'

const index = () => {
	const [loading, setLoading] = useState(false)
	const [openImportUser, setOpenImportUser] = useState(false)
	const [listUser, setListUser] = useState([])
	const [current, setCurrent] = useState(1)
	const [pageSize, setpageSize] = useState(10)
	const [total, setTotal] = useState(0)
	const [openInfoUser, setOpenInfoUser] = useState(false)
	const [dataView, setDataView] = useState('')
	const [openAddUser, setOpenAddUser] = useState(false)
	const [openEditUser, setOpenEditUser] = useState(false)

	const columns = [
		{
			title: 'ID',
			dataIndex: '_id',
			width: 250,
			render: (text, record, index) => {
				return (
					<div
						onClick={() => {
							setOpenInfoUser(true)
							setDataView(record)
						}}
						style={{cursor: 'pointer', color: 'blue'}}>
						{record._id}
					</div>
				)
			},
		},
		{
			title: 'Name',
			dataIndex: 'fullName',
		},
		{
			title: 'Role',
			dataIndex: 'role',
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'Số Điện thoại',
			dataIndex: 'phone',
		},
		{
			title: 'Action',
			render: (text, record) => {
				return (
					<Space size='middle'>
						<Popconfirm
							placement='leftTop'
							title='Bạn có chắc chắn muốn xóa?'
							onConfirm={() => {
								handleDeleteUser(record._id)
							}}
							okText='Yes'
							cancelText='No'>
							<Button type='primary' danger>
								Delete
							</Button>
						</Popconfirm>

						<Button
							onClick={() => {
								setDataView(record)
								setOpenEditUser(true)
							}}
							type='primary'>
							Edit
						</Button>
					</Space>
				)
			},
		},
	]

	const handleDeleteUser = async (id) => {
		const res = await callDeleteUser(id)
		if (res && res.data) {
			message.success('Xóa thành công')
			await fetchUser()
		} else {
			message.error('Xóa thất bại')
			notification.error(res.message)
		}
	}

	const fetchUser = async (searchFil) => {
		setLoading(true)
		let query = `current=${current}&pageSize=${pageSize}`

		if (searchFil) {
			query += `${searchFil}`
		}

		const res = await callFetchListUser(query)

		if (res && res.data) {
			setListUser(res.data.result)
			setTotal(res.data.meta.total)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchUser()
	}, [current, pageSize])

	const onChange = useCallback(
		(pagination, filters, sorter, extra) => {
			if (pagination && pagination.current !== current) {
				setCurrent(pagination.current)
			}

			if (pagination && pagination.pageSize !== pageSize) {
				setpageSize(pagination.pageSize)
				setCurrent(1)
			}

			// console.log(pagination, filters, sorter, extra)
		},
		[current, pageSize]
	)

	const handleExport = () => {
		if (listUser.length > 0) {
			const workSheet = XLSX.utils.json_to_sheet(listUser)
			const workBook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1')
			XLSX.writeFile(workBook, 'ListUser.csv')
		}
	}
	const renderHeader = () => {
		return (
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				<span>Table List Users</span>
				<span style={{display: 'flex', gap: 16}}>
					<Button icon={<ExportOutlined />} onClick={handleExport}>
						Export User
					</Button>
					<Button
						icon={<UploadOutlined />}
						onClick={() => {
							setOpenImportUser(true)
						}}>
						Import User
					</Button>
					<Button
						icon={<PlusOutlined />}
						onClick={() => {
							setOpenAddUser(true)
						}}>
						Thêm User
					</Button>
					<Button icon={<ReloadOutlined />} onClick={() => {}} />
				</span>
			</div>
		)
	}

	const onFinish = useCallback(
		(values) => {
			let query = ''

			if (values.fullName) {
				query += `&fullName=/${values.fullName}/i`
			}
			if (values.email) {
				query += `&email=/${values.email}/i`
			}
			if (values.phone) {
				query += `&phone=/${values.phone}/i`
			}
			if (query) {
				fetchUser(query)
			}
		},
		[listUser]
	)



	return (
		<div>
			<SearchTerm onFinish={onFinish} loading={loading} fetchUser={fetchUser} />

			<Table
				title={renderHeader}
				rowKey='_id'
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
				columns={columns}
				dataSource={listUser}
			/>
			<InfoUser
				onOpen={openInfoUser}
				dataView={dataView}
				onClose={() => {
					setOpenInfoUser(false)
					setDataView('')
				}}
				handleDeleteUser={handleDeleteUser}
			/>

			<AddUser
				loading={loading}
				setLoading={setLoading}
				open={openAddUser}
				setOpenAddUser={setOpenAddUser}
				onClose={() => setOpenAddUser(false)}
			/>

			<UploadUser
				fetchUser={fetchUser}
				openImportUser={openImportUser}
				setOpenImportUser={setOpenImportUser}
			/>

			<EditUser
				dataView={dataView}
				openEditUser={openEditUser}
				fetchUser={fetchUser}
				onClose={() => {
					setOpenEditUser(false)
					setDataView('')
				}}
			/>
		</div>
	)
}

export default index
