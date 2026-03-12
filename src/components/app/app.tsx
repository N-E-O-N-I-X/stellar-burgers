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
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import '../../index.css';
import styles from './app.module.css';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.ingredients);

  const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

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
        <Route path='/feed/:number' element={<div>Страница заказа</div>} />
        <Route
          path='/ingredients/:id'
          element={<div>Страница ингредиента</div>}
        />
        <Route path='/login' element={<ProtectedRoute element={<Login />} />} />
        <Route
          path='/register'
          element={<ProtectedRoute element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute element={<ResetPassword />} />}
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
          element={
            <ProtectedRoute element={<div>Страница заказа профиля</div>} />
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <div>IngredientDetails (заглушка)</div>
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <div>OrderInfo (заглушка)</div>
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                    <div>OrderInfo (заглушка)</div>
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
