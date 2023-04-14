import express, {Request, Response} from 'express';
import {chatComplete, complete, listModels} from "./openai/openAiApi";
import {ChatCompletionRequestMessage} from "openai";
import * as fs from "fs";

if (!process.env.OPEN_AI_KEY || !process.env.OPEN_AI_ORG) {
    console.log("env OPEN_AI_KEY or OPEN_AI_ORG not set!");
    process.exit(1);
}

const app = express();
const mockModelsResponse: string = fs.readFileSync('openai/mocks/modelResponseMock.json').toString();
const mockChatCompleteResponse: string = fs.readFileSync('openai/mocks/chatCompleteResponseMock.json').toString();

let correspondence: ChatCompletionRequestMessage[] = [];

app.use(express.urlencoded({extended: true}));
app.use('/css', express.static(__dirname + '/node_modules/bulma/css'))

app.get('/', (req: Request, res: Response) => {
    res.send(mainPage('', false));
});

app.post('/', (req: Request, res: Response) => {
    res.send(mainPage('', false));
});

app.post('/listModels', async (req: Request, res: Response) => {
    const fetchedModelsInfo = await openAiListModelsRequest();
    res.send(modelsPage(fetchedModelsInfo));
})

app.post('/submit', async (req: Request, res: Response) => {
    const userInput = req.body.userPrompt;
    const preserveChat = !!req.body.preserve;
    updateMessagesStack(userInput, preserveChat);
    const chatGptAnswer = await chatComplete(correspondence); // 'This is a mock answer from ChatGPT';
    const resultHtml = `
    <div>
      <div style="padding-top: 10px; padding-bottom: 10px">Your question <strong>"${userInput}"</strong> has been answered by ChatGPT:</div>
      <div>
        <textarea class="textarea has-fixed-size" readonly id="result" style="width: 100%; height: 500px; resize: none">${chatGptAnswer}</textarea>
      </div>
    </div>
    `
    const html = mainPage(resultHtml, preserveChat)
    res.send(html);
});

const updateMessagesStack = (userInput: string, shouldPreserve: boolean) => {
    correspondence = shouldPreserve ? correspondence : [];
    correspondence.push({role: 'user', content: userInput});
}

const mainPage = (result = '', preserveChat: boolean): String => {
    const correspondenceString: string = readableCorrespondence();
    return `
    <html xmlns="http://www.w3.org/1999/html">
      <head>
        <link rel="stylesheet" href="/css/bulma.css" />
      </head>
      <body style="padding: 48px">
        <h1 class="title">OpenAI ChatGPT Client</h1>
        <div class="container">
          </div>
            <div style="display: flex; gap: 15px">
              <form method="post" action="/">
                <button class="button is-rounded" type="submit">Home</button>
              </form>
              <form method="post" action="/listModels">
                <button class="button is-rounded" type="submit">List Models</button>  
              </form>
            </div>
            <form method="post" action="/submit">
              <div class="columns">
                <div class="column">
                  <textarea class="textarea has-fixed-size" name="userPrompt" style="height: 800px; resize: none" placeholder="ChatGPT prompt"></textarea>
                  <button class="button is-info" style="padding: 10px; margin: 10px 0 10px 0" type="submit">Submit</button>
                </div>
                <div class="column" style="display: flex; flex-direction: column">
                  <pre class="textarea has-fixed-size has-text-success" readonly id="correspondence" placeholder="Chat correspondence overview" style="white-space: pre-wrap; max-width: 50%; height: 800px">${correspondenceString}</pre>    
                  <div>
                  <label class="checkbox">
                    <input name="preserve" type="checkbox" ${preserveChat ? 'checked' : ''}/>
                    Preserve chat
                  </label>
                </div>
              </div>
            </div>
          </form>   
          ${result}
        </div>
      </body>
    </html>`
}

const readableCorrespondence = () => {
    const res: string[] = [];
    for (const entry of correspondence) {
        res.push(`<span class="has-text-info">${entry.role.toLocaleUpperCase()}:</span> ${entry.content}\n\n`);
    }
    return res.toString().replaceAll(',', '');
}

const modelsPage = (models = 'No answer received'): String => {
    return `
    <html>
      <head>
        <link rel="stylesheet" href="/css/bulma.css" />
      </head>
      <body style="padding: 48px">
        <h1 class="title">Available ChatGPT models</h1>
        <div class="container">
          </div>
          <form method="post" action="/">
            <button class="button is-rounded" type="submit">Home</button>
          </form>
          <div>
            <textarea class="textarea has-fixed-size" readonly style="width: 100%; height: 80%; resize: none;">${models}</textarea>
          </div>        
        </div>
      </body>
    </html>`
}
const openAiListModelsRequest = async () => {
    const response = mockModelsResponse; // await listModels(); ;
    let formatted;
    try {
        formatted = JSON.stringify(JSON.parse(response), null, 1);
    } catch (e) {
        return response;
    }
    return formatted.trim();
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});