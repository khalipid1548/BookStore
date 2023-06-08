
import {useSelector} from 'react-redux'
import NotPermitted from './NotPermitted'

function ProtectedRoute(props) {
	const isAuthenticated = useSelector((state) => state.account.isAuthenticated)
	const isAdminRole = window.location.pathname.startsWith('/admin')
	const user = useSelector((state) => state.account.user)
	

	return (
		<>
			{isAuthenticated == true && isAdminRole && user.role === 'ADMIN' 
			? <>{props.children}</>
			: <NotPermitted />
			}
		</>
	)
}

export default ProtectedRoute
