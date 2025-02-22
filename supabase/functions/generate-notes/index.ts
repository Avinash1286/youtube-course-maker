
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GOOGLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoTitle, videoId } = await req.json();

    if (!videoTitle || !videoId) {
      throw new Error('Video title and ID are required');
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create interactive educational notes for the video titled: "${videoTitle}". 
            Include:
            1. An introduction section explaining the topic
            2. 3 main sections, each with:
               - A title
               - Educational content
               - 2 multiple choice questions (with 4 options each)
               - 1 true/false question
               - 1 fill in the blank question
            
            Format the response as a JSON object with this structure:
            {
              "introduction": "text",
              "sections": [
                {
                  "id": "section1",
                  "title": "text",
                  "content": "text",
                  "questions": [
                    {
                      "id": "q1",
                      "type": "mcq",
                      "question": "text",
                      "options": [{"id": "a", "text": "text"}, ...],
                      "correctAnswer": "optionId"
                    },
                    {
                      "id": "q2",
                      "type": "trueFalse",
                      "question": "text",
                      "correctAnswer": "true/false"
                    },
                    {
                      "id": "q3",
                      "type": "fillInBlank",
                      "question": "text",
                      "correctAnswer": "text"
                    }
                  ]
                }
              ]
            }`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Failed to generate notes');
    }

    const notesText = data.candidates[0].content.parts[0].text;
    const notes = JSON.parse(notesText.substring(
      notesText.indexOf('{'),
      notesText.lastIndexOf('}') + 1
    ));
    
    return new Response(JSON.stringify({ notes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-notes function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
