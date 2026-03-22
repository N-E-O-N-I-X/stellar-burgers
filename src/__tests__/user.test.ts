import userReducer, { setAuthChecked } from '../services/slices/userSlice';
import { 
  fetchUser, 
  loginUser, 
  registerUser, 
  updateUser, 
  logoutUser 
} from '../services/slices/userSlice';

describe('user slice', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    isAuthenticated: false,
    error: null
  };

  test('setAuthChecked устанавливает isAuthChecked', () => {
    const state = userReducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  test('fetchUser.fulfilled устанавливает user и isAuthenticated', () => {
    const mockUser = { email: 'test@mail.ru', name: 'Test User' };
    
    const state = userReducer(initialState, {
      type: fetchUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('fetchUser.rejected устанавливает isAuthChecked и сбрасывает isAuthenticated', () => {
    const state = userReducer(initialState, { 
      type: fetchUser.rejected.type 
    });

    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });

  test('loginUser.fulfilled устанавливает user, isAuthenticated и очищает error', () => {
    const mockUser = { email: 'test@mail.ru', name: 'Test User' };
    
    const state = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe(null);
  });

  test('loginUser.rejected устанавливает error', () => {
    const state = userReducer(initialState, {
      type: loginUser.rejected.type,
      error: { message: 'Ошибка входа' }
    });

    expect(state.error).toBe('Ошибка входа');
  });

  test('registerUser.fulfilled аналогично loginUser', () => {
    const mockUser = { email: 'new@mail.ru', name: 'New User' };
    
    const state = userReducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  test('updateUser.fulfilled обновляет user', () => {
    const mockUser = { email: 'updated@mail.ru', name: 'Updated User' };
    
    const state = userReducer(initialState, {
      type: updateUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.user).toEqual(mockUser);
  });

  test('logoutUser.fulfilled сбрасывает user и isAuthenticated', () => {
    const stateWithUser = {
      ...initialState,
      user: { email: 'old@mail.ru', name: 'Old User' },
      isAuthenticated: true
    };

    const state = userReducer(stateWithUser, { 
      type: logoutUser.fulfilled.type 
    });

    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });
});
