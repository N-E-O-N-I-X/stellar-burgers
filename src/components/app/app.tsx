import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
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
import '../../index.css';
import styles from './app.module.css';

const IngredientModal = () => {
  const navigate = useNavigate();
  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <div>IngredientDetails (заглушка)</div>
    </Modal>
  );
};

const OrderModal = () => {
  const navigate = useNavigate();
  return (
    <Modal title='Детали заказа' onClose={() => navigate(-1)}>
      <div>OrderInfo (заглушка)</div>
    </Modal>
  );
};

const App = () => (
  <div className={styles.app}>
    <BrowserRouter>
      <AppHeader />
      <Routes>
        {/* Основные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Модалки */}
        <Route path='/feed/:number' element={<OrderModal />} />
        <Route path='/ingredients/:id' element={<IngredientModal />} />

        {/* Защищённые */}
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
          element={<ProtectedRoute element={<OrderModal />} />}
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
