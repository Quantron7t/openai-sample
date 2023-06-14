/***
 * Common issues with sending prompts to OpenAI
 * https://www.reddit.com/r/GPT3/comments/tpmt48/why_do_i_always_get_this_error_message_when/
 * Stop sequence - https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences
 * '\n' 
 * '\n' new line dictates the outcome while sending a prompt to OpenAI
 * '\\n' escape new line character if the prompt new line char is intended for AI to parse or use it for processing 
**/

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const axios = require('axios');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


/*** 
 * Replacing below completion mode of OpenAI using axios request would be best 
 * in case we need to get non-streamed / non-chunks response
**/ 
completionMode = async () => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    //prompt: "Where do you think tesla stands in EV market, will it succeed?",
    prompt : "A sentence containing address in US format:\n\n13920 City Center Dr. Ste 290 Chino Hills\\nCA 91709.\n\nStreet :\nUnit : \nCity : \nState : \nPostalCode :\n\n",
    temperature: 0.6,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream : false //bestof is also needed for streamed response
  });

  return response;

}

completionMode().then((response)=>{
    console.log(JSON.stringify(response.data.choices[0]));
})

let data = {
  messages: [      
      {
          role: "user",
          content: "Can you give me a small explanation of what einstein rosen bridge is?"
      }
  ],
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  model: "gpt-3.5-turbo",
  stream: false //keep false or true for response in chunks 
}

chatMode = async () => {
  const response = await axios.post('https://api.openai.com/v1/chat/completions',data, {
    headers: {
      authorization:`Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type":'application/json'
    }
  
  });
  return response;
}

// chatMode().then((res)=>{
//   console.log(JSON.stringify(res.data));  
//   console.log(JSON.stringify(res.data.choices[0].message.content));  
// });