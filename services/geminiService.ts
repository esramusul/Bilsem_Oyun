import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Helper to get fresh instance
const getAI = () => new GoogleGenAI({ apiKey });

// Helper for delay to avoid Rate Limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateCharacterImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const model = 'gemini-2.5-flash-image'; 
    
    const refinedPrompt = `
      Draw a cute, colorful, 3D cartoon style illustration for a children's game.
      Subject: ${prompt}.
      Style: Vibrant colors, soft lighting, Pixar-like, isolated on a white background.
      Ensure it is kid-friendly and cute. Full body view.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: refinedPrompt }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
       }
    }
    return null;

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};

export const generateColoringOutline = async (prompt: string): Promise<string | null> => {
    try {
        const ai = getAI();
        const model = 'gemini-2.5-flash-image';
        const refinedPrompt = `
          Create a black and white simple line art coloring page for a 5 year old child.
          Subject: ${prompt}.
          Style: Thick lines, simple shapes, white background, no shading.
        `;
    
        const response = await ai.models.generateContent({
          model: model,
          contents: { parts: [{ text: refinedPrompt }] }
        });
    
        for (const part of response.candidates?.[0]?.content?.parts || []) {
           if (part.inlineData) {
             return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
           }
        }
        return null;
    } catch (error) {
        console.error("Gemini Outline Gen Error:", error);
        return null;
    }
}

export const generateAnimationFrames = async (charDesc: string, actionInput: string): Promise<string[]> => {
  const ai = getAI();
  const model = 'gemini-2.5-flash-image';
  const frames: string[] = [];
  
  const actionLower = actionInput.toLowerCase();
  
  // DIRECTORIAL PROMPTS: Define specific physical poses based on keywords to ensure movement consistency
  let poses = [
      `standing still, ready to start`,
      `performing the action`,
      `finishing the action`
  ];

  // Logic for specific actions to make them look real
  if (actionLower.includes('dans') || actionLower.includes('dance') || actionLower.includes('oyna')) {
      poses = [
          `arms raised high above head, leaning to the left, happy face, one leg up`, // Pose 1
          `crouching down low, arms wide open, big smile`, // Pose 2
          `jumping in the air, legs spread star-shape, hands waving` // Pose 3
      ];
  } else if (actionLower.includes('zıpla') || actionLower.includes('jump') || actionLower.includes('uç')) {
       poses = [
          `crouching down low, preparing to jump`, // Pose 1
          `high in the air, legs tucked in, flying pose`, // Pose 2
          `landing on the ground, arms out for balance` // Pose 3
      ];
  } else if (actionLower.includes('yürü') || actionLower.includes('koş') || actionLower.includes('git')) {
       poses = [
          `leaning forward, left foot forward, right arm back`, // Pose 1
          `mid-stride, both feet off ground, running fast`, // Pose 2
          `leaning forward, right foot forward, left arm back` // Pose 3
      ];
  }

  // Base prompt enforcing strict consistency
  const basePrompt = `
      Character: ${charDesc}. 
      Style: 3D Cute Cartoon, Pixar Style, White Background. 
      Camera: Front View, Full Body, Fixed Camera Angle.
      Constraint: KEEP CHARACTER APPEARANCE EXACTLY THE SAME.
      Pose: `;

  const prompts = [
      basePrompt + poses[0],
      basePrompt + poses[1],
      basePrompt + poses[2]
  ];

  try {
      for (let i = 0; i < prompts.length; i++) {
          const p = prompts[i];
          console.log(`Generating frame ${i + 1} with pose: ${poses[i]}`);
          
          try {
              const response = await ai.models.generateContent({
                  model: model,
                  contents: { parts: [{ text: p }] }
              });

              const part = response.candidates?.[0]?.content?.parts?.[0];
              if (part && part.inlineData) {
                  frames.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
              }
          } catch (innerError) {
              console.warn(`Frame ${i + 1} generation failed:`, innerError);
          }

          // CRITICAL: Wait 2.5 seconds between requests to reset the Rate Limit counter for Free Tier
          if (i < prompts.length - 1) {
              await delay(2500); 
          }
      }
  } catch (error) {
      console.error("Animation Gen Error:", error);
  }

  return frames;
};