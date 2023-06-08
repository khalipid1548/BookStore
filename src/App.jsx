import React, {useEffect, useState} from 'react'
import {Outlet, RouterProvider, createBrowserRouter} from 'react-router-dom'
import Header from './components/Header'
import ManageBook from './components/ManageBook'
import ManageUser from './components/ManageUser'
import Book from './pages/Book'
import Order from './pages/Order'
import LoginPage from './pages/login/index'
import {useDispatch} from 'react-redux'
import Footer from './components/Footer'
import Home from './components/Home'

import NotFound from './components/NotFound'
import OrderHistory from './components/OrderHistory'
import ProtectedRoute from './components/ProtectedRoute'
import './global.scss'

import RegisterPage from './pages/register'
import {doLoginAction} from './redux/account/accountSlice'
import './reset.scss'
import {callFetAccount} from './services/api-auth'
import LayoutAdmin from './pages/LayoutAdmin/index';
import AdminHome from './components/AdminHome'

const Layout = () => {
	const [searchTerm, setSearchTerm] = useState('')

	return (
		<div >
			<Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			<Outlet context={[searchTerm, setSearchTerm]} />
			<Footer />
		</div>
	)
}

export default function App() {
	const dispatch = useDispatch()



	// gọi api khi client refesh lại site
	const getAccount = async () => {
		if (window.location.pathname === '/login' || window.location.pathname === '/register') return

		const res = await callFetAccount()
		if (res && res.data) {
			dispatch(doLoginAction(res.data.user))
		}
	}

	useEffect(() => {
		getAccount()
	}, [])

	const router = createBrowserRouter([
		{
			path: '/',
			element: <Layout />,
			errorElement: <NotFound />,
			children: [
				{index: true, element: <Home />},
				{
					path: 'order',
					element: <Order />,
				},
				{
					path: 'book/:slug',
					element: <Book />,
				},
				{
					path: 'history',
					element: <OrderHistory />,
				},
			],
		},
		{
			path: '/admin',
			element: <ProtectedRoute> <LayoutAdmin/> </ProtectedRoute>,
			errorElement: <NotFound />,
			children: [
				{
					index: true,
					element: <AdminHome />,
				},
				{
					path: 'user',
					element: <ManageUser />,
				},
				{
					path: 'book',
					element: <ManageBook />,
				},
			],
		},

		{
			path: '/login',
			element: <LoginPage />,
		},
		{
			path: '/register',
			element: <RegisterPage />,
		},
	])

	return <RouterProvider router={router} />
}
