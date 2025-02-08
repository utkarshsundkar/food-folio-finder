
const API_KEY = "AIzaSyBBN40RwIPzX1R_lYj6DX6TqVeGN1rHyfk";

interface FoodData {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, baseDelay = 2000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (response.status === 503 || response.status === 429) {
        const backoffDelay = baseDelay * Math.pow(2, i);
        console.log(`API overloaded, retrying in ${backoffDelay}ms...`);
        await delay(backoffDelay);
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(baseDelay * Math.pow(2, i));
    }
  }
  throw new Error("Max retries reached");
}

export async function searchFood(query: string): Promise<FoodData[]> {
  try {
    await delay(2000); // Base delay before first attempt

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
      }
    );

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error("Service is temporarily unavailable. Please try again in a few moments.");
      }
      if (response.status === 429) {
        throw new Error("Rate limit exceeded, please try again in a few moments");
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
