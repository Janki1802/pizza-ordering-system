import { Component, OnInit } from '@angular/core';
import { PizzaService } from '../../services/pizza.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PizzaSize, Topping } from '../../models/pizza.model';

@Component({
  selector: 'app-pizza-ordering',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pizza-ordering.component.html',
  styleUrls: ['./pizza-ordering.component.css'],
})
export class PizzaOrderingComponent implements OnInit {
  pizzaSizes: PizzaSize[] = [];
  vegToppings: Topping[] = [];
  nonVegToppings: Topping[] = [];
  total = 0;
  payableTotal = 0;
  offerMessageMap: { [key: string]: string } = {};
 
  constructor(private pizzaService: PizzaService) {}

  ngOnInit(): void {
    this.pizzaSizes = this.pizzaService.getPizzaSizes();
    this.vegToppings = this.pizzaService.getVegToppings();
    this.nonVegToppings = this.pizzaService.getNonVegToppings();

    // Add a quantity property to each pizza size
    this.pizzaSizes.forEach(size => size.quantity = 1); // Default quantity is 1
  }

  updateTotal() {
    this.total = 0;
    const sizeTotals = { Small: 0, Medium: 0, Large: 0, ExtraLarge: 0 };
    const pizzaCount = { Small: 0, Medium: 0, Large: 0, ExtraLarge: 0 };

    // Calculate totals for selected toppings based on size and quantity
    this.vegToppings.concat(this.nonVegToppings).forEach(topping => {
      if (topping.selectedSmall) sizeTotals.Small += topping.price;
      if (topping.selectedMedium) sizeTotals.Medium += topping.price;
      if (topping.selectedLarge) sizeTotals.Large += topping.price;
      if (topping.selectedExtraLarge) sizeTotals.ExtraLarge += topping.price;
    });

    // Add base prices for each size and multiply by the quantity
    this.pizzaSizes.forEach(size => {
      const sizeKey = size.name as keyof typeof sizeTotals;
      if (sizeTotals[sizeKey] > 0) {
        this.total += (size.price + sizeTotals[sizeKey]) * size.quantity;
        pizzaCount[sizeKey] += size.quantity; // Account for quantity of each pizza size
      }
    });

    this.offerMessageMap = {};
    this.applyOffers(sizeTotals, pizzaCount);
  }

  applyOffers(
    sizeTotals: { Small: number; Medium: number; Large: number; ExtraLarge: number },
    pizzaCount: { Small: number; Medium: number; Large: number; ExtraLarge: number }
  ) {
    let tempTotal = this.total;
    let offerMessageMap: { [key: string]: string } = {}; // To store offer messages per size
    let offer1Applied = false;
    let offer2Applied = false;
    let offer3Applied = false;
  
    const mediumPizzaToppings = this.countToppings(this.vegToppings, 'Medium') + this.countToppings(this.nonVegToppings, 'Medium');
    const largePizzaToppings = this.countToppings(this.vegToppings, 'Large') + this.countToppings(this.nonVegToppings, 'Large');
    const pepperoniAndBBQCount = this.countSpecialToppings(this.nonVegToppings, ['Pepperoni', 'Barbecue chicken'], 'Large');
    const totalLargeToppings = largePizzaToppings + pepperoniAndBBQCount;
  
    // Offer1: 1 Medium Pizza with 2 toppings = $5
    if (pizzaCount.Medium >= 1 && mediumPizzaToppings === 2 && !offer1Applied) {
      const originalMediumPizzaPrice = sizeTotals.Medium + 7; // Medium pizza base price
      tempTotal = tempTotal - originalMediumPizzaPrice + 5; // Deduct original price, add offer price
      offerMessageMap['Medium'] = 'Offer1 - 1 Medium Pizza with 2 toppings = $5';
      offer1Applied = true;
    }
  
    // Offer2: 2 Medium Pizzas with 4 toppings each = $9
    if (pizzaCount.Medium >= 2 && (mediumPizzaToppings >= 8 || mediumPizzaToppings >= 4) && !offer2Applied) {
      const mediumPizzasWithOffer2 = Math.floor(pizzaCount.Medium / 2);
      const originalMediumPizzaPrice = (sizeTotals.Medium + 7) * 2; // Price for 2 medium pizzas
      const offer2Price = 9 * mediumPizzasWithOffer2;
      tempTotal = tempTotal - originalMediumPizzaPrice + offer2Price;
      offerMessageMap['Medium'] = `Offer2 - 2 Medium Pizzas with 4 toppings each = $9 (for ${mediumPizzasWithOffer2} pair)`;
      offer2Applied = true;
    }
  
    // Offer3: 1 Large Pizza with 4 toppings (Pepperoni and Barbecue chicken count as 2 toppings) = 50% discount
    if (pizzaCount.Large >= 1 && totalLargeToppings >= 4 && !offer3Applied) {
      const largePizzaBasePrice = sizeTotals.Large + 8; // Large pizza base price
      const discountedLargePizzaPrice = largePizzaBasePrice * 0.5;
      const originalLargePizzaPrice = largePizzaBasePrice;
      const discountAmount = originalLargePizzaPrice - discountedLargePizzaPrice;
      tempTotal = tempTotal - discountAmount;
      offerMessageMap['Large'] = `Offer3 - 1 Large Pizza with 4 toppings (Pepperoni and Barbecue chicken count as 2 toppings) = 50% discount, Pay only $${discountedLargePizzaPrice.toFixed(2)}`;
      offer3Applied = true;
    }
  
    // Update the offer message and payable total
    this.offerMessageMap = offerMessageMap;
    this.payableTotal = tempTotal;
  }
  
  
countSpecialToppings(toppings: Topping[], specialToppingNames: string[], size: 'Small' | 'Medium' | 'Large' | 'ExtraLarge'): number {
  let count = 0;
  toppings.forEach(topping => {
    if (specialToppingNames.includes(topping.name) && topping[`selected${size}` as keyof Topping]) {
      // Count each special topping as 2
      count += 2;
    }
  });
  return count;
}
  
