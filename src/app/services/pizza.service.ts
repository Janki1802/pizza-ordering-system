// pizza.service.ts

import { Injectable } from '@angular/core';
import { Topping } from '../models/pizza.model';

@Injectable({
  providedIn: 'root',
})
export class PizzaService {
  // Pizza size and prices
  pizzaSizes = [
    { name: 'Small', price: 5 , quantity: 1 },
    { name: 'Medium', price: 7 , quantity: 1 },
    { name: 'Large', price: 8 , quantity: 1 },
    { name: 'ExtraLarge', price: 9 , quantity: 1 },
  ];

  // Veg and Non-Veg Toppings
  vegToppings: Topping[] = [
    { name: 'Tomatoes', price: 1.0 },
    { name: 'Onions', price: 0.5 },
    { name: 'Bell Pepper', price: 1.0 },
    { name: 'Mushrooms', price: 1.2 },
    { name: 'Pineapple', price: 0.75 },
  ];

  nonVegToppings: Topping[] = [
    { name: 'Sausage', price: 1.0 },
    { name: 'Pepperoni', price: 2.0 },
    { name: 'Barbecue Chicken', price: 3.0 },
  ];

  offer = {
    pizzaSize: 'Large',
    price: 6.5,
  };

  // Method to get pizza sizes
  getPizzaSizes() {
    return this.pizzaSizes;
  }

  // Method to get veg toppings
  getVegToppings() {
    return this.vegToppings;
  }

  // Method to get non-veg toppings
  getNonVegToppings() {
    return this.nonVegToppings;
  }

  // Method to get offer details
  getOffer() {
    return this.offer;
  }
}
