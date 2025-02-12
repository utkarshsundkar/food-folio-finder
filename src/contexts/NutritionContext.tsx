
import { createContext, useContext, useState, ReactNode } from "react";

interface NutritionContextType {
  calorieTarget: number;
  currentCalories: number;
  macros: {
    protein: { current: number; target: number };
    fats: { current: number; target: number };
    carbs: { current: number; target: number };
  };
  updateCalorieTarget: (target: number) => void;
  addFood: (calories: number, protein: number, fats: number, carbs: number) => void;
  resetDaily: () => void;
}

const NutritionContext = createContext<NutritionContextType | null>(null);

export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const [calorieTarget, setCalorieTarget] = useState(2213);
  const [currentCalories, setCurrentCalories] = useState(0);
  const [macros, setMacros] = useState({
    protein: { current: 0, target: 90 },
    fats: { current: 0, target: 70 },
    carbs: { current: 0, target: 110 }
  });

  const updateCalorieTarget = (target: number) => {
    setCalorieTarget(target);
    // Update macro targets based on calorie target
    const proteinTarget = Math.round((target * 0.3) / 4); // 30% of calories from protein
    const fatsTarget = Math.round((target * 0.25) / 9); // 25% of calories from fat
    const carbsTarget = Math.round((target * 0.45) / 4); // 45% of calories from carbs
    
    setMacros(prev => ({
      protein: { ...prev.protein, target: proteinTarget },
      fats: { ...prev.fats, target: fatsTarget },
      carbs: { ...prev.carbs, target: carbsTarget }
    }));
  };

  const addFood = (calories: number, protein: number, fats: number, carbs: number) => {
    setCurrentCalories(prev => prev + calories);
    setMacros(prev => ({
      protein: { ...prev.protein, current: prev.protein.current + protein },
      fats: { ...prev.fats, current: prev.fats.current + fats },
      carbs: { ...prev.carbs, current: prev.carbs.current + carbs }
    }));
  };

  const resetDaily = () => {
    setCurrentCalories(0);
    setMacros(prev => ({
      protein: { ...prev.protein, current: 0 },
      fats: { ...prev.fats, current: 0 },
      carbs: { ...prev.carbs, current: 0 }
    }));
  };

  return (
    <NutritionContext.Provider 
      value={{ 
        calorieTarget, 
        currentCalories, 
        macros, 
        updateCalorieTarget, 
        addFood,
        resetDaily 
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error("useNutrition must be used within a NutritionProvider");
  }
  return context;
};
