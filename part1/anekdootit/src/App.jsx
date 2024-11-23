import { useState } from 'react'

const Button = (props) => (
  <button onClick = {props.onClick}>{props.text}</button>
)

const Anekdootti = (props) => (
  <div>
    <p>{props.anecdote}</p>
      <h3>With {props.votes} votes</h3>
  </div>
)

const App = () => {
  const anecdotes = [
    '"If it hurts, do it more often."',
    '"Adding manpower to a late software project makes it later!"',
    '"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time."',
    '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."',
    '"Premature optimization is the root of all evil."',
    '"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."',
    '"Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients."',
    '"The only way to go fast, is to go well."'
  ]
  
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [mostVoted, setMostVoted] = useState(0)
  const [hasVotes, setHasVotes] = useState(false)

  const rndm = () => {
    const rndmanekdootti =  Math.floor(Math.random()*anecdotes.length)
    console.log(rndmanekdootti)
    setSelected(rndmanekdootti)
  }

  const vote = () => {
    const newVote = [...votes]
    console.log(newVote)
    newVote [selected] += 1
    setVotes(newVote)
    setHasVotes(true)

    if (newVote[selected] > newVote[mostVoted]) {
      setMostVoted(selected)
    } 
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anekdootti anecdote ={anecdotes[selected]} votes={votes[selected]}/>
      <Button onClick={rndm} text='next anecdote' />
      <Button onClick={vote} text='vote'/>
      <h1>Anecdote with most votes</h1>
      {hasVotes ? (
      <Anekdootti anecdote = {anecdotes[mostVoted]} votes={votes[mostVoted]}/>
      ):(
        <p>No votes yet 😔</p>
      )}
    </div>
  )
}

export default App