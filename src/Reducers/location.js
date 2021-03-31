import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBnzhWnCSkCizWDPnob2VFDPegryBR4eik");
Geocode.setLanguage("kor");
Geocode.setRegion("kor");

export const SEARCHLOC = 'SEARCHLOC';

export const searchLoc = (address) => ({ type: SEARCHLOC, loc: address })

const initialState = {
  lat: 37.555946,
  lng: 126.972317
}

const location = (state = initialState, action) => {
  switch (action.type) {
    case SEARCHLOC:
      Geocode.fromAddress(action.loc)
        .then((res) => {
          state = res.results[0].geometry.location;
        }
        );
      return state
    default:
      return state
  }
}

export default location