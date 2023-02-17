import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export default () => {
    if(!configuration.organization || !configuration.apiKey) {
        throw Error('organization or apikey is not set!');
    }
    return openai.listModels();
}