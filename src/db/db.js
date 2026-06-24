import mongoose from "mongoose"

const db = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("⚙ DB CONNECTED SUCCESSFULLY")
    } catch (error) {
        console.log("ERROR : DATABASE CONNECTION FAILED", error);
        process.exit(1)
    }
}
export default db