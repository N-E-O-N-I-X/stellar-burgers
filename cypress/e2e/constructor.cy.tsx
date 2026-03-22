/// <reference types="cypress" />

const MODAL = '[data-cy="modal"]';
const MODAL_CLOSE = '[data-cy="modal-close"]';
const MODAL_OVERLAY = '[data-cy="modal-overlay"]';
const CONSTRUCTOR_BUN_TOP = '[data-cy="constructor-bun-top"]';
const CONSTRUCTOR_INGREDIENTS = '[data-cy="constructor-ingredients"]';
const ORDER_BUTTON = '[data-cy="order-button"]';
const ORDER_NUMBER = '[data-cy="order-number"]';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', 'api/auth/user', {
      body: {
        success: true,
        user: { email: 'test@test.com', name: 'Test User' }
      }
    }).as('getUser');

    cy.intercept('POST', 'api/auth/token', {
      body: {
        success: true,
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token'
      }
    }).as('refreshToken');

    cy.intercept('POST', 'api/orders', {
      body: {
        success: true,
        order: { number: 12345 },
        name: 'Тестовый бургер'
      }
    }).as('createOrder');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.document.cookie = 'accessToken=test-token';
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      }
    });

    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Добавление ингредиентов', () => {
    it('добавляет булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();
      cy.get(CONSTRUCTOR_BUN_TOP).should('contain', 'Краторная булка N-200i');
    });

    it('добавляет начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .click();
      cy.get(CONSTRUCTOR_INGREDIENTS).should('contain', 'Биокотлета из марсианской Магнолии');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открывается при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL).should('exist');
      cy.get(MODAL).should('contain', 'Краторная булка N-200i');
    });

    it('закрывается по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL).should('exist');
      cy.get(MODAL_CLOSE).click();
      cy.get(MODAL).should('not.exist');
    });

    it('закрывается по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL).should('exist');
      cy.get(MODAL_OVERLAY).click({ force: true });
      cy.get(MODAL).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('оформляет заказ и очищает конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .click();

      cy.get(ORDER_BUTTON).click();
      cy.wait('@createOrder');

      cy.get(MODAL).should('exist');
      cy.get(ORDER_NUMBER).should('contain', '12345');

      cy.get(MODAL_CLOSE).click();
      cy.get(MODAL).should('not.exist');

      cy.get(CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(CONSTRUCTOR_INGREDIENTS).should('contain', 'Выберите начинку');
    });
  });
});
