import feedReducer from '../services/slices/feedSlice';
import { 
  fetchFeeds,
  initialState
} from '../services/slices/feedSlice';

describe('feed slice extraReducers', () => {

  test('fetchFeeds.pending устанавливает isLoading = true и очищает error', () => {
    const state = feedReducer(initialState, { 
      type: fetchFeeds.pending.type 
    });
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('fetchFeeds.fulfilled устанавливает данные и isLoading = false', () => {
    const mockPayload = {
      orders: [{ number: 123, name: 'test' }],
      total: 100,
      totalToday: 5
    };

    const state = feedReducer(initialState, {
      type: fetchFeeds.fulfilled.type,
      payload: mockPayload
    });

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockPayload.orders);
    expect(state.total).toEqual(mockPayload.total);
    expect(state.totalToday).toEqual(mockPayload.totalToday);
  });

  test('fetchFeeds.rejected устанавливает isLoading = false и error', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.rejected.type,
      error: { message: 'Серверная ошибка' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Серверная ошибка');
  });
});
