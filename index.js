const express = require('express');
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb")
require("dotenv").config()

const app = express()
const port = process.PORT || 5000

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
)
app.use(express.json())

// MongoDB connect
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

async function run() {
    try {
        await client.connect()
        console.log("connected cloth Mongodb");

        const db = client.db("assaginment8");
        const clothcollection = db.collection("cloths")

        app.post("/api/v1/cloth", async (req, res) => {

            const {
                name,
                image,
                brand,
                price,
                discount,
                flashSale,
                rating,
                material,
                color,
                size,
                description
            } = req.body;
            const result = await clothcollection.insertOne({
                name,
                image,
                brand,
                price,
                discount,
                flashSale,
                rating,
                material,
                color,
                size,
                description,
                createdAt: new Date()
            })
            res.json({
                success: true,
                message: "cloth created successfully !",
                result,
            })

        })



        app.get("/api/v1/cloth", async (req, res) => {
            const data = await clothcollection.find({}).toArray()
            res.json({
                success: true,
                message: "successfully retrieve cloths ",
                data
            })
        })
        app.get("/api/v1/cloth/:id", async (req, res) => {
            const { id } = req.params
            const data = await clothcollection.findOne(new ObjectId(id))
            res.json({
                success: true,
                message: "single data geted Successfully ",
                data
            })
        })























        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        app.listen(port, () => {
            console.log(`cloth server is running port on http://localhost${port}`)
        })
    } finally { }
}

app.get("/", (req, res) => {
    const serverStatus = {
        message: "Rim-jim cloth store running smuthly"
    }
    res.json(serverStatus)
})

run()