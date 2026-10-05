
import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/created-goal'
import { useEffect, useState } from 'react'
//import { EmptyGoals } from './components/empty-goals'
//import { Summary } from './components/summary'

export function App() {
  const [count, setCount] = useState(5)
  const [summary, setSummary] = useState(null)

  function increment() {
    setCount(count + 1)
  }

  useEffect(() => {
    fetch('http://localhost:3333/summary').then((response) => {
      return response.json()
    }).then(data => {
      //setSummary(data) 
    }, [])
  })

  return (
    <Dialog>
      <button type='button' onClick={increment}>
        Incrementar
      </button>
      <h1 className='text-4xl'>{count}</h1>

      <pre>
        {JSON.stringify(summary, null, 2)}</pre>

      {/* <EmptyGoals/> */}

      {/*  <Summary /> */}

      <CreateGoal />
    </Dialog>
  )
}

