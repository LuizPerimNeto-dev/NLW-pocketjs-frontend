export async function deleteGoal(goalId: string) {
  await fetch(`http://localhost:3333/goals/${goalId}`, {
    method: 'DELETE',
  })
}