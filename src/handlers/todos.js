import Express from "express";

import { getDBHandler } from "../db/index.js";

const ToDosRequestHandler = Express.Router();

ToDosRequestHandler.post("/to-dos", async (req,res)=>{
    try {
        // throw new Eror ("Test");
        const {title, description, isDone: is_done} = req.body;
        const dbHandler = await getDBHandler();

        const newTodo =  await dbHandler.run(`
        INSERT INTO todos (title, description, is_done)
        VALUES(
            '${title}',
            '${description}',
            ${is_done}
        )
        `

        );
        await dbHandler.close();

        res.send({newTodo: {title, description, is_done, ...newTodo}});

    } catch (error){
        res.status(500).send({
            error:`Something went wrong when trying to create a new to do`,
            errorInfo: error.message
        });
    }
});

ToDosRequestHandler.get("/to-dos", async (req,res)=>{

    try{
        const dbHandler = await getDBHandler();

        const todos = await dbHandler.all("SELECT * FROM todos");
        
        await dbHandler.close();


        if(!todos || !todos.length){
            return response.status(404).send({message: "To Dos Not Found"})
        }


        res.send({todos});
    }catch (error){
        res.status(500).send({
            error:`Something went wrong when trying to get to the to dos`,
            errorInfo: error.message
        });
    }
});


ToDosRequestHandler.delete("/to-dos/:id", async (req,res)=>{

    try{
        const todoId = req.params.id;
        const dbHandler = await getDBHandler();

        const deletedTodo = await dbHandler.run(
            "DELETE FROM todos WHERE id = ?",
            todoId
        );
        
        await dbHandler.close();


  
        res.send({todoRemoved: {... deletedTodo}})
    }catch (error){
        res.status(500).send({
            error:`Something went wrong when trying to remove the to dos`,
            errorInfo: error.message
        });
    }
});

// min 25:23 review session october 1th
ToDosRequestHandler.patch("/to-dos/:id", async (req,res)=>{

    try{
        const todoId = req.params.id;
        const {title, description, is_done} = req.body;
        const dbHandler = await getDBHandler();

        const todoToUpdate = await dbHandler.get(`SELECT * FROM todos WHERE id = ?`, todoId)


        let isDone = is_done ? 1 : 0;

        await dbHandler.run(
            `UPDATE todos SET title = ?, description = ?, is_done = ? 
            WHERE id = ?`,
            title || todoToUpdate.title, 
            description || todoToUpdate.description, 
            isDone, todoId || todoToUpdate.id
          );
        
        await dbHandler.close();


  
        res.send({todoUpdated: {... todoToUpdate, description, is_done}})
    }catch (error){
        res.status(500).send({
            error:`Something went wrong when trying to update a to do`,
            errorInfo: error.message
        });
    }
});

export default ToDosRequestHandler// module.exports = ToDosRequestHandler