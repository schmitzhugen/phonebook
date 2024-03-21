require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan('tiny'))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(i => {
        response.json(i)
    })})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(i => {
        response.json(i)
    })
})
           
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(() => {
        response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(result => {
        console.log(`Added ${body.name} to phonebook.`);
        response.json(result)
    })
})
