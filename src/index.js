const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.header;

  const user = users.find(user => user.username === username);
}

app.post('/users', (request, response) => {
  const { name, username} = request.body;
  
  const usealreadyexist = users.some(user => user.username === username);

  if(usealreadyexist){
    return response.status(400).send({error: "User already exists!"});
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todo: []
  }

  users.push(user)

  return response.status(201).send({ message: "User created successfully!"})

});

app.get("/users", (request, response) => {
  const { username } = request.headers;
  
  const usealreadyexist = users.some(user => user.username === username);

  if(!usealreadyexist){
    return response.status(400).send({error: "User does not exist!"});
  }

  const user = users.find(user => user.username === username);
    return response.status(201).json(user);
})

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;