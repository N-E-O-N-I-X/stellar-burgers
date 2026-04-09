import ingredientsReducer from '../services/slices/ingredientsSlice';
import { 
  fetchIngredients,
  initialState
} from '../services/slices/ingredientsSlice';

describe('ingredients slice extraReducers', () => {
  test('fetchIngredients.pending устанавливает isLoading = true и очищает error', () => {
    const state = ingredientsReducer(initialState, { 
      type: fetchIngredients.pending.type 
    });
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('fetchIngredients.fulfilled сохраняет ингредиенты и устанавливает isLoading = false', () => {
    const mockIngredients = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      }
    ];

    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBe(null);
  });

  test('fetchIngredients.rejected устанавливает isLoading = false и error', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки ингредиентов' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
