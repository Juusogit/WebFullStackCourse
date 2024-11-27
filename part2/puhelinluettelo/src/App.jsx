import { useEffect, useState } from 'react'
import peopleService from './services/people'


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
const PersonList = ({ persons, handleDelete}) => (
  <div>
    {persons.map(person => (
      <li key={person.id}>{person.name}: {person.number} 
      <button onClick={() => handleDelete(person.id)}>delete</button>
      </li>
    ))}
  </div>
)
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}
const Alert = ({message2}) => {
  if (message2 === null) {
    return null
  }

  return (
    <div className="error2">
      {message2}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState ('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)

  useEffect(() => {
    peopleService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
      })
  }, [])

  const add = (event) => {
    event.preventDefault()
    console.log('sivu estetty päivittymästä')

    if (!newName.trim()) {
      alert('Write your name!')
      return
    }
    if (!newNumber.trim()) {
      alert('Add your number!')
      return
    }


    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (!confirmUpdate) {
        return
      }
        const updatedPerson = { ...existingPerson, number: newNumber }
        peopleService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setErrorMessage(`Numero päivitetty!`)
            setTimeout(() => {setErrorMessage(null)}, 2000)
            console.log('numero päivitetty!')
        })
            .catch(error => {
            setAlertMessage(`An error has occurred.`)
            setTimeout(() => { setAlertMessage(null) }, 2000)
            console.error('VIRHE', error)
        })
      return
    }
  

    const addObject = {
      name: newName,
      number: newNumber,
    }

    peopleService
      .create(addObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
        setErrorMessage(`Nimi lisätty!`)
            setTimeout(() => {setErrorMessage(null)}, 2000)
      })
    }

    const handleDelete = (id) => {
      const confirmDelete = window.confirm('U sure?')
      if (!confirmDelete){
        return
      }
        peopleService
          .remove(id)
          .then(() => {
            setPersons(persons.filter(person => person.id !== id))
            setErrorMessage(`Nimi poistettu!`)
            setTimeout(() => {setErrorMessage(null)}, 2000)
            console.log('Poistettu!')
          })
          .catch(error => {
            console.log(error);
          });
  }

  const addName = (event) => {
    setNewName(event.target.value)
  }
  const addNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )


  return (
    <div>
      <h1>Phonebook</h1>
      <Alert message2 = {alertMessage}/>
      <Notification message ={errorMessage}/>
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
      <AddPersonForm
        add={add}
        newName={newName}
        newNumber={newNumber}
        addName={addName}
        addNumber={addNumber}
      />
      <h3>Numbers</h3>
      <PersonList persons={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App