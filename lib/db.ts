//basically this file is used to connect to the database and store the connection in a global variable so that no new connection is created every time when route is reloaded
import { error } from "console";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!; //! it means this is not null if it is null it will throw an error

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose; //this is a global variable store in cached variable
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
} // if there is no connection then it will create a empty object and store it in cached variable
export const dbConnect = async function () {
    if (cached.conn) {
        return cached.conn;
    } // if there is a connection then it will return the connection that is already created
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }
        mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    } //if promise is null then it will create a new promise and connect to the database opts is the options used to connect to the database maxPoolSize is the maximum number of connections to the database that can be open at the same time and bufferCommands is used to buffer commands before they are sent to the database

    try {
        cached.conn = await cached.promise; //store the connection in cached variable with promise or the connection that created above
    } catch (error) {
        cached.promise = null;
        throw error;
    }
    return cached.conn;


}

