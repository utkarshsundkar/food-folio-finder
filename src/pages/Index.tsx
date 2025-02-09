import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { MealTypeFilter } from "@/components/MealTypeFilter";
import { FoodCard } from "@/components/FoodCard";
import { searchFood } from "@/utils/gemini";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";

// Common food items with their nutritional values per unit
const commonFoodUnits = {
  burger: { calories: 350, protein: 15, fats: 14, carbs: 40, unit: "piece" },
  dosa: { calories: 120, protein: 3, fats: 3.5, carbs: 20, unit: "piece" },
  biscuit: { calories: 50, protein: 1, fats: 2, carbs: 7, unit: "piece" },
  apple: { calories: 95, protein: 0.5, fats: 0.3, carbs: 25, unit: "piece" },
  banana: { calories: 105, protein: 1.3, fats: 0.4, carbs: 27, unit: "piece" },
  rice: { calories: 130, protein: 2.7, fats: 0.3, carbs: 28, unit: "g" },
  chicken: { calories: 165, protein: 31, fats: 3.6, carbs: 0, unit: "g" },
  bread: { calories: 75, protein: 2.7, fats: 1, carbs: 13.8, unit: "slice" },
  egg: { calories: 72, protein: 6.3, fats: 4.8, carbs: 0.4, unit: "piece" },
};

const parseRecipeInput = (input: string) => {
  const foods: any[] = [];
  const words = input.toLowerCase().split(' ');
  
  let currentQuantity = 1;
  let currentUnit = '';
  
  words.forEach((word, index) => {
    // Check if word is a number or numeric string
    if (!isNaN(Number(word))) {
      currentQuantity = Number(word);
      return;
    }
    
    // Check if word is a unit
    if (['g', 'grams', 'pieces', 'piece', 'slices', 'slice'].includes(word)) {
      currentUnit = word;
      return;
    }
    
    // Remove plurals and common variations
    const singularWord = word.replace(/s$/, '').replace('ies', 'y');
    
    // Check if it's a common food item
    if (commonFoodUnits[singularWord]) {
      const foodItem = commonFoodUnits[singularWord];
      foods.push({
        name: `${currentQuantity} ${currentQuantity > 1 ? word : singularWord}`,
        calories: foodItem.calories * currentQuantity,
        protein: foodItem.protein * currentQuantity,
        fats: foodItem.fats * currentQuantity,
        carbs: foodItem.carbs * currentQuantity,
        quantity: currentQuantity,
        unit: foodItem.unit
      });
      currentQuantity = 1; // Reset quantity
      return;
    }
    
    // For other items, try to parse from the search API
    if (word.length > 2 && !['and', 'with', 'the', 'of'].includes(word)) {
      foods.push({
        name: word,
        searchTerm: word,
        quantity: currentQuantity,
        unit: currentUnit || 'g'
      });
      currentQuantity = 1;
      currentUnit = '';
    }
  });
  
  return foods;
};

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [recipeInput, setRecipeInput] = useState("");
  const [recipeResults, setRecipeResults] = useState<any[]>([]);
  const { toast } = useToast();
  
  const debouncedSearch = useDebounce(search, 1000);

  const { data: foods = [], isLoading, error } = useQuery({
    queryKey: ["foods", debouncedSearch],
    queryFn: () => searchFood(debouncedSearch),
    enabled: debouncedSearch.length > 2 && selectedMealType !== "My Recipes",
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const handleAddFood = (food: any, quantity: number) => {
    toast({
      title: "Food added",
      description: `${quantity}${food.unit || 'g'} of ${food.name} has been added to your meal plan.`,
    });
  };

  const handleRecipeSearch = async () => {
    if (!recipeInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipe description",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedFoods = parseRecipeInput(recipeInput);
      
      // For each non-common food item, fetch nutritional data
      const results = await Promise.all(
        parsedFoods.map(async (food) => {
          if (food.searchTerm) {
            const searchResult = await searchFood(food.searchTerm);
            if (searchResult && searchResult[0]) {
              const nutritionData = searchResult[0];
              return {
                ...nutritionData,
                quantity: food.quantity,
                unit: food.unit
              };
            }
          }
          return food;
        })
      );

      setRecipeResults(results.filter(result => result !== null));
      
      toast({
        title: "Recipe analyzed",
        description: "Your recipe has been processed successfully",
      });
    } catch (error) {
      console.error('Error processing recipe:', error);
      toast({
        title: "Error",
        description: "Failed to process recipe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Select your meal</h1>
          {selectedMealType !== "My Recipes" && (
            <SearchBar 
              value={search} 
              onChange={setSearch}
            />
          )}
        </header>

        <MealTypeFilter selected={selectedMealType} onSelect={setSelectedMealType} />

        <div className="mt-6 space-y-4">
          {selectedMealType === "My Recipes" ? (
            <>
              <div className="space-y-4">
                <Input
                  value={recipeInput}
                  onChange={(e) => setRecipeInput(e.target.value)}
                  placeholder="2 dosas, 1 burger, 100g rice, an apple"
                  className="w-full"
                />
                <button
                  onClick={handleRecipeSearch}
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
                      onAdd={(quantity) => handleAddFood(food, quantity)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : isLoading ? (
            <div className="text-center text-gray-500">Searching...</div>
          ) : error ? (
            <div className="text-center text-red-500">
              Please wait a moment before searching again
            </div>
          ) : foods.length > 0 ? (
            foods.map((food, index) => (
              <FoodCard
                key={index}
                {...food}
                onAdd={(quantity) => handleAddFood(food, quantity)}
              />
            ))
          ) : debouncedSearch.length > 2 ? (
            <div className="text-center text-gray-500">No foods found</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Index;