  countToppings(toppings: Topping[], size: 'Small' | 'Medium' | 'Large' | 'ExtraLarge'): number {
    return toppings.filter(topping => topping[`selected${size}` as keyof Topping]).length;
  }

  setSelected(topping: Topping, size: string, isChecked: boolean) {
    switch(size) {
      case 'Small':
        topping.selectedSmall = isChecked;
        break;
      case 'Medium':
        topping.selectedMedium = isChecked;
        break;
      case 'Large':
        topping.selectedLarge = isChecked;
        break;
      case 'ExtraLarge':
        topping.selectedExtraLarge = isChecked;
        break;
    }
    this.updateTotal();
  }

  isSelected(topping: Topping, size: string): boolean {
    switch(size) {
      case 'Small':
        return topping.selectedSmall ?? false;
      case 'Medium':
        return topping.selectedMedium ?? false;
      case 'Large':
        return topping.selectedLarge ?? false;
      case 'ExtraLarge':
        return topping.selectedExtraLarge ?? false;
      default:
        return false;
    }
  }

  calculateSubtotal(sizeName: string): number {
    // Find the size object by its name
    const size = this.pizzaSizes.find(s => s.name === sizeName);
    if (!size) return 0;
  
    // Base price of the pizza
    const basePrice = size.price;
    // Quantity of pizzas of this size
    const quantity = size.quantity || 0;
    // Get the selected toppings for this pizza size
    const selectedToppings = this.getSelectedToppings(sizeName);
    
    // Check if any toppings are selected
    if (selectedToppings.length === 0) return 0;
  
    // Calculate the total cost of the selected toppings
    const toppingsCost = selectedToppings.reduce((total, topping) => total + topping.price, 0);
  
    // Calculate subtotal
    return (basePrice + toppingsCost) * quantity;
  }
  
  getSelectedToppings(sizeName: string): Topping[] {
    return [...this.vegToppings, ...this.nonVegToppings].filter(topping => this.isSelected(topping, sizeName));
  }
  
  getDiscountedSubtotal(size: string): number {
    const originalPrice = this.getOriginalPrice(size);
  
    if (this.offerMessageMap[size]) {
      if (size === 'Medium' && this.offerMessageMap[size].includes('Offer1')) {
        return 5; // Offer1 fixed price
      } else if (size === 'Medium' && this.offerMessageMap[size].includes('Offer2')) {
        return 9; // Offer2 fixed price for pairs of Medium pizzas
      } else if (size === 'Large' && this.offerMessageMap[size].includes('Offer3')) {
        return originalPrice * 0.5; // Offer3 50% discount
      }
    }
    
    return originalPrice;
  }
  
  
  getOriginalPrice(size: string): number {
    // Find the size object by its name
    const sizeObj = this.pizzaSizes.find(s => s.name === size);
    if (!sizeObj) return 0;

    // Base price of the pizza
    const basePrice = sizeObj.price;
    // Get the selected toppings for this pizza size
    const selectedToppings = this.getSelectedToppings(size);

    // Calculate the total cost of the selected toppings
    const toppingsCost = selectedToppings.reduce((total, topping) => total + topping.price, 0);

    // Calculate original price
    return basePrice + toppingsCost;
  }
  
}
