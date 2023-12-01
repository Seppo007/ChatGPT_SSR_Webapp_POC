import OpenAI from "openai";

const openai = new OpenAI({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY
});


export const listModels = async (): Promise<string> => {
    try {
        const res = await openai.models.list();
        try {
            return JSON.stringify(res.data)
        } catch (stringifyError) {
            return `Could not stringify ${res.data}`;
        }
    } catch (error: any) {
        return `An error occured: ${error.response.status} ${error.response.statusText}`;
    }
}

export const chatComplete = async (correspondence: OpenAI.Chat.ChatCompletionMessageParam[]): Promise<string> => {
    if(correspondence.at(correspondence.length - 1)!!.content === '') {
        correspondence.push({role: 'system', content: 'Providing an empty string is not permitted!'})
        return new Promise<string>((resolve: (str: string) => void, reject: (str: string)=> void) => resolve(''));
    } else {
        try {
            const res = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: correspondence,
                n: 1,
                max_tokens: 500,
                temperature: 0.5,
            });
            const chatGPTAnswer = res.choices[0].message;
            if (chatGPTAnswer) {
                correspondence.push({role: 'assistant', content: chatGPTAnswer.content})
                return chatGPTAnswer.content!;
            } else {
                return 'no answer received from ChatGPT'
            }
        } catch (error: any) {
            return `An error occured: ${error.status} ${error.message}`;
        }
    }
}

export const complete = async (input: string): Promise<string> => {
    try {
        const res = await openai.completions.create({
            model: 'gpt-3.5-turbo',
            prompt: input,
            n: 1,
            max_tokens: 500,
            temperature: 0.5,
        })
        if (res.choices[0].text) {
            return res.choices[0].text;
        } else {
            return 'no answer received from ChatGPT'
        }
    } catch (error: any) {
        return `An error occured: ${error.response.status} ${error.response.statusText}`;
    }
}