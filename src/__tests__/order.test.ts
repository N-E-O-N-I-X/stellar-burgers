import ordersReducer from '../services/slices/ordersSlice';
import { fetchOrders } from '../services/slices/ordersSlice'

describe('orders slice extraReducers', () => {
  const initialState = {
    orders: [],
    isLoading: false,
    error: null
  };

  test('fetchOrders.pending устанавливает isLoading = true и очищает error', () => {
    const state = ordersReducer(initialState, { 
      type: fetchOrders.pending.type 
    });
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('fetchOrders.fulfilled сохраняет заказы и устанавливает isLoading = false', () => {
    const mockOrders = [
      {
        _id: '643d69a5c3f7b9001cfa093f',
        number: 99999,
        status: 'done',
        name: 'Мясо бессмертных моллюсков Protostomia',
        createdAt: '2025-11-07T18:00:00Z',
        updatedAt: '2025-11-07T18:00:00Z',
        ingredients: ['ingredient1', 'ingredient2']
      }
    ];

    const state = ordersReducer(initialState, {
      type: fetchOrders.fulfilled.type,
      payload: mockOrders
    });

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBe(null);
  });

  test('fetchOrders.rejected устанавливает isLoading = false и error', () => {
    const state = ordersReducer(initialState, {
      type: fetchOrders.rejected.type,
      error: { message: 'Ошибка загрузки заказов' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });
});
