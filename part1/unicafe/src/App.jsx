import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
  <p>
    {text} {value}
  </p>
);

const Statistics = ({good, neutral, bad}) => {
  const total = good + bad + neutral
  const average = (good * 1 + bad * -1) / total
  const positive = good/total * 100
  if (total === 0) {
    return <p>No feedback given</p>
}

return (
  <div>
    <StatisticLine text="Good" value={good} />
    <StatisticLine text="Neutral" value={neutral} />
    <StatisticLine text="Bad" value={bad} />
    <StatisticLine text="All" value={total} />
    <StatisticLine text="Average" value={average.toFixed(2)} />
    <StatisticLine text="Positive" value={`${positive.toFixed(2)}%`} />
  </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="Good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button onClick={() => setBad(bad + 1)} text="Bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App