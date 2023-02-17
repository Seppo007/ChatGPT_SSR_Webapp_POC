import express, {Request, Response} from 'express';
import openAiComplete from "./openAiComplete";

const app = express();

app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
    const html = `
    <html>
      <body>
        <h1>TypeScript Express Example</h1>
        <form method="post" action="/submit">
          <label>Enter a text:</label>
          <div>
            <textarea name="userText" style="width: 500px; height: 300px" placeholder="Enter a text"></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
        <div id="result"></div>
      </body>
    </html>
  `;
    res.send(html);
});

app.post('/submit', async (req: Request, res: Response) => {
    const userInput = req.body.userText;
    const response = await openAiCompleteRequest();
    const html = `
    <html>
      <body>
        <h1>TypeScript Express Example</h1>
        <form method="post" action="/submit">
          <label>Enter a text:</label>
          <div>
            <textarea name="userText" style="width: 500px; height: 300px" placeholder="Enter a text"></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
        <div id="result">
          Answer from OpenAi for input ${userInput}: \n${response}
        </div>
      </body>
    </html>
  `;
    res.send(html);
});

const openAiCompleteRequest = async () => {
    try {
        const res = await openAiComplete();
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
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});