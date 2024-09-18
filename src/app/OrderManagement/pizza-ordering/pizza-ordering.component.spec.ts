import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PizzaOrderingComponent } from './pizza-ordering.component';
import { PizzaService } from '../../services/pizza.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Topping } from '../../models/pizza.model';

describe('PizzaOrderingComponent', () => {
  let component: PizzaOrderingComponent;
  let fixture: ComponentFixture<PizzaOrderingComponent>;
  let pizzaService: jasmine.SpyObj<PizzaService>;

  beforeEach(async () => {
    const pizzaServiceSpy = jasmine.createSpyObj('PizzaService', ['getPizzaSizes', 'getVegToppings', 'getNonVegToppings']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, PizzaOrderingComponent],
      providers: [
        { provide: PizzaService, useValue: pizzaServiceSpy }
      ]
    }).compileComponents();

    pizzaService = TestBed.inject(PizzaService) as jasmine.SpyObj<PizzaService>;
    pizzaService.getPizzaSizes.and.returnValue([
      { name: 'Small', price: 8, quantity: 1 },
      { name: 'Medium', price: 10, quantity: 1 },
      { name: 'Large', price: 12, quantity: 1 },
      { name: 'ExtraLarge', price: 15, quantity: 1 }
    ]);
    pizzaService.getVegToppings.and.returnValue([
      { name: 'Olives', price: 1, selectedSmall: false, selectedMedium: false, selectedLarge: false, selectedExtraLarge: false },
      { name: 'Mushrooms', price: 1, selectedSmall: false, selectedMedium: false, selectedLarge: false, selectedExtraLarge: false }
    ]);
    pizzaService.getNonVegToppings.and.returnValue([
      { name: 'Pepperoni', price: 2, selectedSmall: false, selectedMedium: false, selectedLarge: false, selectedExtraLarge: false },
      { name: 'Barbecue Chicken', price: 2, selectedSmall: false, selectedMedium: false, selectedLarge: false, selectedExtraLarge: false }
    ]);

    fixture = TestBed.createComponent(PizzaOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with default values', () => {
    expect(component.pizzaSizes.length).toBe(4);
    expect(component.vegToppings.length).toBe(2);
    expect(component.nonVegToppings.length).toBe(2);
  });

  it('should correctly update total price and apply Offer1', () => {
    // Mock data
    component.pizzaSizes = [{ name: 'Medium', price: 10, quantity: 1 }];
    component.vegToppings = [{ name: 'Olives', price: 1, selectedMedium: true }];
    component.nonVegToppings = [{ name: 'Pepperoni', price: 2, selectedMedium: true }];
    component.updateTotal();
  
    // Assert
    expect(component.offerMessageMap['Medium']).toBe('Offer1 - 1 Medium Pizza with 2 toppings = $5');
    expect(component.payableTotal).toBe(8); // 5 (Offer1) + 3 (Base and toppings)
  });
  

  it('should apply Offer3 correctly', () => {
    // Arrange
    component.pizzaSizes = [{ name: 'Large', price: 12, quantity: 1 }];
    component.vegToppings = [
      { name: 'Olives', price: 1, selectedLarge: true },
      { name: 'Mushrooms', price: 1, selectedLarge: true }
    ];
    component.nonVegToppings = [
      { name: 'Pepperoni', price: 2, selectedLarge: true },
      { name: 'Barbecue Chicken', price: 2, selectedLarge: true }
    ];
  
    // Act
    component.updateTotal();
  
    // Assert
    expect(component.offerMessageMap['Large']).toBe('Offer3 - 1 Large Pizza with 4 toppings (Pepperoni and Barbecue chicken count as 2 toppings) = 50% discount, Pay only $7.00');
  });
  
  it('should apply Offer1 and Offer2 simultaneously', () => {
    // Arrange
    component.pizzaSizes = [
      { name: 'Medium', price: 10, quantity: 2 }
    ];
    component.vegToppings = [
      { name: 'Olives', price: 1, selectedMedium: true },
      { name: 'Mushrooms', price: 1, selectedMedium: true }
    ];
    component.nonVegToppings = [
      { name: 'Pepperoni', price: 2, selectedMedium: true },
      { name: 'Barbecue Chicken', price: 2, selectedMedium: true }
    ];
  
    // Act
    component.updateTotal();
  
    // Assert
    expect(component.offerMessageMap['Medium']).toContain('Offer2 - 2 Medium Pizzas with 4 toppings each = $9');
  });

  it('should apply Offer3 correctly for multiple large pizzas', () => {
    // Arrange
    component.pizzaSizes = [
      { name: 'Large', price: 12, quantity: 2 }
    ];
    component.vegToppings = [
      { name: 'Olives', price: 1, selectedLarge: true },
      { name: 'Mushrooms', price: 1, selectedLarge: true }
    ];
    component.nonVegToppings = [
      { name: 'Pepperoni', price: 2, selectedLarge: true },
      { name: 'Barbecue Chicken', price: 2, selectedLarge: true }
    ];
  
    // Act
    component.updateTotal();
  
    // Assert
    expect(component.offerMessageMap['Large']).toContain('Offer3 - 1 Large Pizza with 4 toppings (Pepperoni and Barbecue chicken count as 2 toppings) = 50% discount');
  });

  it('should handle small and extra-large pizzas correctly', () => {
    // Arrange
    component.pizzaSizes = [
      { name: 'Small', price: 8, quantity: 1 },
      { name: 'ExtraLarge', price: 15, quantity: 1 }
    ];
    component.vegToppings = [
      { name: 'Olives', price: 1, selectedSmall: true },
      { name: 'Mushrooms', price: 1, selectedExtraLarge: true }
    ];
    component.nonVegToppings = [
      { name: 'Pepperoni', price: 2, selectedSmall: true },
      { name: 'Barbecue Chicken', price: 2, selectedExtraLarge: true }
    ];
  
    // Act
    component.updateTotal();
  
    // Assert
    expect(component.payableTotal).toBe(8 + 1 + 2 + 15 + 1 + 2); // Base price + toppings
  });
  
  
  it('should set and get selected toppings correctly', () => {
    // Arrange
    const topping = { name: 'Olives', price: 1, selectedMedium: false } as Topping;

    //Assert
    expect(component.isSelected(topping, 'Medium')).toBeFalse();

    // Act
    component.setSelected(topping, 'Medium', true);

    // Assert
    expect(component.isSelected(topping, 'Medium')).toBeTrue();
});

it('should handle unselected state correctly', () => {
    // Arrange
    const topping = { name: 'Olives', price: 1, selectedMedium: true } as Topping;

    expect(component.isSelected(topping, 'Medium')).toBeTrue();

    // Act
    component.setSelected(topping, 'Medium', false);

    // Assert
    expect(component.isSelected(topping, 'Medium')).toBeFalse();
});

it('should correctly handle different pizza sizes', () => {
    /// Arrange
    const smallTopping = { name: 'Olives', price: 1, selectedSmall: false } as Topping;
    const mediumTopping = { name: 'Mushrooms', price: 1, selectedMedium: false } as Topping;

    // Assert
    expect(component.isSelected(smallTopping, 'Small')).toBeFalse();
   // Assert
    expect(component.isSelected(mediumTopping, 'Medium')).toBeFalse();

    // Act
    component.setSelected(smallTopping, 'Small', true);

    // Assert
    expect(component.isSelected(smallTopping, 'Small')).toBeTrue();

    // Act
    component.setSelected(mediumTopping, 'Medium', true);

   // Assert
    expect(component.isSelected(mediumTopping, 'Medium')).toBeTrue();
});

});
