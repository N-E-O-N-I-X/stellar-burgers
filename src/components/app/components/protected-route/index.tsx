import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../../../services/store';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  element: JSX.Element;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  element,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) return <Preloader />;

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
