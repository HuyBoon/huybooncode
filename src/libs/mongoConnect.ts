import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options: MongoClientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 10, // Giới hạn connection pool
    minPoolSize: 2, // Giữ kết nối tối thiểu
    connectTimeoutMS: 10000, // Timeout kết nối
    serverSelectionTimeoutMS: 5000, // Timeout chọn server
};

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect().then((connectedClient) => {
            console.log("MongoClient connected for NextAuth");
            return connectedClient;
        }).catch((error) => {
            console.error("MongoClient connection error:", error);
            global._mongoClientPromise = undefined;
            throw error;
        });
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().then((connectedClient) => {
        console.log("MongoClient connected for NextAuth");
        return connectedClient;
    }).catch((error) => {
        console.error("MongoClient connection error:", error);
        throw error;
    });
}

export default clientPromise;