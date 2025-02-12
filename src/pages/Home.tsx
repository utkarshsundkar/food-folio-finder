import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { CalorieTargetDialog } from "@/components/CalorieTargetDialog";
import { useNutrition } from "@/contexts/NutritionContext";

const Home = () => {
  const { calorieTarget, currentCalories, macros, updateCalorieTarget } = useNutrition();

  const calculateProgress = () => {
    return Math.round((currentCalories / calorieTarget) * 100);
  };

  const progressOffset = 553 - ((calculateProgress() / 100) * 553);

  return (
    <div className="max-w-md mx-auto px-4 py-6 bg-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/9ff2a684-4505-4070-9964-b66e16f19a0a.png" 
            alt="Profile" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="text-gray-500 text-sm">Welcome</div>
            <div className="font-semibold">Utkarsh Sundkar</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Search className="w-6 h-6 text-gray-600" />
          <Bell className="w-6 h-6 text-gray-600" />
        </div>
      </header>

      {/* Calories Progress */}
      <div className="mb-8">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-3xl font-bold flex items-center gap-2">
              {currentCalories} Kcal
              <CalorieTargetDialog onUpdateTarget={updateCalorieTarget} />
            </div>
            <div className="text-gray-500 text-sm">of {calorieTarget} kcal</div>
          </div>
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#FFE5E5"
              strokeWidth="16"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="16"
              strokeDasharray="553"
              strokeDashoffset={progressOffset}
            />
          </svg>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <div className="text-sm font-medium">Protein</div>
            <div className="h-2 bg-green-200 rounded-full mt-1 mb-1">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${(macros.protein.current / macros.protein.target) * 100}%` }} 
              />
            </div>
            <div className="text-sm text-gray-500">
              {macros.protein.current}/{macros.protein.target}g
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Fats</div>
            <div className="h-2 bg-orange-200 rounded-full mt-1 mb-1">
              <div 
                className="h-full bg-orange-500 rounded-full" 
                style={{ width: `${(macros.fats.current / macros.fats.target) * 100}%` }} 
              />
            </div>
            <div className="text-sm text-gray-500">
              {macros.fats.current}/{macros.fats.target}g
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Carbs</div>
            <div className="h-2 bg-blue-200 rounded-full mt-1 mb-1">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${(macros.carbs.current / macros.carbs.target) * 100}%` }} 
              />
            </div>
            <div className="text-sm text-gray-500">
              {macros.carbs.current}/{macros.carbs.target}g
            </div>
          </div>
        </div>

        <div className="text-xl font-semibold mb-4">Track your diet journey</div>
        <div className="text-gray-500 mb-4">Today Calorie: {currentCalories}</div>

        {/* Meal Buttons */}
        <div className="space-y-3">
          <Link to="/add-meal/breakfast" className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-xl">☕</span>
              </div>
              <div>
                <div className="font-medium">Add Breakfast</div>
                <div className="text-sm text-gray-500">Recommended 450-650 cal</div>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">+</span>
            </div>
          </Link>

          <Link to="/add-meal/lunch" className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🍜</span>
              </div>
              <div>
                <div className="font-medium">Add Lunch</div>
                <div className="text-sm text-gray-500">Recommended 450-650 cal</div>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">+</span>
            </div>
          </Link>

          <Link to="/add-meal/dinner" className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🍽️</span>
              </div>
              <div>
                <div className="font-medium">Add Dinner</div>
                <div className="text-sm text-gray-500">Recommended 450-650 cal</div>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">+</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Water Tracking */}
      <div className="mb-8">
        <div className="text-xl font-semibold mb-4">Water</div>
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">400ml/4000ml</div>
            <div className="text-sm text-gray-500">10%</div>
          </div>
          <div className="flex gap-2">
            {Array(8).fill(null).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-12 rounded-lg ${i < 1 ? 'bg-blue-500' : 'bg-blue-100'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div>
        <div className="text-xl font-semibold mb-4">Activity</div>
        <div className="bg-red-50 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🏃</span>
            </div>
            <div>
              <div className="font-medium">Activities</div>
              <div className="text-sm text-gray-500">2 Activities</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">532kcal Burnt</div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <button className="flex flex-col items-center text-blue-500">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <span className="text-xl">🍽️</span>
            <span className="text-xs">Meals</span>
          </button>
          <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center -mt-6 text-white text-2xl">
            +
          </div>
          <button className="flex flex-col items-center text-gray-400">
            <span className="text-xl">📊</span>
            <span className="text-xs">Stats</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <span className="text-xl">👤</span>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
