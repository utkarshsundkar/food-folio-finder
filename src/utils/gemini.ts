
const API_KEY = "AIzaSyBBN40RwIPzX1R_lYj6DX6TqVeGN1rHyfk";

interface FoodData {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, baseDelay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) return response;
      
      if (response.status === 429) {
        console.log(`Rate limited, attempt ${i + 1} of ${retries}. Waiting before retry...`);
        await delay(baseDelay * Math.pow(1.5, i)); // Using 1.5 instead of 2 for faster backoff
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(baseDelay * Math.pow(1.5, i));
    }
  }
  throw new Error("Max retries reached");
}

export async function searchFood(query: string): Promise<FoodData[]> {
  try {
    // Reduced initial delay
    await delay(500);

    const response = await fetchWithRetry(
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
      },
      2,  // Reduced number of retries
      1000 // Reduced base delay between retries
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("The service is currently busy. Please wait a moment and try again.");
      }
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Unexpected API response format");
    }

    const text = data.candidates[0].content.parts[0].text;
    const jsonStartIndex = text.indexOf("[");
    const jsonEndIndex = text.lastIndexOf("]") + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("Could not find valid JSON in response");
    }

    const jsonStr = text.slice(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error searching food:", error);
    throw error;
  }
}
