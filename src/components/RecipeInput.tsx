
import { Input } from "@/components/ui/input";
import { FoodCard } from "@/components/FoodCard";
import { FoodItem } from "@/utils/foodUtils";

interface RecipeInputProps {
  recipeInput: string;
  onRecipeInputChange: (value: string) => void;
  onSearch: () => void;
  recipeResults: FoodItem[];
  onAddFood: (food: FoodItem, quantity: number) => void;
}

export const RecipeInput = ({
  recipeInput,
  onRecipeInputChange,
  onSearch,
  recipeResults,
  onAddFood,
}: RecipeInputProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Input
          value={recipeInput}
          onChange={(e) => onRecipeInputChange(e.target.value)}
          placeholder="2 dosas, 1 burger, 100g rice, an apple"
          className="w-full"
        />
        <button
          onClick={onSearch}
          className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
        >
          Run Search
        </button>
      </div>
      {recipeResults.length > 0 && (
        <div className="mt-6 space-y-4">
          {recipeResults.map((food, index) => (
            <FoodCard
              key={index}
              {...food}
              onAdd={(quantity) => onAddFood(food, quantity)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
