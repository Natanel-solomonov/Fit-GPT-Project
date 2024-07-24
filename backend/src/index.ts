

import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from "./db/connections.js";


//connections and listener
const PORT = process.env.PORT ||8766;
connectToDatabase().then(()=>{
  app.listen(PORT, 
    ()=> console.log("Server Open & Connected to Database")
    );
})
.catch(err=>console.log(err));

