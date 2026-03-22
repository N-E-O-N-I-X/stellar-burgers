import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { orderBurgerApi } from '../../utils/burger-api';
import {
  setOrderRequest,
  setOrderModalData,
  resetConstructor
} from '../../services/slices/burgerConstructorSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchOrders } from '../../services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const constructorItems = { bun, ingredients };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(setOrderRequest(true));
    const ingredientIds = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    orderBurgerApi(ingredientIds)
      .then((res) => {
        dispatch(
          setOrderModalData({ ...res.order, ingredients: ingredientIds })
        );
        dispatch(resetConstructor());
        dispatch(fetchFeeds());
        dispatch(fetchOrders());
      })
      .finally(() => {
        dispatch(setOrderRequest(false));
      });
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
