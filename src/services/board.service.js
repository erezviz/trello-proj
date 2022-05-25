import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
// import { getActionRemoveBoard, getActionAddBoard, getActionUpdateBoard } from '../store/board.actions.js'

const STORAGE_KEY = 'board'
    // const boardChannel = new BroadcastChannel('boardChannel')
    // const listeners = []

export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyBoard,
    // subscribe,
    // unsubscribe

}
window.cs = boardService;


function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
        // return axios.get(`/api/board/${boardId}`)
}
async function remove(boardId) {
    // return new Promise((resolve, reject) => {
    //     setTimeout(reject, 2000)
    // })
    // return Promise.reject('Not now!');
    await storageService.remove(STORAGE_KEY, boardId)
        // boardChannel.postMessage(getActionRemoveBoard(boardId))
}
async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await storageService.put(STORAGE_KEY, board)
            // boardChannel.postMessage(getActionUpdateBoard(savedBoard))

    } else {
        // Later, owner is set by the backend
        board.owner = userService.getLoggedinUser()
        savedBoard = await storageService.post(STORAGE_KEY, board)
            // boardChannel.postMessage(getActionAddBoard(savedBoard))
    }
    return savedBoard
}

function getEmptyBoard() {
    return {
        title: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}

// function subscribe(listener) {
//     boardChannel.addEventListener('message', listener)
// }

// function unsubscribe(listener) {
//     boardChannel.removeEventListener('message', listener)
// }


//? TEST DATA FOR HOMEPAGE
// storageService.post(STORAGE_KEY, { _id: utilService.makeId(), title: 'Board 1' }).then(x => console.log(x))
// storageService.post(STORAGE_KEY, { _id: utilService.makeId(), title: 'Board 2' }).then(x => console.log(x))
// storageService.post(STORAGE_KEY, { _id: utilService.makeId(), title: 'Board 3' }).then(x => console.log(x))