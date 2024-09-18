export interface Topping {
  name: string;
  price: number;
  selectedSmall?: boolean;
  selectedMedium?: boolean;
  selectedLarge?: boolean;
  selectedExtraLarge?: boolean;
}

export interface PizzaSize {
  name: string;
  price: number;
  quantity: number;
}