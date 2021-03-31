import { combineReducers } from 'redux'
import location from './location'
import isOpen from './isOpen'

const reducer = combineReducers({
  location,
  isOpen
})

export default reducer