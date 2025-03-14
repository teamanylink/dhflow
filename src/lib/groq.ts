import { Groq } from 'groq-sdk';
import { ADHDProfile } from '../types';

let groqClient: Groq | null = null;

// Initialize the Groq client
export function initGroq() {
  if (!groqClient) {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    
    if (!apiKey) {
      console.error('GROQ API key is missing');
      return null;
    }
    
    groqClient = new Groq({ apiKey });
  }
  
  return groqClient;
}

// Generate personalized ADHD management tips based on user profile
export async function generateTips(profile: ADHDProfile, contentType: string = 'strategies'): Promise<string> {
  const client = initGroq();
  
  if (!client) {
    throw new Error('Failed to initialize Groq client');
  }

  // Map content types to specific prompt instructions
  const contentPrompts: Record<string, string> = {
    strategies: "specific actionable strategies that will help this person manage their ADHD symptoms",
    routines: "effective daily routines and habits that can help this person manage their ADHD",
    environment: "environmental adjustments and workspace organization tips for this ADHD profile",
    tools: "digital and physical tools, apps, and resources that would be beneficial for this ADHD profile",
    communication: "communication strategies and social skills tips for this ADHD profile"
  };

  const promptInstruction = contentPrompts[contentType] || contentPrompts.strategies;
  
  const adhdTypeContext = profile.adhdType ? 
    `They have ${profile.adhdType} type ADHD.` : 
    '';
  
  const scoresContext = `
    Their focus score is ${profile.focusScore}/10.
    Their organization score is ${profile.organizationScore}/10.
  `;
  
  const challengesContext = profile.primaryChallenges?.length > 0 ?
    `Their primary challenges are: ${profile.primaryChallenges.join(', ')}.` :
    'They have general ADHD challenges.';

  const prompt = `
    I need personalized ADHD management tips for a person with the following profile:
    
    ${adhdTypeContext}
    ${scoresContext}
    ${challengesContext}
    
    Based on this profile, please provide 3-5 ${promptInstruction}.
    
    Format your response in markdown with bullet points for each tip.
    Keep your response concise but specific and actionable.
    Each tip should directly address their profile and challenges.
    Do not include any introductory text, just start with the bullet points.
  `;

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert ADHD coach with extensive knowledge about different ADHD types, symptoms, and management strategies.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate tips at this time.';
  } catch (error) {
    console.error('Error generating ADHD tips:', error);
    throw new Error('Failed to generate ADHD management tips');
  }
}

// Test function to verify Groq API connection
export async function testGroqConnection(): Promise<string> {
  const client = initGroq();
  
  if (!client) {
    throw new Error('Failed to initialize Groq client');
  }

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Provide 3 quick tips for managing ADHD symptoms.' }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || 'API connection successful, but no content returned.';
  } catch (error) {
    console.error('Error testing Groq connection:', error);
    throw new Error(`Groq API connection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}