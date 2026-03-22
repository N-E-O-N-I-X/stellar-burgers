import burgerConstructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  resetConstructor,
  moveIngredient
} from '../services/slices/burgerConstructorSlice';

describe('Тестирование reducers слайса burgerConstructorSlice', function () {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  const mockBun = {
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
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const mockMain = {
    _id: '643d69a5c3f7b9001cfa0941',
    id: 'unique-main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const mockSauce = {
    _id: '643d69a5c3f7b9001cfa0943',
    id: 'unique-sauce-1',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
  };

  test('Добавление булки в конструктор', () => {
    const state = burgerConstructorReducer(initialState, addBun(mockBun));
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  test('Добавление ингредиента в конструктор', () => {
    const state = burgerConstructorReducer(initialState, addIngredient(mockMain));
    expect(state.ingredients).toEqual([mockMain]);
    expect(state.bun).toBeNull();
  });

  test('Удаление ингредиента из конструктора', () => {
    const stateWithIngredient = burgerConstructorReducer(initialState, addIngredient(mockMain));
    const state = burgerConstructorReducer(stateWithIngredient, removeIngredient('unique-main-1'));
    expect(state.ingredients).toEqual([]);
    expect(state.bun).toBeNull();
  });

  test('Изменение порядка ингредиентов в конструкторе', () => {
    const state1 = burgerConstructorReducer(initialState, addIngredient(mockMain));
    const state2 = burgerConstructorReducer(state1, addIngredient(mockSauce));
    const state3 = burgerConstructorReducer(state2, moveIngredient({ from: 0, to: 1 }));
    expect(state3.ingredients[0].id).toBe('unique-sauce-1');
    expect(state3.ingredients[1].id).toBe('unique-main-1');
  });

  test('Очищение конструктора', () => {
    const state1 = burgerConstructorReducer(initialState, addBun(mockBun));
    const state2 = burgerConstructorReducer(state1, addIngredient(mockMain));
    const state3 = burgerConstructorReducer(state2, resetConstructor());
    expect(state3.bun).toBeNull();
    expect(state3.ingredients).toEqual([]);
  });
});
