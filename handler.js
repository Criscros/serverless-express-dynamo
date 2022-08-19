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

app.post("/provider-cicd-create", async function (req, res) {
  const { userId, name,cicd_id } = req.body;
  // if (typeof userId !== "string") {
  //   res.status(400).json({ error: '"userId" must be a string' });
  // } else if (typeof name !== "string") {
  //   res.status(400).json({ error: '"name" must be a string' });
  // }
  console.log('TABLE TO SAVE ', "providers_cicd");
  const id =   AWS.util.uuid.v4()

  const params = {
      TableName: "providers_cicd",
      Item: {
        name: name,
        logo: "",
        id:id
      },
  };

  try {
   await dynamoDbClient.put(params).promise();
   res.json({ "SAVE CICD": "......." });
    // res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.post("/create-frameworks", async function (req, res) {
  const { userId, name,cicd_id } = req.body;
  // if (typeof userId !== "string") {
  //   res.status(400).json({ error: '"userId" must be a string' });
  // } else if (typeof name !== "string") {
  //   res.status(400).json({ error: '"name" must be a string' });
  // }
  console.log('TABLE TO SAVE ', "cicd");
  const id =   AWS.util.uuid.v4()

  var frameworks = [

    {
      "name":"react",
      "cicd_id":"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",
      "logo":"",
      "id":"",
      "type":"front"
  },
  {
      "name":"angular",
      "cicd_id":"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",
      "logo":"",
      "id":"",
      "type":"front"
  },
  {
      "name":"vue",
      "cicd_id":"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",
      "logo":"",
      "id":"",
      "type":"front"
  },
  
  {
      "name":"laravel",
      "cicd_id":"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",
      "logo":"",
      "id":"",
      "type":"front"
  },
  {
      "name":"django",
      "cicd_id":"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",
      "logo":"",
      "id":"",
      "type":"front"
  },
  {
      "name":"nodejs",
      "cicd_id":"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",
      "logo":"",
      "id":"",
      "type":"back"
  },
  
  {
      "name":"react natine",
      "cicd_id":"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",
      "logo":"",
      "id":"",
      "type":"movile"
  },
  {
      "name":"swift",
      "cicd_id":"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",
      "logo":"",
      "id":"",
      "type":"movile"
  
  }


  ]

  const posts = await Promise.all(
    frameworks.map(async (framework) => {

      todo = {
        TableName: "frameworks",
        Item: {
          name: framework.name,
          cicd_id: framework.cicd_id,
          logo: "",
          type:framework.type,
          id:AWS.util.uuid.v4()
        },
  
      };
      console.log('Xxxxxxxxxxxxxxxxxxxx',AWS.util.uuid.v4());

     return  await dynamoDbClient.put(todo).promise();

    })
  )


    console.log('SAVING FRAMWWORKS.... ');
 

  try {
   //await dynamoDbClient.put(params).promise();
   res.json({ "OK": "......." });
    // res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.get("/frameworks/:cicd_id", async function (req, res) {


  console.log('cicd ID', req.params.cicd_id);

  const params = {
    TableName: "frameworks",
    Key: {
      id:"db6a21cd-a7a1-4648-9cdc-c7f8b8073f3b",

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
