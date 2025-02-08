
import { useState } from "react";
import { Plus, Minus, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

interface Recipe {
  name: string;
  ingredients: Ingredient[];
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
}

const UNIT_CONVERSIONS: { [key: string]: number } = {
  g: 1,
  oz: 28.3495,
  cup: 128,
  tbsp: 15,
  tsp: 5,
};

export const AddRecipeCard = () => {
  const { toast } = useToast();
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    name: "",
    quantity: 100,
    unit: "g",
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0,
  });

  const addIngredient = () => {
    if (!currentIngredient.name || !currentIngredient.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all ingredient fields",
        variant: "destructive",
      });
      return;
    }

    setIngredients([...ingredients, currentIngredient]);
    setCurrentIngredient({
      name: "",
      quantity: 100,
      unit: "g",
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0,
    });
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const calculateTotals = (): Recipe => {
    const totals = ingredients.reduce(
      (acc, ingredient) => {
        const gramsEquivalent = ingredient.quantity * UNIT_CONVERSIONS[ingredient.unit];
        const scaleFactor = gramsEquivalent / 100;
        return {
          totalCalories: acc.totalCalories + ingredient.calories * scaleFactor,
          totalProtein: acc.totalProtein + ingredient.protein * scaleFactor,
          totalFats: acc.totalFats + ingredient.fats * scaleFactor,
          totalCarbs: acc.totalCarbs + ingredient.carbs * scaleFactor,
        };
      },
      { totalCalories: 0, totalProtein: 0, totalFats: 0, totalCarbs: 0 }
    );

    return {
      name: recipeName,
      ingredients,
      ...totals,
    };
  };

  const saveRecipe = () => {
    if (!recipeName) {
      toast({
        title: "Error",
        description: "Please enter a recipe name",
        variant: "destructive",
      });
      return;
    }

    if (ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    const recipe = calculateTotals();
    // Here you could save the recipe to local storage or a backend
    toast({
      title: "Recipe saved",
      description: `${recipe.name} has been saved with ${recipe.totalCalories.toFixed(0)} calories`,
    });

    // Reset form
    setRecipeName("");
    setIngredients([]);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="space-y-4">
        <Input
          placeholder="Recipe Name"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          className="font-medium"
        />

        <div className="space-y-4">
          <h4 className="font-medium">Add Ingredients</h4>
          <div className="space-y-2">
            <Input
              placeholder="Ingredient Name"
              value={currentIngredient.name}
              onChange={(e) =>
                setCurrentIngredient({ ...currentIngredient, name: e.target.value })
              }
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={currentIngredient.quantity}
                onChange={(e) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    quantity: Number(e.target.value),
                  })
                }
                className="w-24"
                min="0"
              />
              <Select
                value={currentIngredient.unit}
                onValueChange={(value) =>
                  setCurrentIngredient({ ...currentIngredient, unit: value })
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">grams</SelectItem>
                  <SelectItem value="oz">ounces</SelectItem>
                  <SelectItem value="cup">cups</SelectItem>
                  <SelectItem value="tbsp">tablespoons</SelectItem>
                  <SelectItem value="tsp">teaspoons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Calories"
                value={currentIngredient.calories}
                onChange={(e) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    calories: Number(e.target.value),
                  })
                }
                min="0"
              />
              <Input
                type="number"
                placeholder="Protein (g)"
                value={currentIngredient.protein}
                onChange={(e) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    protein: Number(e.target.value),
                  })
                }
                min="0"
              />
              <Input
                type="number"
                placeholder="Fats (g)"
                value={currentIngredient.fats}
                onChange={(e) =>
                  setCurrentIngredient({
                    ...currentIngredient,
                    fats: Number(e.target.value),
                  })
                }
                min="0"
              />
            </div>
            <Input
              type="number"
              placeholder="Carbs (g)"
              value={currentIngredient.carbs}
              onChange={(e) =>
                setCurrentIngredient({
                  ...currentIngredient,
                  carbs: Number(e.target.value),
                })
              }
              min="0"
              className="w-1/3"
            />
            <button
              onClick={addIngredient}
              className="w-full py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Ingredient
            </button>
          </div>
        </div>

        {ingredients.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Ingredients List</h4>
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div>
                  <span className="font-medium">{ingredient.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {ingredient.quantity}
                    {ingredient.unit} - {ingredient.calories} kcal
                  </span>
                </div>
                <button
                  onClick={() => removeIngredient(index)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={saveRecipe}
          className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Recipe
        </button>

        {ingredients.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Recipe Totals</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Calories: {calculateTotals().totalCalories.toFixed(0)} kcal</div>
              <div>Protein: {calculateTotals().totalProtein.toFixed(1)}g</div>
              <div>Fats: {calculateTotals().totalFats.toFixed(1)}g</div>
              <div>Carbs: {calculateTotals().totalCarbs.toFixed(1)}g</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
