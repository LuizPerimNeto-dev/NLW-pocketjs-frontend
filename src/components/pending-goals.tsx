import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, X } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { getPendingGoals } from "../http/get-pending-goals";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createGoalCompletion } from "../http/create-goal-completion";
import { deleteGoal } from '../http/delete-goal'

export function PendingGoals() {
    const queryClient = useQueryClient()
    const [isSelecting, setIsSelecting] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const { data } = useQuery({
        queryKey: ['pending-goals'],
        queryFn: getPendingGoals,
        staleTime: 1000 * 60, // 60 seconds
    })

    if (!data) {
        return null
    }

    async function handleCompleteGoal(goalId: string) {
        await createGoalCompletion(goalId)

        queryClient.invalidateQueries({ queryKey: ['summary'] })
        queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    }

    function toggleSelect(goalId: string) {
        setSelectedIds(prev =>
            prev.includes(goalId)
                ? prev.filter(id => id !== goalId)
                : [...prev, goalId]
        )
    }

    function cancelSelection() {
        setIsSelecting(false)
        setSelectedIds([])
    }

    async function handleDeleteSelected() {
        if (selectedIds.length === 0) return
        if (!confirm('Tem certeza que deseja excluir essas metas?')) return

        await Promise.all(selectedIds.map(id => deleteGoal(id)))
        cancelSelection()

        queryClient.invalidateQueries({ queryKey: ['summary'] })
        queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end gap-4">
                {isSelecting ? (
                    <>
                        <button
                            type="button"
                            onClick={cancelSelection}
                            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
                        >
                            <X className="size-4" />
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleDeleteSelected}
                            disabled={selectedIds.length === 0}
                            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                            <Trash2 className="size-4" />
                            Excluir ({selectedIds.length})
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsSelecting(true)}
                        className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
                    >
                        <Trash2 className="size-4" />
                        Selecionar
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
                {data.map(goal => {
                    const isSelected = selectedIds.includes(goal.id)

                    return (
                        <OutlineButton
                            key={goal.id}
                            disabled={
                                !isSelecting &&
                                goal.completionCount >= goal.desiredWeeklyFrequency
                            }
                            onClick={() =>
                                isSelecting
                                    ? toggleSelect(goal.id)
                                    : handleCompleteGoal(goal.id)
                            }
                        >
                            {isSelecting ? (
                                isSelected ? (
                                    <CheckCircle2 className="size-4 text-pink-500" />
                                ) : (
                                    <Circle className="size-4 text-zinc-600" />
                                )
                            ) : (
                                <Plus className="size-4 text-zinc-600" />
                            )}
                            {goal.title}
                        </OutlineButton>
                    )
                })}
            </div>
        </div>
    )
}