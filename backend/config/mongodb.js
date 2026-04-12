import mongoose from 'mongoose'

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))

    // Add { family: 4 } to force IPv4 and fix the ECONNREFUSED error
    await mongoose.connect(process.env.MONGODB_URI, {
        family: 4
    })
}

export default connectDB