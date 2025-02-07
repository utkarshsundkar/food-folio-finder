
const API_KEY = "AIzaSyBBN40RwIPzX1R_lYj6DX6TqVeGN1rHyfk";

interface FoodData {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

export async function searchFood(query: string): Promise<FoodData[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Given the food query "${query}", provide nutritional information in this exact JSON format:
              [
                {
                  "name": "Food Name",
                  "calories": number (per 100g),
                  "protein": number in grams,
                  "fats": number in grams,
                  "carbs": number in grams
                }
              ]
              Return up to 5 relevant food items. Only return the JSON, no other text.`
            }]
          }]
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const jsonStartIndex = text.indexOf("[");
    const jsonEndIndex = text.lastIndexOf("]") + 1;
    const jsonStr = text.slice(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error searching food:", error);
    return [];
  }
}
