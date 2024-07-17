import {connect} from 'mongoose'
import { disconnect } from 'process';
 async function connectToDatabase(){
    try {
        await connect(process.env.MONGODB_URL);
    }catch(error){
        console.log(error);
        throw new Error("Canot connect to MongoDB")
        
    }
}

async function disconnectFromDatabase(){
    try {
        await disconnect();
    } catch (error) {
        console.log(error);
        throw new Error("Canot connect to MongoDB")
    }
    
}
export {connectToDatabase,disconnectFromDatabase};
