const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);
  if(!user){
    return response.status(400).json({ error: "User not found"});
  }

  request.user = user;

  return next();
}

function checksExistsTasks(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const todos = user.todos;
  

  const todo = todos.find((todo) => todo.id === id);

  if(!todo){
    return response.status(404).json({ error: "task does not exist"})
  }

  request.todo = todo;
  

  return next();
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
    todos: []
  }

  users.push(user)

  return response.status(201).send(user)

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
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline} = request.body;
  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsTasks, (request, response) => {
  const { todo } = request;
  const { title, deadline} = request.body;
  
  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsTasks,  (request, response) => {
  const { todo } = request;

  todo.done = true;

  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsTasks, (request, response) => {
  const { user, todo} = request;

  user.todos.splice(user.todos.indexOf(todo), 1)

  return response.status(204).json(user.todos);
  
});

module.exports = app;