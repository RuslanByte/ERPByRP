import { Navigate } from "react-router-dom";

const PrivateRoute = ({children, allowedRoles}) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if(!token){
        return <Navigate to="/"/>;
    }

    if(allowedRoles && !allowedRoles.includes(userRole)){
        return <Navigate to="/notauthorized"/>;
    }

    return children;
}

export default PrivateRoute;