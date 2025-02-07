
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { MealTypeFilter } from "@/components/MealTypeFilter";
import { FoodCard } from "@/components/FoodCard";
import { searchFood } from "@/utils/gemini";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("All");
  const { toast } = useToast();

  const { data: foods = [], isLoading } = useQuery({
    queryKey: ["foods", search],
    queryFn: () => searchFood(search),
    enabled: search.length > 2,
  });

  const handleAddFood = (food: any) => {
    toast({
      title: "Food added",
      description: `${food.name} has been added to your meal plan.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Select your meal</h1>
          </div>
          <SearchBar value={search} onChange={setSearch} />
        </header>

        <MealTypeFilter selected={selectedMealType} onSelect={setSelectedMealType} />

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-500">Searching...</div>
          ) : foods.length > 0 ? (
            foods.map((food, index) => (
              <FoodCard
                key={index}
                {...food}
                onAdd={() => handleAddFood(food)}
              />
            ))
          ) : search.length > 2 ? (
            <div className="text-center text-gray-500">No foods found</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Index;
