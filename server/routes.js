require("dotenv").config();
const { Client } = require("@notionhq/client");

// The dotenv library will read from your .env file into these values on `process.env`
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

// Will provide an error to users who forget to create the .env file
// with their Notion data in it
if (!notionDatabaseId || !notionSecret) {
  throw Error("Must define NOTION_SECRET and NOTION_DATABASE_ID in env");
}

// Initializing the Notion client with your secret
const notionClient = new Client({
  auth: notionSecret,
});

async function initial(req, res) {
    const out = [{'name': 'John'}, {'name': 'Jane'} ];
    res.send('Hello! Welcome to the Goodbooks webpage!');
}

async function notionCreate(req, res) {
    console.log('NotionCreate');
    const name = req.query.name ? req.query.name : 'Placeholder Name';
    const label = req.query.label ? req.query.label : 'Placeholder Label';
    const url = req.query.name ? `google.com/search?q=${req.query.name}`: 'google.com';

    const response = await notionClient.pages.create({
        "parent": {
            "type": "database_id",
            "database_id": notionDatabaseId
        },

        "properties": {
            "Name": {
                "title": [
                    {"text": {"content": name}}
                ]
            },
            "Label": {
                "rich_text": [
                    {"text": {"content": label}}
                ]
            },
            "URL": {
                "url": url
            }
        }
    });
    console.log(response);
    res.writeHead(200);
    const out = {'name': name, 'label': label, 'url': url};
    res.end(JSON.stringify(out));
}

async function notionRead(req, res) {
    const query = await notionClient.databases.query({
        database_id: notionDatabaseId,
      });

      // We map over the complex shape of the results and return a nice clean array of
      // objects in the shape of our `ThingToLearn` interface
      const list = query.results.map((row) => {
        // row represents a row in our database and the name of the column is the
        // way to reference the data in that column
        const labelCell = row.properties.Label;
        const urlCell = row.properties.URL;

        // Depending on the column "type" we selected in Notion there will be different
        // data available to us (URL vs Date vs text for example) so in order for Typescript
        // to safely infer we have to check the `type` value.  We had one text and one url column.
        const isLabel = labelCell.type === "rich_text";
        const isUrl = urlCell.type === "url";

        // Verify the types are correct
        if (isLabel && isUrl) {
          // Pull the string values of the cells off the column data
          const label = labelCell.rich_text?.[0].plain_text;
          const url = urlCell.url ?? "";

          // Return it in our `ThingToLearn` shape
          return { label, url };
        }

        // If a row is found that does not match the rules we checked it will still return in the
        // the expected shape but with a NOT_FOUND label
        return { label: "NOT_FOUND", url: "" };
      });

      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(list));
}

module.exports = {
    initial,
    notionRead,
    notionCreate
}