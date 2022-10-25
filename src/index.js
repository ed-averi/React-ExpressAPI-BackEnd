import cors from "cors";
import express from "express";
import { initDB } from "./db/index.js";
import ToDosRequestHandler from "./handlers/todos.js";


initDB().then(() =>{
    console.log("DB Created")
}
)


const api = express();

api.use(cors({"origin": "*"}));
api.use(express.json());
api.use(express.urlencoded({extended: false}))


api.use("/v1", ToDosRequestHandler)

api.get('/', (req, res)=>{
    res.send({message: "hello"})
})

api.listen(8080, ()=>{
    console.log('API is running');
    initDB().then(()=>{
        console.log('DB is ready');
    })
})