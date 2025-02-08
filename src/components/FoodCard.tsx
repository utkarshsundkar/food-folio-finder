
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onAdd: (quantity: number) => void;
}

type UnitConversion = {
  [key: string]: number; // conversion factor to grams
};

const UNIT_CONVERSIONS: UnitConversion = {
  g: 1,
  oz: 28.3495,
  cup: 128, // Approximate average for general use
  tbsp: 15,
  tsp: 5,
};

export const FoodCard = ({ name, calories, protein, fats, carbs, onAdd }: FoodCardProps) => {
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState("g");

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(Math.max(0, value));
  };

  const adjustQuantity = (amount: number) => {
    setQuantity(prev => Math.max(0, prev + amount));
  };

  // Calculate macros based on quantity and unit
  const gramsEquivalent = quantity * UNIT_CONVERSIONS[unit];
  const scaleFactor = gramsEquivalent / 100;
  const scaledCalories = Math.round(calories * scaleFactor);
  const scaledProtein = Math.round(protein * scaleFactor);
  const scaledFats = Math.round(fats * scaleFactor);
  const scaledCarbs = Math.round(carbs * scaleFactor);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="inline-block">🔥</span>
            <span>{scaledCalories} kcal - {quantity}{unit}</span>
          </div>
        </div>
        <button
          onClick={() => onAdd(gramsEquivalent)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 mb-4">
        <button
          onClick={() => adjustQuantity(-10)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-20 text-center border rounded-md px-2 py-1"
          min="0"
        />
        <Select value={unit} onValueChange={setUnit}>
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

      <div className="flex justify-between mt-4 px-4">
        <Macro label="Protein" amount={scaledProtein} color="#4CAF50" />
        <Macro label="Fats" amount={scaledFats} color="#FF5722" />
        <Macro label="Carbs" amount={scaledCarbs} color="#FFC107" />
      </div>
    </div>
  );
};
