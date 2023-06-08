import {InboxOutlined} from '@ant-design/icons'
import {message, Upload, Modal, Table, notification} from 'antd'
import {useState} from 'react'
import * as XLSX from 'xlsx'
import {callCreateListUser} from '../../services/api-crud-user'
import templateFile from '../../../public/template.xlsx?url'

const {Dragger} = Upload

const columns = [
	{dataIndex: 'fullname', title: 'Name'},
	{dataIndex: 'email', title: 'Email'},
	{dataIndex: 'phone', title: 'Số Điện thoại'},
]

const dummyRequest = ({file, onSuccess}) => {
	setTimeout(() => {
		onSuccess('ok')
	}, 777)
}

const UploadUser = ({openImportUser, setOpenImportUser, fetchUser}) => {
	const [dataExcel, setDataExcel] = useState([])
	const handleOk = async () => {
		const data = dataExcel.map((item) => {
			item.password = '123456'
			return item
		})

		const res = await callCreateListUser(data)
		if (res.data) {
			notification.success({
				message: 'Import Thành công',
				description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
			})
			setDataExcel([])
			setOpenImportUser(false)
			fetchUser()
		} else {
			notification.error({
				message: 'Import Thất bại',
				description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
			})
		}
	}

	const propsUpload = {
		name: 'file',
		multiple: false,
		maxCount: 1,
		customRequest: dummyRequest,
		accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
		// action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
		onChange(info) {
			const {status} = info.file
			if (status !== 'uploading') {
				console.log(info.file, info.fileList)
			}
			if (status === 'done') {
				if (info.fileList.length > 0) {
					const file = info.fileList[0].originFileObj
					const reader = new FileReader()
					reader.readAsArrayBuffer(file)
					reader.onload = (e) => {
						const data = new Uint8Array(reader.result)
						const workbook = XLSX.read(data, {type: 'array'})
						const sheet = workbook.Sheets[workbook.SheetNames[0]]
						const json = XLSX.utils.sheet_to_json(sheet, {
							header: ['fullName', 'email', 'phone'],
							range: 1,
						})
						if (json.length > 0) setDataExcel(json)
						console.log(json)
					}
				}

				message.success(`${info.file.name} file uploaded successfully.`)
			} else if (status === 'error') {
				message.error(`${info.file.name} file upload failed.`)
			}
		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files)
		},
	}

	return (
		<Modal
			width={'50vw'}
			title='Import data User'
			open={openImportUser}
			onOk={handleOk}
			onCancel={() => {
				setOpenImportUser(false)
				setDataExcel([])
			}}
			okText='Import data'
			maskClosable={false}
			okButtonProps={{disabled: dataExcel.length === 0}}>
			<Dragger {...propsUpload}>
				<p className='ant-upload-drag-icon'>
					<InboxOutlined />
				</p>
				<p className='ant-upload-text'>Click or drag file to this area to upload</p>
				<p className='ant-upload-hint'>
					Support for a single upload. Only accept .csv .xlsx .xls or <a onClick={e => e.stopPropagation()} download href={templateFile} >Download sample File</a>
				</p>
			</Dragger>

			<div style={{padding: '20px 0'}}>
				<Table columns={columns} dataSource={dataExcel} />
			</div>
		</Modal>
	)
}
export default UploadUser
