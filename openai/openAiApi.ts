import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export const complete = () => 'Not implemented';

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