export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';

export const open = () => ({ type: OPEN })
export const close = () => ({ type: CLOSE })

const initialState = {
  isOpen: true
}

const isOpen = (state = initialState, action) => {
  switch (action.type) {
    case OPEN:
      return { ...state, isOpen: true }
    case CLOSE:
      return { ...state, isOpen: false }
    default:
      return state
  }
}

export default isOpen