import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

const Filter = ( {newFilter, handleFilterChange} ) => {
  return(
    <div>Filter: <input value = {newFilter} onChange={handleFilterChange}/></div>
  )
}

const Notification = ({ message }) => {
  if (message === null){
    <div></div>
    return null
  }
  return (
    <div className = 'error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [userMessage, setUserMessage] = useState(null)
  
    const hook = () => {
      console.log('effect')
      axios
        .get('http://localhost:3001/api/persons')
        .then(response =>{
          console.log('promise fulfilled')
          setPersons(response.data)
        })
    }

    useEffect(hook, [])

    const Person = ({ persons, deleteNote }) => {
      return (
        <li key={persons.id}>
          {persons.name} {persons.number}
          <button onClick = {deleteNote}>delete</button>
        </li>
      )
    }

    const deleteNoteOf = (id) => {
      const url = `http://localhost:3001/api/persons/${id}`

      if (window.confirm("Are you sure you want to delete this entry from your phonebook?")){
        axios
          .delete(url) //this deletes the item from the server
          .then(() => {
            setPersons(persons.filter(i => i.id !== id)) //this only displays the non-deleted items
        })
      }
    }

    const addPerson = (event) => {
      event.preventDefault()
      const personObject = {
        name: newName,
        number: newNumber,
      }

      for (let i = 0; i<persons.length; i++){
        if (JSON.stringify(newName) === JSON.stringify(persons[i].name)){
          if (window.confirm(newName + ' is already added to the phonebook. Would you like to replace the old number with a new one?')){
            const changedNumber = {...persons[i], number: newNumber}
            const updatedPersons = [...persons]
            axios
              .put(`http://localhost:3001/api/persons/${persons[i].id}`, changedNumber)
              .then(response => {
                setPersons(persons => {
                  updatedPersons[i] = response.data;
                  setUserMessage(`We've now updated ${newName}'s number.`)
                  setTimeout(() => {
                    setUserMessage(null)
                  }, 5000)

                  return updatedPersons //exits the loop (so only 1 update is performed)
                }) 
              })
              .catch(error => {
                setUserMessage(`Sorry, we've already deleted ${newName}'s entry from our phonebook.`);
                setTimeout(() => {
                  setUserMessage(null);
                }, 5000);
              })

            return; //exits the function; ensures addPerson exits after updatign the existing person's number
          }
        }
      }

      axios
        .post('http://localhost:3001/api/persons', personObject)
        .then((response) => {
          setPersons(persons.concat(response.data)) //this directly updates Persons with data from the server (by using response.data)
          setNewName('')
          setNewNumber('')
          setUserMessage(`We've now added ${newName} to our phonebook!`)
          setTimeout(() => {
            setUserMessage(null)
          }, 5000)
        })
    }
    
    const handleNameChange = (event) => {
      console.log(event.target.value)
      setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
      console.log(event.target.value)
      setNewNumber(event.target.value)
    }
  
    const handleFilterChange = (event) => {
      console.log(event.target.value)
      setNewFilter(event.target.value)
    }

    const filteredNames = persons.filter(x => {
      return x.name.toLowerCase().includes(newFilter.toLowerCase()) //'includes' allows for dynamic filtering, rather than exact matches being required
    }) //'x' is a plaeholder parameter name, used to represent each element in the ;ersons' array as the 'filter' function iterates through it

    return (
      <div>
        <h2>Phonebook</h2>
          <Notification message={userMessage}/>
          <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
        <h2>Add someone new:</h2>
        <form onSubmit={addPerson}>
          <div>
            Name: <input value = {newName} onChange={handleNameChange}/>
          </div>
          <div>
            Number: <input value = {newNumber} onChange={handleNumberChange}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
        <h2>Numbers</h2>
        <ul>
          {filteredNames.map(p =>
            <Person key={p.id} persons={p} deleteNote = {() => deleteNoteOf(p.id)}/>
          )}
        </ul>
      </div>
    )
}

export default App