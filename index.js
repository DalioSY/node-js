const express = require('express')
const uuid = require('uuid')
const cors = require('cors');

const port = 3001
const app = express()
app.use(express.json())
app.use(cors());


const users = []

// Middleware - interceptador -tem o poder de parar ou alterar dados dda requisição

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" }) //pode ser ("User not found")
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const id = uuid.v4()
    const { name, age } = request.body

    const user = { id, name, age }

    users.push(user) //coloca no array

    return response.status(201).json(user) //pode usar o users tbm

})

app.put('/users/:id', checkUserId, (request, response) => {
    const id = request.userId
    const { name, age } = request.body
    const index = request.userIndex

    const updatedUser = { id, name, age }

    users[index] = updatedUser

    return response.json(updatedUser)

})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()

})


app.listen(port, () => {
    console.log(`🚀 Serve started on port ${port}`)
})