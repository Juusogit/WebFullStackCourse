import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])

  const [newName, setNewName] = useState('')

  const addName = (event) => {
    setNewName(event.target.value)
  }

  const add = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if (!newName.trim()) {
      alert('Write your name!')
      return
    }

    const addObject = {
      name: newName,
      important: Math.random() > 0.5,
      id: String(persons.length +1)
    }

    setPersons(persons.concat(addObject))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={add}>
        <div>
          name: <input value ={newName} onChange={addName}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <div>debug: {newName}</div>
      <h2>Numbers</h2>
      {persons.map(person => <li key={person.id}>{person.name}</li>)}
    </div>
  )
}

export default App