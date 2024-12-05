require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req) => JSON.stringify(req.body))

let persons = [
  {
    name: "Tiikeri",
    number: "0440423132"
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
  const person = persons.length
  const currentTime = new Date()
  response.send(`
    <p>Phonebook has info for ${person} people</p>
    <p>${currentTime}</p>
  `)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then (person => {
  if (person) {
    response.json(person)
    } else  {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})
  
// persons = persons.filter(person => person.id !== id)
  
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * 1000)
    : 0
  return String(maxId)
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  // if (!body.name||!body.number) {
  //   return response.status(400).json({ 
  //     error: 'name or number missing'
  //   })
  //   .catch(error => next(error))
  // }

  // const uniqueName = persons.some(person => person.name === body.name)
  // if (uniqueName) {
  //   return response.status(400).json({ 
  //     error: 'name is already in phonebook!' 
  //   })
  //   .catch(error =>next(error))
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  persons = persons.concat(person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new:true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})