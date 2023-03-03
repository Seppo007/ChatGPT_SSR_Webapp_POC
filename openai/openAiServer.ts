import express, {Request, Response} from 'express';
import {listModels} from "./openAiApi";
import fs from 'fs';

if (!process.env.OPEN_AI_KEY || !process.env.OPEN_AI_ORG) {
    console.log("env OPEN_AI_KEY or OPEN_AI_ORG not set!");
    process.exit(1);
}

const app = express();
const mockModelsResponse: string = fs.readFileSync('openai/modelResponseMock.json').toString();

app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
    res.send(mainPage());
});

app.post('/', (req: Request, res: Response) => {
    res.send(mainPage());
});

app.post('/listModels', async (req: Request, res: Response) => {
    const fetchedModelsInfo = await openAiListModelsRequest();
    res.send(modelsPage(fetchedModelsInfo));
})

app.post('/submit', async (req: Request, res: Response) => {
    const userInput = req.body.userText;
    const resultHtml = `
    <div>
      <label>Answer from OpenAi for input ${userInput}</label>
      <div>
        <textarea disabled id="result" style="width: 100%; height: 500px; resize: none">Not implemented yet</textarea></div>
    </div>
    `
    const html = mainPage(resultHtml)
    res.send(html);
});

const mainPage = (result = ''): String => {
    return `
    <html>
      <body>
        <h1>TypeScript Express Example</h1>
        </div>
        <form method="post" action="/">
          <button type="submit">Home</button>
        </form>
        <form method="post" action="/submit">
          <label>Enter a text:</label>
          <div>
            <textarea name="userText" style="width: 500px; height: 300px" placeholder="Enter a text"></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
        <form method="post" action="/listModels">
          <button type="submit">List Models</button>  
        </form>
        ${result}
      </body>
    </html>`
}

const modelsPage = (models = 'No answer received'): String => {
    return `
    <html>
      <body>
        <h1>Available ChatGPT models</h1>
        </div>
        <form method="post" action="/">
          <button type="submit">Home</button>
        </form>
        <div>
          <textarea disabled style="width: 100%; height: 80%; resize: none;">${models}</textarea>
        </div>
      </body>
    </html>`
}

const openAiListModelsRequest = async () => {
    const response = mockModelsResponse; // await listModels();
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