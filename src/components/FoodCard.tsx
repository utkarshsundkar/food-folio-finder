
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
  unit?: string;
  quantity?: number;
}

type UnitConversion = {
  [key: string]: number; // conversion factor to grams
};

const UNIT_CONVERSIONS: UnitConversion = {
  g: 1,
  oz: 28.3495,
  cup: 128,
  tbsp: 15,
  tsp: 5,
  piece: 1,
  slice: 1,
};

export const FoodCard = ({ 
  name, 
  calories, 
  protein, 
  fats, 
  carbs, 
  onAdd,
  unit = "g",
  quantity = 1
}: FoodCardProps) => {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  const [selectedUnit, setSelectedUnit] = useState(unit);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setSelectedQuantity(Math.max(0, value));
  };

  const adjustQuantity = (amount: number) => {
    setSelectedQuantity(prev => Math.max(0, prev + amount));
  };

  const displayUnit = unit === "piece" || unit === "slice" ? "" : unit;
  const displayQuantity = selectedQuantity === 1 ? name : `${selectedQuantity} ${name}`;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{displayQuantity}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="inline-block">🔥</span>
            <span>{calories} kcal {displayUnit && `- ${selectedQuantity}${displayUnit}`}</span>
          </div>
        </div>
        <button
          onClick={() => onAdd(selectedQuantity)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 mb-4">
        <button
          onClick={() => adjustQuantity(-1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={selectedQuantity}
          onChange={handleQuantityChange}
          className="w-20 text-center border rounded-md px-2 py-1"
          min="0"
        />
        {unit === "g" && (
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
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
        )}
      </div>

      <div className="flex justify-between mt-4 px-4">
        <Macro label="Protein" amount={protein} color="#4CAF50" />
        <Macro label="Fats" amount={fats} color="#FF5722" />
        <Macro label="Carbs" amount={carbs} color="#FFC107" />
      </div>
    </div>
  );
};
