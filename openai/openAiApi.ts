import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);


export const listModels = async (): Promise<string> => {
    try {
        const res = await openai.listModels();
        try {
            return JSON.stringify(res.data.data)
        } catch (stringifyError) {
            return `Could not stringify ${res.data.data}`;
        }
    } catch (error: any) {
        return `An error occured: ${error.response.status} ${error.response.statusText}`;
    }
}

export const chatComplete = async (correspondence: ChatCompletionRequestMessage[]): Promise<string> => {
    if(correspondence.at(correspondence.length - 1)!!.content === '') {
        correspondence.push({role: 'system', content: 'Providing an empty string is not permitted!'})
        return new Promise<string>((resolve: (str: string) => void, reject: (str: string)=> void) => resolve(''));
    } else {
        try {
            const res = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: correspondence,
                n: 1,
                max_tokens: 500,
                temperature: 0.5,
            });
            const chatGPTAnswer = res.data.choices[0].message;
            if (chatGPTAnswer) {
                correspondence.push({role: 'assistant', content: chatGPTAnswer.content})
                return chatGPTAnswer.content!;
            } else {
                return 'no answer received from ChatGPT'
            }
        } catch (error: any) {
            return `An error occured: ${error.response.status} ${error.response.statusText}`;
        }
    }
}

export const complete = async (input: string): Promise<string> => {
    try {
        const res = await openai.createCompletion({
            model: 'gpt-3.5-turbo',
            prompt: input,
            n: 1,
            max_tokens: 500,
            temperature: 0.5,
        })
        if (res.data.choices[0].text) {
            return res.data.choices[0].text;
        } else {
            return 'no answer received from ChatGPT'
        }
    } catch (error: any) {
        return `An error occured: ${error.response.status} ${error.response.statusText}`;
    }
}