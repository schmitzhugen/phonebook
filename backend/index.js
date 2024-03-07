const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(morgan('tiny'))


app.get('/info', (request, response) => {
    const date = new Date(Date.now())
    return(
        response.send(`<div>Phonebook has info for ` + data.length + ` people.</div> <br/>` + date ))
    })

app.get('/api/persons', (request, response) => {response.json(data)})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(i => i.id === id)
    
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
   })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(i => i.id !== id)
    response.status(204).end()
})

const generateId = () => {
     return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name && !body.number){
        return response.status(400).json({error: 'content missing'})
    }

    if (!body.name){
        return response.status(400).json({error: 'you are missing a name'})
    }

    if (!body.number){
        return response.status(400).json({error: 'you are missing a phone number'})
    }

    for (let i = 0; i<data.length; i++){
        if (JSON.stringify(body.name) === JSON.stringify(data[i].name))
            return response.status(404).json({error: 'the name must be unique'})
    }

    const note = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    data = data.concat(note)
    response.json(note)
})

const PORT = 3001
app.listen(PORT)