import {Configuration, OpenAIApi} from "openai";

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

export const complete = async (input: string): Promise<string> => {
    try {
        const res = await openai.createCompletion({
            model: 'text-davinci-003',
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