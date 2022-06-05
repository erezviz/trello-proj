import { Droppable } from "react-beautiful-dnd"
import { useSelector } from "react-redux"
import { useState } from "react"

import { TrellisSpinner } from "../util-cmps/trellis-spinner"
import { GroupPreview } from "./group-preview"

export const GroupList = ({ groups, onDeleteGroup, boardId, onToggleDetails }) => {
    let { currBoard } = useSelector(state => state.boardModule)
    let [isLabelOpen, setIsLabelOpen] = useState(false)
    if (!groups || !currBoard) return <TrellisSpinner />

    return (
        <section>
            <Droppable key={currBoard._id} droppableId="group-list" direction="horizontal" type="column">
                {(provided) => {
                    return <div className="group-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {currBoard.groups.map((group, idx) => {
                            return <div key={group.id} >
                                <GroupPreview
                                    isLabelOpen={isLabelOpen}
                                    setIsLabelOpen={setIsLabelOpen}
                                    boardId={boardId}
                                    onToggleDetails={onToggleDetails}
                                    onDeleteGroup={onDeleteGroup}
                                    group={group}
                                    key={group.id}
                                />
                            </div>
                        })}
                        {provided.placeholder}
                    </div>
                }}
            </Droppable>
        </section>
    )

}