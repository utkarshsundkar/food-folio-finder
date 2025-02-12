
import { FoodCard } from "@/components/FoodCard";
import { FoodItem } from "@/utils/foodUtils";

interface SearchResultsProps {
  isLoading: boolean;
  error: unknown;
  foods: FoodItem[];
  debouncedSearch: string;
  onAddFood: (food: FoodItem, quantity: number) => void;
}

export const SearchResults = ({
  isLoading,
  error,
  foods,
  debouncedSearch,
  onAddFood,
}: SearchResultsProps) => {
  if (isLoading) {
    return <div className="text-center text-gray-500">Searching...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Please wait a moment before searching again
      </div>
    );
  }

  if (foods.length > 0) {
    return (
      <>
        {foods.map((food, index) => (
          <FoodCard
            key={index}
            {...food}
            onAdd={(quantity) => onAddFood(food, quantity)}
          />
        ))}
      </>
    );
  }

  if (debouncedSearch.length > 2) {
    return <div className="text-center text-gray-500">No foods found</div>;
  }

  return null;
};
