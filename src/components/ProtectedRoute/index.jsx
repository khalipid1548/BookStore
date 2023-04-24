import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import NotPermitted from './NotPermitted';

const RoleBaseRoute = (props) => {
    const isAdminRole = window.location.pathname.startsWith('/admin');
    const user = useSelector((state) => state.account.user);
    const userRole = user.role;

    if(isAdminRole && userRole === "ADMIN"){
        return(<>{props.children}</>);
    }else{
        return (<NotPermitted/>)
    }
}

function ProtectedRoute(props) {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  return <>
    {isAuthenticated== true ? 
    <RoleBaseRoute>{props.children}</RoleBaseRoute> : 
    <Navigate to="/" replace />}
    </>;
}

export default ProtectedRoute;
