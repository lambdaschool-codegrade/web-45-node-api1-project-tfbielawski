// BUILD YOUR SERVER HERE
const express = require('express');
const Model = require("./users/model");
const server = express();

//Express middleware for reading JSON
server.use(express.json());

//| POST   | /api/users     | Creates a user using the information sent inside the `request body`.
server.post("/api/users", (req,res) => {
    const newModel = req.body;
    if(!newModel.name || !newModel.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" })
    }
    else {
        Model.insert(newModel)
            .then(user => { res.status(201).json(user) })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err.message})
            });
    }

})

//Get the home page
server.get("/users", (req, res) => {
    res.status(200).json({message: "Return array of users" });
})

//| GET array of all users.
server.get("/api/users/", (req,res) => {
    Model.find()
    .then(user => { res.status(201).json(user) })
        .catch(err => {
            console.log("Get ALL users ERROR:",err)
            res.status(500).json({message: err.message})
        })
})

server.get("/api/users/:id", (req,res) => {
    console.log("GETTING CRUDDY USERS BY ID", req.params.id);
    Model.findById(req.params.id)
    .then(user => {
        console.log("Server.get users >>", user)
        if(user) {res.status(200).json(user)}
        else {
            console.log("If server.get users fails")
            res.status(404).json({ message: "The user with the specified ID does not exist"})
        }
    })
        .catch(err => {
            console.log("GET by ID error", err)
            res.status(500).json({message: err.message})
        })
})


//| DELETE |Removes the user with the specified `id`
server.delete("/api/users/:id", (req,res) => {
    Model.remove(req.params.id)
            .then(user => {
                if (user) { res.status(200).json(user) }
                else {
                    res.status(404).json({ message: "The user with the specified ID does not exist"})
                }
            })
            .catch(err => {
                console.log("DELETE ERROR", err)
                res.status(500).json({message: err.message})
            })
})

//| PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user

server.put("/api/users/:id", async (req, res) => {
    try {
        const changes = await Model.findById(req.params.id)
        if(!changes){
            res.status(404)
                .json({ message: "The user with the specified ID does not exist"})
        }
        else if (!req.body.name || !req.body.bio) {
            res.status(400)
                .json({ message: "Please provide name and bio for the user" })
        }
        else {
            const result = await Model.update(req.params.id, req.body)
            res.status(200).json(result)
        }

    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})
//Export the server module
module.exports = server; // EXPORT YOUR SERVER instead of {}
