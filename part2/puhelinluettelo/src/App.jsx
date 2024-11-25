import { useState } from 'react'

const FilterForm = ({ filter, handleFilterChange }) => (
  <div>
    find: <input value={filter} onChange={handleFilterChange} />
  </div>
)
const AddPersonForm = ({ add, newName, newNumber, addName, addNumber }) => (
  <form onSubmit={add}>
    <h3>add new</h3>
    <div>
      name: <input value={newName} onChange={addName} />
    </div>
    <div>
      number: <input value={newNumber} onChange={addNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)
const PersonList = ({ persons }) => (
  <div>
    {persons.map(person => (
      <li key={person.name}>{person.name}: {person.number}</li>
    ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' },
    { name: 'Jompaunder', number: '044-123420' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addName = (event) => {
    setNewName(event.target.value)
  }
  const addNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const add = (event) => {
    event.preventDefault()

    if (!newName.trim()) {
      alert('Write your name!')
      return
    }

    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const addObject = {
      name: newName,
      number: newNumber,
    }

    setPersons(persons.concat(addObject))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  

  return (
    <div>
      <h1>Phonebook</h1>
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
      <AddPersonForm
        add={add}
        newName={newName}
        newNumber={newNumber}
        addName={addName}
        addNumber={addNumber}
      />
      <h3>Numbers</h3>
      <PersonList persons={personsToShow} />
    </div>
  );
};

export default App;