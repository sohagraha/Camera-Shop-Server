const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fj33t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("finaltest");
        const servicesCollection = database.collection("services")
        const reviewsCollection = database.collection("test")
        const ordersCollection = database.collection("orders")
        const usersCollection = database.collection("users")

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({})
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/users/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })

        })

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result)
        })

        app.post('/orders', async (req, res) => {
            const service = req.body;
            const result = await ordersCollection.insertOne(service);
            res.json(result)
        })


        // DELETE my order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            // console.log('Delate id', result);
            res.json(result);

        })
        // delete product 

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            // console.log('Delate id', result);
            res.json(result);

        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await ordersCollection.findOne(query);
            res.json(service);
        })

        //Update Api
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "Approved"
                }
            }
            const result = await ordersCollection.updateOne(filter, updateDoc)
            res.json(result)
        }
        )

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result)
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = {
                $set: { role: 'admin' }
            }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })
    }
    finally {

        //await client.close();
    }
}
run().catch(console.dir);


// default
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})