require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateVideoContent(topic, niche = "default", optionsCount = 3) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Customize the prompt based on the niche
    let nicheContext = "";
    if (niche !== "default") {
      nicheContext = `The content should be specifically tailored for the ${niche} niche audience. Use terminology, references, and examples that would resonate with ${niche} enthusiasts.`;
    }

    const prompt = `Generate ${optionsCount} different creative content plans for the topic: "${topic}"
    ${nicheContext}
    
    For each option, please provide:
    1. An engaging title (maximum 60 characters) that would appeal to ${niche !== "default" ? `${niche} enthusiasts` : "a general audience"}
    2. A SEO friendly  descriptions (150-200 words) that includes relevant keywords for ${niche !== "default" ? `the ${niche} niche` : "this topic"}
    3. 25 trending hashtags related to this topic that could help the video gain visibility ${niche !== "default" ? `in the ${niche} community` : ""}
    
    Make each option distinctly different in approach, style, or angle.
    
    Format the response as a JSON array with ${optionsCount} objects, each containing:
    - title (string)
    - description (string)
    - hashtags (array of strings, each without the # symbol)
    
    Make sure the hashtags are relevant, trending, and would help the video reach its target audience.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      // Try to parse the response as JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : text;
      
      const parsedContent = JSON.parse(jsonString);
      
      // Ensure we have an array of options
      if (!Array.isArray(parsedContent)) {
        throw new Error('Response is not an array');
      }
      
      // Process each option
      const contentOptions = parsedContent.map(option => ({
        title: option.title || `Video about ${topic}`,
        description: option.description || `This is a video about ${topic}.`,
        hashtags: Array.isArray(option.hashtags) 
          ? option.hashtags.map(tag => tag.startsWith('#') ? tag.substring(1) : tag)
          : generateDefaultHashtags(topic)
      }));
      
      // If we don't have enough options, generate more
      while (contentOptions.length < optionsCount) {
        contentOptions.push({
          title: `Alternative Video about ${topic} #${contentOptions.length + 1}`,
          description: `This is another approach to creating content about ${topic}.`,
          hashtags: generateDefaultHashtags(topic)
        });
      }
      
      return contentOptions;
    } catch (error) {
      console.error('Failed to parse Gemini response as JSON array:', error);
      console.log('Raw response:', text);
      
      // If JSON parsing fails, try to extract multiple options manually
      const contentOptions = [];
      
      // Split by "Option 1", "Option 2", etc.
      const optionSections = text.split(/Option \d+:|Content Plan \d+:|Video \d+:/i);
      
      // Process each section
      for (let i = 1; i < optionSections.length && contentOptions.length < optionsCount; i++) {
        const section = optionSections[i];
        const lines = section.split('\n');
        
        // Extract title, description, and hashtags
        let title = '';
        let description = '';
        let hashtags = [];
        
        // Try to extract title
        const titleLine = lines.find(line => line.includes('Title:') || line.includes('"title"'));
        if (titleLine) {
          title = titleLine.replace(/.*Title:|\s*"title"\s*:\s*"|".*$/gi, '').trim();
        }
        
        // Try to extract description
        const descIndex = lines.findIndex(line => 
          line.includes('Description:') || line.includes('"description"'));
        if (descIndex >= 0) {
          let endIndex = lines.findIndex((line, i) => 
            i > descIndex && (line.includes('Hashtags:') || line.includes('"hashtags"')));
          if (endIndex === -1) endIndex = lines.length;
          description = lines.slice(descIndex + 1, endIndex)
            .join(' ')
            .replace(/^\s*"|\s*"$/g, '')
            .trim();
        }
        
        // Try to extract hashtags
        const hashtagsStartIndex = lines.findIndex(line => 
          line.includes('Hashtags:') || line.includes('"hashtags"'));
        if (hashtagsStartIndex >= 0) {
          hashtags = lines.slice(hashtagsStartIndex + 1)
            .filter(line => line.trim().match(/^\d+\.|\-|\*|#/) || line.includes(':'))
            .map(line => {
              // Remove list markers, quotes, and # symbols
              const cleaned = line.replace(/^\s*\d+\.|\-|\*|\s*"|\s*"$|^\s*#/g, '').trim();
              // Remove any remaining # symbols
              return cleaned.startsWith('#') ? cleaned.substring(1) : cleaned;
            })
            .filter(line => line.length > 0);
        }
        
        contentOptions.push({
          title: title || `Video option ${i} about ${topic}`,
          description: description || `This is video option ${i} about ${topic}.`,
          hashtags: hashtags.length > 0 ? hashtags : generateDefaultHashtags(topic)
        });
      }
      
      // If we couldn't extract options, create default ones
      if (contentOptions.length === 0) {
        for (let i = 0; i < optionsCount; i++) {
          contentOptions.push({
            title: `Video option ${i+1} about ${topic}`,
            description: `This is video option ${i+1} about ${topic}.`,
            hashtags: generateDefaultHashtags(topic)
          });
        }
      }
      
      return contentOptions;
    }
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

// Helper function to generate default hashtags if parsing fails
function generateDefaultHashtags(topic) {
  const words = topic.toLowerCase().split(/\s+/);
  const baseHashtags = [
    topic.replace(/\s+/g, ''),
    ...words,
    'video',
    'youtube',
    'content',
    'trending',
    'viral',
    'socialmedia',
    'creator',
    'influencer'
  ];
  
  // Filter out duplicates and empty strings
  return [...new Set(baseHashtags.filter(tag => tag.length > 0))];
}

// Export the function
module.exports = { generateVideoContent }; 