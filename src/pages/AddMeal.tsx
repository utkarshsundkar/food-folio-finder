import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { MealTypeFilter } from "@/components/MealTypeFilter";
import { searchFood } from "@/utils/gemini";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { parseRecipeInput, type FoodItem } from "@/utils/foodUtils";
import { RecipeInput } from "@/components/RecipeInput";
import { SearchResults } from "@/components/SearchResults";
import { useNutrition } from "@/contexts/NutritionContext";
import { useNavigate } from "react-router-dom";

const AddMeal = () => {
  const navigate = useNavigate();
  const { addFood } = useNutrition();
  const [search, setSearch] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [recipeInput, setRecipeInput] = useState("");
  const [recipeResults, setRecipeResults] = useState<FoodItem[]>([]);
  const { toast } = useToast();
  
  const debouncedSearch = useDebounce(search, 1000);

  const { data: foods = [], isLoading, error } = useQuery({
    queryKey: ["foods", debouncedSearch],
    queryFn: () => searchFood(debouncedSearch),
    enabled: debouncedSearch.length > 2 && selectedMealType !== "My Recipes",
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const handleAddFood = (food: FoodItem, quantity: number) => {
    const scaleFactor = quantity / 100; // Convert to per 100g basis
    addFood(
      food.calories * scaleFactor,
      food.protein * scaleFactor,
      food.fats * scaleFactor,
      food.carbs * scaleFactor
    );
    
    toast({
      title: "Food added",
      description: `${quantity}${food.unit || 'g'} of ${food.name} has been added to your meal plan.`,
    });
    navigate('/');
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
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Select your meal</h1>
          </div>
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
            <RecipeInput
              recipeInput={recipeInput}
              onRecipeInputChange={setRecipeInput}
              onSearch={handleRecipeSearch}
              recipeResults={recipeResults}
              onAddFood={handleAddFood}
            />
          ) : (
            <SearchResults
              isLoading={isLoading}
              error={error}
              foods={foods}
              debouncedSearch={debouncedSearch}
              onAddFood={handleAddFood}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMeal;
