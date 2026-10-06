import { useEffect, useState } from 'react'
import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/created-goal'
import { Summary } from './components/summary'
import { EmptyGoals } from './components/empty-goals'
import { useQuery } from '@tanstack/react-query'

type SummaryResponse = {
  completed: number;
  total: number;
  goalsPerDay: Record<string, {
    id: string;
    title: string;
    completedAt: string;
  }[]>;
}

export function App() {
 
  const { data } = useQuery<SummaryResponse>({
    queryKey: ['summary'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/summary')
      const data = await response.json()

      return data
    }
  })

  return (
    <Dialog>

      {data?.total && data.total > 0 ? <Summary /> : <EmptyGoals />}

      <CreateGoal />
    </Dialog>
  )
}

