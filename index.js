const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: "1",
    name: "Tiikeri",
    number: "0440423132"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const person = persons.length
  const currentTime = new Date()
  response.send(`
    <p>Phonebook has info for ${person} people</p>
    <p>${currentTime}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if 
    (person) {response.json(person)} 
  else  
    {response.status(404).end()}
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random() * 1000)
    : 0
  return String(maxId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.name||!body.number) {
    return response.status(400).json({ 
      error: 'name or number missing'
    })
  }

  const uniqueName = persons.some(person => person.name === body.name)
  if (uniqueName) {
    return response.status(400).json({ 
      error: 'name is already in phonebook!' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
  
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})