const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callGemini(systemPrompt, userMessage) {

const response = await fetch(GROQ_URL,{
method:'POST',
headers:{
'Content-Type':'application/json',
'Authorization':`Bearer ${GROQ_API_KEY}`
},
body:JSON.stringify({
model:'llama-3.3-70b-versatile',
messages:[
{role:'system',content:systemPrompt},
{role:'user',content:userMessage}
],
temperature:0.3
})
});

const data = await response.json();

if(data.error){
throw new Error(data.error.message);
}

return data.choices?.[0]?.message?.content || "No response";

}
