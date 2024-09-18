import { TestBed } from '@angular/core/testing';
import { PizzaService } from './pizza.service';
import { Topping } from '../models/pizza.model';

describe('PizzaService', () => {
  let service: PizzaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PizzaService]
    });
    service = TestBed.inject(PizzaService);
  });
  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPizzaSizes', () => {
    it('should return an array of pizza sizes with correct names and prices', () => {
      const expectedPizzaSizes = [
        { name: 'Small', price: 5 , quantity: 1 },
        { name: 'Medium', price: 7 , quantity: 1 },
        { name: 'Large', price: 8 , quantity: 1 },
        { name: 'ExtraLarge', price: 9 , quantity: 1 },
      ];
      expect(service.getPizzaSizes()).toEqual(expectedPizzaSizes);
    });
  });

  describe('getVegToppings', () => {
    it('should return an array of veg toppings with correct names and prices', () => {
      const expectedVegToppings: Topping[] = [
        { name: 'Tomatoes', price: 1.0 },
        { name: 'Onions', price: 0.5 },
        { name: 'Bell Pepper', price: 1.0 },
        { name: 'Mushrooms', price: 1.2 },
        { name: 'Pineapple', price: 0.75 },
      ];
      expect(service.getVegToppings()).toEqual(expectedVegToppings);
    });
  });

  describe('getNonVegToppings', () => {
    it('should return an array of non-veg toppings with correct names and prices', () => {
      const expectedNonVegToppings: Topping[] = [
        { name: 'Sausage', price: 1.0 },
        { name: 'Pepperoni', price: 2.0 },
        { name: 'Barbecue Chicken', price: 3.0 },
      ];
      expect(service.getNonVegToppings()).toEqual(expectedNonVegToppings);
    });
  });

  describe('getOffer', () => {
    it('should return the current offer with size and price', () => {
      const expectedOffer = {
        pizzaSize: 'Large',
        price: 6.5,
      };
      expect(service.getOffer()).toEqual(expectedOffer);
    });
  });
});
