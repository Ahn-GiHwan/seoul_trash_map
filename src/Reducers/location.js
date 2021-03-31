export const LOC = 'LOC';

export const loc = (loc) => ({ type: LOC, loc })

const initialState = {
  loc: ''
}

const location = (state = initialState, action) => {
  switch (action.type) {
    case LOC:
      return { ...state, loc: action.loc }
    default:
      return state
  }
}

export default location