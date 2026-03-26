import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AIResponse, CareerTip, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeCareer(profile: UserProfile): Promise<AIResponse> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following user profile and suggest 3 best career paths.
    User Profile:
    - Name: ${profile.name}
    - Skills: ${profile.skills}
    - Interests: ${profile.interests}
    - Education: ${profile.education}
    - Goal: ${profile.goal}
    ${profile.experience ? `- Experience: ${profile.experience}` : ""}
    ${profile.testResults ? `- Test Results: ${JSON.stringify(profile.testResults)}` : ""}

    For each career path, provide:
    1. title, description, matchScore (0-100), why it matches.
    2. jobRoles: array of { title, skills, difficulty (Easy/Medium/Hard) }.
    3. courses: array of { title, provider, type (Degree/Certification/Course), link }.
    4. colleges: array of { name, location, reputation, link } (suggest real colleges).
    5. abroadStudy: array of { country, topUniversities, benefits, averageCost } (suggest real countries and universities).
    6. realJobLinks: array of { title, company, location, link } (suggest real job links).
    7. roadmap: array of { step, title, description, duration }.

    Use Google Search to find real and up-to-date information for colleges, abroad study, and job links.
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                why: { type: Type.STRING },
                jobRoles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                      difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
                    }
                  }
                },
                courses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      provider: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["Degree", "Certification", "Course"] },
                      link: { type: Type.STRING }
                    }
                  }
                },
                colleges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      location: { type: Type.STRING },
                      reputation: { type: Type.STRING },
                      link: { type: Type.STRING }
                    }
                  }
                },
                abroadStudy: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      country: { type: Type.STRING },
                      topUniversities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      benefits: { type: Type.STRING },
                      averageCost: { type: Type.STRING }
                    }
                  }
                },
                realJobLinks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      company: { type: Type.STRING },
                      location: { type: Type.STRING },
                      link: { type: Type.STRING }
                    }
                  }
                },
                roadmap: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      step: { type: Type.NUMBER },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      duration: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}") as AIResponse;
}

export async function startInterviewSession(role: string, profile: UserProfile): Promise<{ questions: string[] }> {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate 5 interview questions for a ${role} position. Use the user's profile to make them personalized.
  User Profile: ${JSON.stringify(profile)}
  Return the questions as a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return { questions: JSON.parse(response.text || "[]") };
}

export async function getInterviewFeedback(question: string, answer: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `Question: ${question}\nAnswer: ${answer}\nProvide constructive feedback on this interview answer.`;
  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });
  return response.text || "No feedback available.";
}

export async function getCareerTips(): Promise<CareerTip[]> {
  const model = "gemini-3-flash-preview";
  const prompt = "Generate 4 career tips (one for each category: Interview, Resume, Skill, General). Each tip should have a title and content.";
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: ["Interview", "Resume", "Skill", "General"] },
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function chatWithAdvisor(history: ChatMessage[], profile: UserProfile): Promise<string> {
  const model = "gemini-3-flash-preview";
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are a career advisor. Use the user's profile to give personalized advice.
      User Profile: ${JSON.stringify(profile)}`
    }
  });

  const lastMessage = history[history.length - 1].text;
  const response = await chat.sendMessage({ message: lastMessage });
  return response.text || "I'm sorry, I couldn't process that.";
}
