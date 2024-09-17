import { Component, OnInit } from '@angular/core';
import { PizzaService } from '../../services/pizza.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Topping } from '../../models/pizza.model';

@Component({
  selector: 'app-pizza-ordering',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pizza-ordering.component.html',
  styleUrls: ['./pizza-ordering.component.css'],
})
export class PizzaOrderingComponent implements OnInit {
  pizzaSizes: any[] = [];
  vegToppings: Topping[] = [];
  nonVegToppings: Topping[] = [];
  total = 0;
  offerMessage = '';

  constructor(private pizzaService: PizzaService) {}

  ngOnInit(): void {
    this.pizzaSizes = this.pizzaService.getPizzaSizes();
    this.vegToppings = this.pizzaService.getVegToppings();
    this.nonVegToppings = this.pizzaService.getNonVegToppings();
  }

  updateTotal() {
    this.total = 0;
    const sizeTotals = { Small: 0, Medium: 0, Large: 0, ExtraLarge: 0 };
    const pizzaCount = { Small: 0, Medium: 0, Large: 0, ExtraLarge: 0 };

    // Calculate totals for selected toppings based on size
    this.vegToppings.concat(this.nonVegToppings).forEach(topping => {
      if (topping.selectedSmall) sizeTotals.Small += topping.price;
      if (topping.selectedMedium) sizeTotals.Medium += topping.price;
      if (topping.selectedLarge) sizeTotals.Large += topping.price;
      if (topping.selectedExtraLarge) sizeTotals.ExtraLarge += topping.price;
    });

    // Add base prices for each size
    this.pizzaSizes.forEach(size => {
      const sizeKey = size.name as keyof typeof sizeTotals;
      if (sizeTotals[sizeKey] > 0) {
        this.total += size.price + sizeTotals[sizeKey];
        pizzaCount[sizeKey]++;
      }
    });

    this.offerMessage = '';
    this.applyOffers(sizeTotals, pizzaCount);
  }

  applyOffers(sizeTotals: { Small: number; Medium: number; Large: number; ExtraLarge: number }, pizzaCount: { Small: number; Medium: number; Large: number; ExtraLarge: number }) {
    let tempTotal = this.total;
    let offerApplied = false;

    const mediumPizzaToppings = this.countToppings(this.vegToppings, 'Medium') + this.countToppings(this.nonVegToppings, 'Medium');
    const largePizzaToppings = this.countToppings(this.vegToppings, 'Large') + this.countToppings(this.nonVegToppings, 'Large');

    if (pizzaCount.Medium >= 1 && mediumPizzaToppings >= 2) {
      this.offerMessage = 'Offer1 - 1 Medium Pizza with 2 toppings = $5';
      tempTotal = this.total - Math.min(tempTotal, 5);
      offerApplied = true;
    }

    if (pizzaCount.Medium >= 1 && mediumPizzaToppings >= 8) {
      this.offerMessage = 'Offer2 - 2 Medium Pizzas with 4 toppings each = $9';
      tempTotal =  Math.min(tempTotal, 9)*2;
      offerApplied = true;
    }

    if (pizzaCount.Large >= 1 && largePizzaToppings >= 4) {
      this.offerMessage = 'Offer3 - 1 Large Pizza with 4 toppings - 50% discount';
      const largePizzaBasePrice = this.pizzaSizes.find(size => size.name === 'Large')!.price;
      const largePizzaTotal = sizeTotals.Large + largePizzaBasePrice;
      tempTotal = Math.min(tempTotal, this.total - largePizzaTotal + largePizzaTotal * 0.5);
      offerApplied = true;
    }

    this.total = tempTotal;
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
}
