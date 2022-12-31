import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
const port = process.env.PORT || 5000;
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect();
const run = async () => {
  try {
    client.connect();
    console.log("database connecting");
    // console.log(client?.error?.message || "no error");
  } catch (error) {
    console.log(error.message);
  }
};
const db = client.db("redOnion");
const dataCollection = db.collection("data");

run();

app.get("/meals", async (req, res) => {
  try {
    const data = await dataCollection.find({}).toArray();
    res.status(200).send({ status: true, data });
  } catch (error) {
    res.status(401).send({ status: false, message: error.message });
  }
});

app.get("/meals/:category", async (req, res) => {
  try {
    const query = { category: req.params.category };
    const data = await dataCollection.find(query).toArray();
    res.status(200).send({ status: true, data });
  } catch (error) {
    res.status(401).send({ status: false, message: error.message });
  }
});
app.get("/meal/:id", async (req, res) => {
  try {
    const query = { _id: ObjectId(req.params.id) };
    const data = await dataCollection.findOne(query);
    res.status(200).send({ status: true, data });
  } catch (error) {
    res.status(401).send({ status: false, message: error.message });
  }
});

app.listen(port, () => console.log(`${port} is running`));
