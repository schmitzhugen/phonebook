require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors({ origin: true }));
app.use(express.static('dist'))
app.use(morgan('tiny'))

const helmet = require('helmet')

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'none\''],
      fontSrc: ['\'self\'', 'data:'] // Allow loading fonts from self and data URIs
    }
  }
}))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(i => {
      response.send(`Phonebook has info for ${i} people.`)
    })
    .catch(error => next(error))
})

app.get('/', (request, response) => {
    Person.find({}).then(i => {
    response.json(i)
    })
  })
  

app.get('/api/persons', (request, response) => {
  Person.find({}).then(i => {
    response.json(i)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(i => {
    if (i) {
      response.json(i)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(result => {
    console.log(`Added ${body.name} to phonebook.`)
    response.json(result)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, content: 'query' })
    .then(i => {
      response.json(i)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
