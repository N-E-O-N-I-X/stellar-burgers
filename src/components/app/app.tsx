import { useEffect } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { ProtectedRoute } from './components/protected-route';
import { ConstructorPage } from '../../pages/constructor-page';
import { Feed } from '../../pages/feed';
import { Login } from '../../pages/login';
import { Register } from '../../pages/register';
import { ForgotPassword } from '../../pages/forgot-password';
import { ResetPassword } from '../../pages/reset-password';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { NotFound404 } from '../../pages/not-found-404';
import { Modal } from '../modal';
import { AppHeader } from '../app-header';
import { Preloader } from '@ui';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUser, setAuthChecked } from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';
import '../../index.css';
import styles from './app.module.css';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.ingredients);
  const { isAuthChecked } = useSelector((state) => state.user);

  const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    dispatch(fetchIngredients());
    if (getCookie('accessToken')) {
      dispatch(fetchUser());
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  if (!isAuthChecked || isLoading) return <Preloader />;

  if (error) {
    return (
      <div className={`${styles.error} text text_type_main-medium pt-4`}>
        {error}
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <div className={styles.app}>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </div>
);

export default App;
