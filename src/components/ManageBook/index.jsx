import {ExportOutlined, PlusOutlined, ReloadOutlined, UploadOutlined} from '@ant-design/icons'
import {Button, Popconfirm, Space, Table, message} from 'antd'
import {useCallback, useEffect, useState} from 'react'
import {callDeleteBook, callFetchListBook} from './../../services/api-crud-book'
import SearchTerm from './SearchTerm'
import InfoBook from './InfoBook'
import AddBook from './AddBook'
import UpdateBook from './UpdateBook'

const index = () => {
	const [listBook, setListBook] = useState([])
	const [loading, setLoading] = useState(false)
	const [current, setCurrent] = useState(1)
	const [pageSize, setpageSize] = useState(5)
	const [total, setTotal] = useState(0)
    const [dataView, setDataView] = useState('')
    const [openInfoBook, setOpenInfoBook] = useState(false)
    const [openAddBook, setOpenAddBook] = useState(false);
	const [openUpdateBook, setOpenUpdateBook] = useState(false);
    
	const columns = [
		{
			title: 'ID',
			dataIndex: '_id',
			width: 250,
			render: (text, record, index) => {
				return (
					<div
						style={{cursor: 'pointer', color: 'blue'}}
						onClick={() => {
							setOpenInfoBook(true)
							setDataView(record)
						}}>
						{record._id}
					</div>
				)
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
			render: (text) => (
				<p>
					{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
						text ?? 0
					)}
				</p>
			),
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
			title: 'Action',
			render: (text, record) => {
				return (
					<Space size='middle'>
						<Popconfirm
							placement='leftTop'
							title='Bạn có chắc chắn muốn xóa?'
							onConfirm={() => {handleDeleteBook(record._id)}}
							okText='Yes'
							cancelText='No'>
							<Button type='primary' danger>
								Delete
							</Button>
						</Popconfirm>

						<Button
							onClick={() => {
								setDataView(record)
								setOpenUpdateBook(true)
							}}
							type='primary'>
							Edit
						</Button>
					</Space>
				)
			},
		},
	]

	const handleDeleteBook = async (id) => {
		
		console.log(id)
		setLoading(true)
		const res = await callDeleteBook(id)
		if (res && res.data) {
			message.success('Xoá thành công')
			await fetchBook()
		
		} else {
			notification.error({
				message: 'có lỗi xảy ra',
				description: res.message,
			})
		}
		setLoading(false)
	}

	const fetchBook = async (searchFil) => {
		setLoading(true)
		let query = `current=${current}&pageSize=${pageSize}`

		if (searchFil) {
			query += `${searchFil}`
		}

		const res = await callFetchListBook(query)

		if (res && res.data) {
			setListBook(res.data.result)
			setTotal(res.data.meta.total)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchBook()
	}, [current, pageSize])

	const renderHeader = () => {
		return (
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				<span>Table List Books</span>
				<span style={{display: 'flex', gap: 16}}>
					<Button icon={<ExportOutlined />} onClick={() => {}}>
						Export Book
					</Button>
					<Button icon={<UploadOutlined />} onClick={() => {}}>
						Import Book
					</Button>
					<Button icon={<PlusOutlined />} onClick={() => {setOpenAddBook(true)}}>
						Thêm Book
					</Button>
					<Button icon={<ReloadOutlined />} onClick={() => {}} />
				</span>
			</div>
		)
	}

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

    const onFinish = useCallback(
		(values) => {
            let query = ''

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
              fetchBook(query)
            }
		},
		[listBook]
	)

	return (
		<div>
			<SearchTerm onFinish={onFinish} loading={loading} fetchBook={fetchBook} />
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
				dataSource={listBook}
			/>
			<InfoBook
				dataView={dataView}
				openInfoBook={openInfoBook}
				onClose={() => {
					setOpenInfoBook(false)
					setDataView(null)
				}}
			/>

            <AddBook
                openAddBook={openAddBook}
                setOpenAddBook={setOpenAddBook}
                fetchBook={fetchBook}
            />
			  <UpdateBook
                openUpdateBook={openUpdateBook}
                setOpenUpdateBook={setOpenUpdateBook}
                fetchBook={fetchBook}
				dataView={dataView}
            />
		</div>
	)
}

export default index