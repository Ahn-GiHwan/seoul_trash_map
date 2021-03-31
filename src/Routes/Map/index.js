import React, { useState } from 'react';
import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import jsonfile from '../../DATA/address.json'
import _ from 'lodash'
import Geocode from "react-geocode";
import { geocodeKey, mapkey } from '../../apiKey'

Geocode.setApiKey(geocodeKey);
Geocode.setLanguage("kor");
Geocode.setRegion("kor");

function Index() {
  const [nowLoc, setNowLoc] = useState({ lat: 37.555946, lng: 126.972317 })
  return (
    <Container>
      <Nav setNowLoc={setNowLoc}></Nav>
      <RenderAfterNavermapsLoaded
        ncpClientId={mapkey} // 자신의 네이버 계정에서 발급받은 Client ID
        error={<p>Maps Load Error</p>}
        loading={<div className="spinner-border"></div>}
      >
        <Map nowLoc={nowLoc} setNowLoc={setNowLoc}></Map>
      </RenderAfterNavermapsLoaded>
    </Container>
  );
}

function Map({ nowLoc, setNowLoc }) {
  const navermaps = window.naver.maps;
  return (
    <NaverMap style={{ width: "100%", height: "100%" }}
      zoom={15} center={nowLoc}>
      <Marker id="search__marker"
        style={{
          width: "100%",
          height: "400px",
        }}
        position={new navermaps.LatLng(nowLoc.lat, nowLoc.lng)}
        animation={1}
        defaultZoom={15}
        onClick={() => {
          setNowLoc(nowLoc)
          console.log(nowLoc)
        }}
      ></Marker>
    </NaverMap>
  );
}

function Nav({ setNowLoc }) {
  const file = jsonfile // 원본 파일

  const uniqDate = (file) => {
    const uniqFile = _.uniqBy(file, '자치구명')

    uniqFile.sort((a, b) => {
      return a.자치구명 < b.자치구명 ? -1 : 1;
    })

    let data = []

    for (let i = 0; i < uniqFile.length; i++) {
      data.push({ label: uniqFile[i].자치구명 })
    }

    return data
  }

  const [isOpen, setIsOpen] = useState(true)
  const [width, setWidth] = useState({ 'marginLeft': '-500px' })
  const [border, setBorder] = useState({ 'borderRight': '5px solid orange' })
  const [loc, setLoc] = useState('')

  const chagneIcon = () => isOpen ? setIsOpen(false) : setIsOpen(true)
  const isShowState = () => isOpen ? setWidth({ 'marginLeft': '0' }) : setWidth({ 'marginLeft': '-500px' })
  const chageBorder = () => isOpen ? setBorder({ 'borderRight': '5px solid #eee' }) : setBorder({ 'borderRight': '5px solid orange' })

  const onClickBtn = () => {
    chagneIcon()
    isShowState()
    chageBorder()
  }

  const onClick = (address) => {
    Geocode.fromAddress(`${address}`).then(
      (res) => {
        const { lat, lng } = res.results[0].geometry.location;
        setNowLoc({ lat, lng })
      },
      (err) => {
        alert(err);
      }
    );
    setLoc(address)
  };

  return (
    <Navbar className="navbar">
      <Bar style={border}>
        <Link to='/'>
          <HomeIcon>
            <Span className="material-icons size1">home</Span>
          </HomeIcon>
        </Link>
        <Link to='/chart'>
          <ChartIcon>
            <Span className="material-icons size1">leaderboard</Span>
          </ChartIcon>
        </Link>
      </Bar>
      <State style={width}>
        {loc === '' ? uniqDate(file).map((data, i) => {
          return (<Loc key={i} onClick={() => onClick(data.label)}>{data.label}</Loc>)
        }) : loc}
      </State>
      <ForwardIcon className="material-icons size1" onClick={onClickBtn}>
        {isOpen ? 'arrow_forward' : 'arrow_back'}
      </ForwardIcon>
    </Navbar>
  );
}

export default Index;

const Container = styled.section`
  width: 100%;
  height: 100vh;
`
// navbar css
const Navbar = styled.nav`
  padding:0;
  position: absolute;
  left: 0;
  z-index: 3;
  height: 100vh;
  display: flex;
  width:fit-content;
`
const Bar = styled.div`
  position: relative;
  width: 70px;
  height: 100vh;
  background-color:#fff;
  display: flex;
  flex-direction: column;
  justify-content:flex-start;
  align-items: center;  
  border-right: 5px solid orange;
  z-index: 2;
  transition: .7s;
`
const State = styled.div`
  position: relative;
  background-color: #fff;
  width: 250px;
  height: 100%;
  z-index: 1;
  transition:.3s;
  margin-left: -500px;
  overflow: auto;
  padding: 5px;
  ::-webkit-scrollbar{
    width: 5px;
    background-color: gray;
  }
  ::-webkit-scrollbar-thumb {
    background-color: orange;
  }
`
const ForwardIcon = styled.span`
  position: absolute;
  top:50%;
  right: -20px;
  background-color: white;
  color: gray;
  box-shadow: 2px 2px gray;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 10px 0;
  cursor: pointer;
`
const HomeIcon = styled.div`
  margin: 10px;
  padding: 10px;
  border: 3px solid orange;
  border-radius: 10px;
  transition: .2s;
  cursor: pointer;
  :hover{
    transform: scale(1.2);
    background-color: orange;
    color: white;
  }
`
const ChartIcon = styled.div`
  padding: 10px;
  border: 3px solid skyblue;
  border-radius: 10px;
  transition: .2s;
  cursor: pointer;
  :hover{
    transform: scale(1.2);
    background-color: skyblue;
    color: white;
  }
`
const Span = styled.span``

const Loc = styled.div`
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  padding: 10px;
  margin: 10px;
`