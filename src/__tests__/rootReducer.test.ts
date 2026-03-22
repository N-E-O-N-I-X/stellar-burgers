import { rootReducer } from '../services/store';

describe('rootReducer', function () {
  test('Должен корректно инициализироваться', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null
    });

    expect(state.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });

    expect(state.orders).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });

    expect(state.user).toEqual({
      user: null,
      isAuthChecked: false,
      isAuthenticated: false,
      error: null
    });
  });
});
