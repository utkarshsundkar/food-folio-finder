
import { cn } from "@/lib/utils";

interface MealTypeFilterProps {
  selected: string;
  onSelect: (type: string) => void;
}

export const MealTypeFilter = ({ selected, onSelect }: MealTypeFilterProps) => {
  const types = ["All", "My Recipes", "Breakfast", "Lunch", "Dinner"];

  return (
    <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selected === type
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {type}
        </button>
      ))}
    </div>
  );
};
