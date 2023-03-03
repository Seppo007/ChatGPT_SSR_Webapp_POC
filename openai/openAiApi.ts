import {Configuration, OpenAIApi} from "openai";
import {CreateCompletionResponseChoicesInner} from "openai/api";

const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export const listModels = async (): Promise<string> => {
    try {
        const res = await openai.listModels();
        try {
            let retString = "[";
            for (let modelEntry of res.data.data) {
                const stringified = JSON.stringify(modelEntry);
                retString += stringified;
                retString += ',';
            }
            return retString + ']';
        } catch (stringifyError) {
            return `Could not stringify ${res}`;
        }
    } catch (error: any) {
        console.log("error");
        return `An error occured: ${error.response.status} ${error.response.statusText}`;
    }
}

export const complete = async (input: string): Promise<string> => {
    const res = await openai.createCompletion({
        model: 'text-davinci-003',
        echo: false,
        prompt: input,
        stream: false,
        n: 1,
        max_tokens: 500,
        temperature: 0.5,
    })
    if(res.data.choices[0].text) {
        return res.data.choices[0].text;
    } else {
        return 'no answer received from ChatGPT'
    }
}