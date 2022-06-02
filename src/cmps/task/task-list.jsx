import { Link } from "react-router-dom"
import { TaskPreview } from "./task-preview"
import { Droppable } from "react-beautiful-dnd"

export const TaskList = (props) => {
    const { tasks, idx } = props
    if (!tasks) return (<p>No tasks</p>)
    return (
        <Droppable type='task' index={idx} droppableId={`${props.groupId}`}>
            {(provided) => {
                return <section className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
                    {(tasks || tasks.length) && tasks.map((task, idx) => {
                        return (
                            <div id={task.id} key={task.id}>
                                <Link key={task.id + idx} to={`/board/${props.boardId}/${props.groupId}/${task.id}`}>
                                    <TaskPreview isLabelOpen={props.isLabelOpen} 
                                    setIsLabelOpen={props.setIsLabelOpen} 
                                    idx={idx} 
                                    boardId={props.boardId} 
                                    onToggleDetails={props.onToggleDetails} 
                                    key={task.id} 
                                    task={task} />
                                </Link>
                            </div>
                        )
                    })}
                    {provided.placeholder}
                </section>
            }}
        </Droppable>
    )
}