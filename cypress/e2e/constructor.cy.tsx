describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.education-services.ru/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', 'https://norma.education-services.ru/api/auth/user', {
      body: {
        success: true,
        user: { email: 'test@test.com', name: 'Test User' }
      }
    }).as('getUser');

    cy.intercept('POST', 'https://norma.education-services.ru/api/auth/token', {
      body: {
        success: true,
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token'
      }
    }).as('refreshToken');

    cy.intercept('POST', 'https://norma.education-services.ru/api/orders', {
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

  describe('Добавление ингредиентов', () => {
    it('добавляет булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .click();
      cy.get('[data-cy="constructor-bun-top"]').should(
        'contain',
        'Краторная булка N-200i'
      );
    });

    it('добавляет начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .click();
      cy.get('[data-cy="constructor-ingredients"]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открывается при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal"]').should('contain', 'Краторная булка N-200i');
    });

    it('закрывается по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('закрывается по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
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

      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="order-number"]').should('contain', '12345');

      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
      cy.get('[data-cy="constructor-ingredients"]').should('contain', 'Выберите начинку');
    });
  });
});
