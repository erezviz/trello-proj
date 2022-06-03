import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useRouteMatch } from "react-router-dom"
import { boardService } from "../../services/board.service"
import { uploadService } from "../../services/upload.service"
import { utilService } from "../../services/util.service"
import { updateTask } from "../../store/board.action"
import { TrellisSpinner } from "../util-cmps/trellis-spinner"
import { ReactComponent as Close } from '../../assets/icon/close.svg'



export const Attachments = ({ task }) => {
    let { params: { boardId, groupId, taskId } } = useRouteMatch()
    const dispatch = useDispatch()
    let [isEdit, setIsEdit] = useState(false)
    // let [isAdded, setIsAdded] = useState(false)
    // let [attachments, setAttachments] = useState([])
    let [isUploading, setIsUploading] = useState(false)
    let [attachment, setAttachment] = useState({
        title: null,
        createdAt: Date.now(),
        url: null
    })
    window.t = attachment
    const resetAttachment = () => {
        const emptyAttach = {
            title: null,
            createdAt: Date.now(),
            url: null
        }

        setAttachment(emptyAttach)
    }

    const handleChange = ev => {
        ev.preventDefault()
        const { value, name, id } = ev.target
        // const attachment = boardService.createAttachment(id, value)
        setAttachment(prevAttachment => ({ ...prevAttachment, [name]: value }))

    }

    const uploadImg = async (ev) => {
        if (!ev.target.files[0] || !ev.target.files.length) return
        attachment.title = utilService.getFilename(ev.target.value)
        setIsUploading(prevUploading => prevUploading = true)
        const url = await uploadService.uploadImg(ev)
        setIsUploading(prevUploading => prevUploading = false)

        setAttachment(prevAttachment => ({ ...prevAttachment, url }))
        onSaveAttachment()
    }
    const toggleEdit = () => {
        setIsEdit(prevIsEdit => prevIsEdit = !isEdit)
        console.log('isEdit?', isEdit);
    }

    const onSaveAttachment = ev => {
        if (ev) ev.preventDefault()

        if (!attachment.title) {
            attachment.title = utilService.getFilename(attachment.url)

        }
        const newTask = utilService.getDeepCopy(task)
        attachment.id = utilService.makeId()
        // setAttachments(prevAttachments => ([...prevAttachments, attachment]))
        if (newTask.attachments) newTask.attachments = [...newTask.attachments, attachment]
        else newTask.attachments = [attachment]

        dispatch(updateTask(boardId, groupId, newTask))
        toggleEdit()
        resetAttachment()

    }

    const onRemoveAttachment = (attachmentId) => {

        const newTask = utilService.getDeepCopy(task)
        const newAttachments = newTask.attachments.filter(attachment => attachment.id !== attachmentId)

        newTask.attachments = newAttachments
        dispatch(updateTask(boardId, groupId, newTask))

    }

    const onEditTitle = (attachId) => {

        //TODO  Change prompt to a nice modal -- preferably something dynamic you can use again and again
        const newTitle = prompt('Edit attachment', 'Link name')

        const newTask = utilService.getDeepCopy(task)

        if (!newTitle) return
        const newAttachments = newTask.attachments.map(attachment => {
            if (attachment.id === attachId) attachment.title = newTitle
            return attachment
        })
        newTask.attachments = newAttachments
        dispatch(updateTask(boardId, groupId, newTask))
    }


    if (!task) return <TrellisSpinner />
    return (
        <section className="attachments">
            <div className="attachment-header">
                <span className='icon-attachment'></span>
                <h3 className="inline-title">Attachments</h3>
            </div>
            <div className="attachment-main" >
                {isUploading && <TrellisSpinner />}
                {task.attachments && task.attachments.map(attachment => {

                    return <div className="attachment-thumbnail" key={attachment.id}>

                        <div className="attachment-img-container">
                            <img key={attachment.id + 'im'} src={`${attachment.url}`} alt="new attachment" />
                        </div>
                        <div className="attachment-thumbnail-details">

                            <h5>{attachment.title ? attachment.title : 'Your Attachment'}</h5>
                            <div className="thumbnail-edit">

                                <span onClick={() => onRemoveAttachment(attachment.id)}>Delete</span>
                                <span> - </span>
                                <span onClick={() => toggleEdit()}>Edit</span>
                            </div>
                            {/* <button className="  btn-danger">Delete</button>
                            <button onClick={() => onEditTitle(attachment.id)} className="btn-blue">Edit</button> */}

                        </div>
                            <TitleEdit cb={toggleEdit} onEditTitle={onEditTitle} id={attachment.id} isShown={isEdit} handleChange={handleChange} />
                    </div>
                })}

                <button onClick={() => toggleEdit()} className="btn-light" >Add an attachment</button>
                {/* {isAdd && <div className="attachment-form-container">
                    <form className="link-form" onSubmit={onSaveAttachment} >
                        <label htmlFor="link">Add a link</label>
                        <input type="text" id="url" name="url" placeholder="Add a link here" onChange={handleChange} />
                        <input className="btn-light" type="submit" value="Submit" />
                    </form >
                    <form className="link-form" onSubmit={onSaveAttachment}>
                        <label htmlFor="file">Add a file</label>
                        <input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
                        <input className="btn-light" type="submit" value="Submit" />
                    </form>
                </div>} */}
                {/* <input type="file" name="file" tabindex="-1" multiple="multiple"/> */}

            </div>

        </section>
    )
}


function TitleEdit({ isShown, cb, onEditTitle, handleChange, id }) {
    const [isTyping, setIsTyping] = useState(false)
    const pos = {
        left: '433px',
        top: '285px'
    }

    const onTyping = ev => {
        const { length } = ev.target.value
        if (length === 0) setIsTyping(false)
        else if (length > 0) setIsTyping(true)

    }


    return (
        <div className={`pop-over ${isShown ? 'shown' : ''} `} style={pos}>
            <header className="pop-over-header flex">
                <h5 className="popover-title">Edit attachment</h5>
                <button className="pop-over-btn" onClick={() => cb()}>
                    <span>
                        <Close />
                    </span>

                </button>
            </header>
            <div className="children-container">
                {/* <form onSubmit={() => onEditTitle(id)} className="col" >
                    <label htmlFor="link">Attach a link</label>
                    <input
                        onChange={handleChange}
                        onInput={onTyping}
                        type="text"
                        name="url"
                        id="link"
                        placeholder="Paste any link here..."
                        autoFocus
                        

                    />
                    <input className={`btn${isTyping ? '-btn' : '-light'}`} type="submit" value="Update" />
                </form> */}
            </div>
        </div>
    )
}