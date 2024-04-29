import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmbsuxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const artCollection = client.db('artsDB').collection('arts');
        const categoryCollection = client.db('artsDB').collection('categories');

        // create single item in database
        app.post('/arts', async (req, res) => {
            const result = await artCollection.insertOne(req.body);
            res.send(result);
        })

        // get bulk art data from database
        app.get('/arts', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get single art data based on id from database
        app.get('/arts/id/:id', async (req, res) => {
            const art_id = req.params.id;
            const query = { _id: new ObjectId(art_id) }
            const result = await artCollection.findOne(query);
            res.send(result);
        })

        // get bulk art data based on user email from database
        app.get('/arts/email/:email', async (req, res) => {
            const query = { user_email: req.params.email }
            const result = await artCollection.find(query).toArray();
            res.send(result);
        })

        // get bulk data based on user email and customization value from database
        app.get('/arts/filter/:email/:customizable', async (req, res) => {
            const userEmail = req.params.email;
            const customizable = req.params.customizable === 'true';
            const query = {
                user_email: userEmail,
                customization: customizable
            };
            const result = await artCollection.find(query).toArray();
            res.send(result);
        });


        // delete single data based on id from database
        app.delete('/arts/id/:id', async (req, res) => {
            const art_id = req.params.id;
            const query = { _id: new ObjectId(art_id) }
            const result = await artCollection.deleteOne(query);
            res.send(result);
        })

        // update single data
        app.put('/arts/id/:id', async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) }
            const updatedArt = req.body;
            const options = { upsert: true };
            const art = { $set: { ...updatedArt } }
            const result = await artCollection.updateOne(filter, art, options);
            res.send(result)
        })

        // get categories
        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get single category
        app.get('/categories/id/:id', async (req, res) => {
            const category_id = req.params.id;
            const query = { _id: new ObjectId(category_id) }
            const result = await categoryCollection.findOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. Successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
    res.send("Art & Craft Server is Running!");
});

app.listen(port, () => {
    console.log(`Art & Craft Server is Running on Port: ${port}`);
});