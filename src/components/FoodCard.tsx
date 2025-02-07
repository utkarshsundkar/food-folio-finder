
import { Plus } from "lucide-react";

interface MacroProps {
  label: string;
  amount: number;
  color: string;
}

const Macro = ({ label, amount, color }: MacroProps) => (
  <div className="flex flex-col items-center">
    <div className="h-1 w-12 mb-1 rounded-full" style={{ backgroundColor: color }} />
    <div className="text-sm font-medium">{amount}g</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

interface FoodCardProps {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  onAdd: () => void;
}

export const FoodCard = ({ name, calories, protein, fats, carbs, onAdd }: FoodCardProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="inline-block">🔥</span>
            <span>{calories} kcal -100g</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="flex justify-between mt-4 px-4">
        <Macro label="Protein" amount={protein} color="#4CAF50" />
        <Macro label="Fats" amount={fats} color="#FF5722" />
        <Macro label="Carbs" amount={carbs} color="#FFC107" />
      </div>
    </div>
  );
};
