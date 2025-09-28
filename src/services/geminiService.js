import { GoogleGenerativeAI } from '@google/generative-ai';
import databaseService from './databaseService.js';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      this.initialized = true;
      
      console.log('✅ Gemini service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Gemini service:', error.message);
      throw error;
    }
  }

  async categorizeRequest(requestData) {
    if (!this.initialized) {
      await this.initialize();
    }

    const { name, location, request_text } = requestData;
    
    // Create a structured prompt for categorization
    const prompt = `
Please categorize this aid request into one of these categories: medical, food, shelter, water, other

Request Details:
- Name: ${name || 'Anonymous'}
- Location: ${location}
- Request: ${request_text}

Based on the request text, respond with ONLY the category name (medical, food, shelter, water, or other) in lowercase. No additional text or explanation.
    `.trim();

    try {
      console.log('🤖 Sending request to Gemini for categorization...');
      console.log('📝 Request prompt:', prompt);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const category = response.text().trim().toLowerCase();

      // Validate the category
      const validCategories = ['medical', 'food', 'shelter', 'water', 'other'];
      const finalCategory = validCategories.includes(category) ? category : 'other';

      if (category !== finalCategory) {
        console.warn(`⚠️ Invalid category "${category}" returned, defaulting to "other"`);
      }

      const processedRequest = {
        id: Date.now().toString(),
        name: name || 'Anonymous',
        location: location,
        request_text: request_text,
        category: finalCategory,
        status: 'unclaimed',
        created_at: new Date().toISOString()
      };

      // Log the results to terminal for testing
      console.log('📊 Request Processing Results:');
      console.log('================================');
      console.log(`ID: ${processedRequest.id}`);
      console.log(`Name: ${processedRequest.name}`);
      console.log(`Location: ${processedRequest.location}`);
      console.log(`Request: ${processedRequest.request_text}`);
      console.log(`🏷️ AI Category: ${processedRequest.category}`);
      console.log(`Status: ${processedRequest.status}`);
      console.log(`📅 Created: ${processedRequest.created_at}`);
      console.log('================================');

      // Save to database
      try {
        await databaseService.addRequest(processedRequest);
        console.log('💾 Request saved to database successfully');
      } catch (dbError) {
        console.error('❌ Failed to save request to database:', dbError);
        // Don't throw here - we still want to return the processed request
      }

      return processedRequest;
      
    } catch (error) {
      console.error('❌ Error during Gemini categorization:', error);
      
      // Fallback to 'other' category if API fails
      const fallbackRequest = {
        id: Date.now().toString(),
        name: name || 'Anonymous',
        location: location,
        request_text: request_text,
        category: 'other',
        status: 'unclaimed',
        created_at: new Date().toISOString(),
        error: 'AI categorization failed, using fallback category'
      };

      console.log('📊 Fallback Request Processing Results:');
      console.log('================================');
      console.log(`ID: ${fallbackRequest.id}`);
      console.log(`Name: ${fallbackRequest.name}`);
      console.log(`Location: ${fallbackRequest.location}`);
      console.log(`Request: ${fallbackRequest.request_text}`);
      console.log(`🏷️ Fallback Category: ${fallbackRequest.category}`);
      console.log(`Status: ${fallbackRequest.status}`);
      console.log(`📅 Created: ${fallbackRequest.created_at}`);
      console.log(`❌ Error: ${fallbackRequest.error}`);
      console.log('================================');

      // Still save fallback request to database
      try {
        await databaseService.addRequest(fallbackRequest);
        console.log('💾 Fallback request saved to database');
      } catch (dbError) {
        console.error('❌ Failed to save fallback request to database:', dbError);
      }

      throw error;
    }
  }

  isInitialized() {
    return this.initialized;
  }
}

// Create and export a singleton instance
const geminiService = new GeminiService();
export default geminiService;
