const AWS = require("aws-sdk");
AWS.config.update({region:'us-east-1'});
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const port = 3000


const USERS_TABLE = "SampleTable";//  process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(
  {endpoint: "http://localhost:8000"}  
);

app.use(express.json());

app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/cicd", async function (req, res) {
  const { userId, name } = req.body;
  // if (typeof userId !== "string") {
  //   res.status(400).json({ error: '"userId" must be a string' });
  // } else if (typeof name !== "string") {
  //   res.status(400).json({ error: '"name" must be a string' });
  // }
  console.log('TABLE TO SAVE ', "cicd");
  const params = {
      TableName: "cicd",
      Item: {
        name: "aws",
        logo: "s3", name: name,
        id: "123131232134523"
      },

  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.get("/cicd/:cicd_id", async function (req, res) {


  console.log('cicd ID', req.params.cicd_id);

  const params = {
    TableName: "frameworks",
    Key: {
        cicd:req.params.cicd_id
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { name, id , logo } = Item;
      res.json({ name, id });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports.handler = serverless(app);
