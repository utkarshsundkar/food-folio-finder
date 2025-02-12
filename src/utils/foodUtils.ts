
export interface FoodUnit {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  unit: string;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  quantity: number;
  unit: string;
  searchTerm?: string;
}

export const commonFoodUnits: Record<string, FoodUnit> = {
  burger: { calories: 350, protein: 15, fats: 14, carbs: 40, unit: "piece" },
  dosa: { calories: 120, protein: 3, fats: 3.5, carbs: 20, unit: "piece" },
  biscuit: { calories: 50, protein: 1, fats: 2, carbs: 7, unit: "piece" },
  apple: { calories: 95, protein: 0.5, fats: 0.3, carbs: 25, unit: "piece" },
  banana: { calories: 105, protein: 1.3, fats: 0.4, carbs: 27, unit: "piece" },
};

export const parseRecipeInput = (input: string): FoodItem[] => {
  const foods: FoodItem[] = [];
  const words = input.toLowerCase().split(' ');
  
  let currentQuantity = 1;
  let currentUnit = '';
  
  words.forEach((word) => {
    if (!isNaN(Number(word))) {
      currentQuantity = Number(word);
      return;
    }
    
    if (['g', 'grams', 'pieces', 'piece'].includes(word)) {
      currentUnit = word;
      return;
    }
    
    if (commonFoodUnits[word]) {
      const foodItem = commonFoodUnits[word];
      foods.push({
        name: word,
        calories: foodItem.calories * currentQuantity,
        protein: foodItem.protein * currentQuantity,
        fats: foodItem.fats * currentQuantity,
        carbs: foodItem.carbs * currentQuantity,
        quantity: currentQuantity,
        unit: foodItem.unit
      });
      currentQuantity = 1;
      return;
    }
    
    if (word.length > 2 && !['and', 'with', 'the', 'of'].includes(word)) {
      foods.push({
        name: word,
        searchTerm: word,
        quantity: currentQuantity,
        unit: currentUnit || 'g',
        calories: 0,
        protein: 0,
        fats: 0,
        carbs: 0
      });
      currentQuantity = 1;
      currentUnit = '';
    }
  });
  
  return foods;
};
