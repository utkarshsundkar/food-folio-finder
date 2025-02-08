
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { MealTypeFilter } from "@/components/MealTypeFilter";
import { FoodCard } from "@/components/FoodCard";
import { searchFood } from "@/utils/gemini";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [recipeInput, setRecipeInput] = useState("");
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
      description: `${quantity}g of ${food.name} has been added to your meal plan.`,
    });
  };

  const handleRecipeSearch = () => {
    if (!recipeInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipe description",
        variant: "destructive",
      });
      return;
    }
    // Here you would typically process the recipe input
    // For now, just show a success message
    toast({
      title: "Recipe processed",
      description: "Your recipe is being analyzed",
    });
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
            <div className="space-y-4">
              <Input
                value={recipeInput}
                onChange={(e) => setRecipeInput(e.target.value)}
                placeholder="A toast with ham and cheese, an apple, a banana and a cappuccino"
                className="w-full"
              />
              <button
                onClick={handleRecipeSearch}
                className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
              >
                Run Search
              </button>
            </div>
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
