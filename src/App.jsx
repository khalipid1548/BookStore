import React, {useEffect, useState} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import LoginPage from './pages/login/index';
import Order from './pages/Order';
import Book from './pages/Book';
import {Outlet} from 'react-router-dom';
import Header from './components/Header';
import ManageUser from './components/ManageUser';
import ManageBook from './components/ManageBook';

import LayoutAdmin from './components/LayoutAdmin';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import {callFetAccount} from './services/api-auth';
import {useDispatch, useSelector} from 'react-redux';
import {doLoginAction} from './redux/account/accountSlice';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import "./reset.scss"
import "./global.scss"
import OrderHistory from './components/OrderHistory';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="layout-app">
      <Header searchTerm={searchTerm}  setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]}  />
      <Footer />
    </div>
  );
};


export default function App() {
  const dispatch = useDispatch();

  // const isLoading = useSelector((state) => state.account.isLoading);
  // const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  // gọi api khi client refesh lại site
  const getAccount = async () => {
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register' 
    ) return;

    const res = await callFetAccount();
    if (res && res.data) {
      dispatch(doLoginAction(res.data.user));
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

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
        }
      ],
    },
    {
      path: '/admin',
      element:   <ProtectedRoute><LayoutAdmin/></ProtectedRoute>,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            // <ProtectedRoute>
              <AdminPage />
            // </ProtectedRoute>
          ),
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
  ]);

  return (
    
      <RouterProvider router={router} /> 

    // <>
    //   { isLoading === false 
    //     || window.location.pathname === '/login'
    //     || window.location.pathname === '/register'
    //     || window.location.pathname === '/' 
    //     ?  <RouterProvider router={router} />
    //     :  <Loading />
    //   }
    // </>
  );
}
