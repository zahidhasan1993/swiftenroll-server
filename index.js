const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

//mongo connections




const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.uoombu0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("swiftenroll");
    const colleges = database.collection('colleges');

    //apis

    app.get('/colleges', async(req,res) => {
        const cursor = colleges.find();
        const result = await cursor.toArray();

        res.send(result)
    })

    app.get('/college/:id', async(req,res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await colleges.findOne(query);

      res.send(result)
    })


    //mongo connect sure
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//server routes connection

app.get('/', (req,res) => {
    res.send('Welcome to SwiftsEnroll Server')
})

app.listen(port, () => {
    console.log('app running on port',port);
})