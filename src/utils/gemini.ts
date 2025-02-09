
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
      
      // If successful, return the response
      if (response.ok) return response;
      
      // Handle rate limiting specifically
      if (response.status === 429) {
        console.log(`Rate limited, attempt ${i + 1} of ${retries}. Waiting before retry...`);
        // Exponential backoff: wait longer with each retry
        const backoffDelay = baseDelay * Math.pow(2, i);
        await delay(backoffDelay);
        continue;
      }
      
      // For other errors, throw them
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
    // Add initial delay before first attempt
    await delay(1000);

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
      3,  // Number of retries
      2000 // Base delay between retries
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
