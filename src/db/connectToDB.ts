import { Db, MongoClient, ServerApiVersion } from "mongodb";

let db: Db;
const connectToDB = async () => {
  const client: MongoClient = new MongoClient(process.env.MONGODB_URL!, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  db = await client.db("keeps-note");
  console.log("MongoDB client connected successfully.");
};

const getDB = () => db;

export { getDB, connectToDB };
