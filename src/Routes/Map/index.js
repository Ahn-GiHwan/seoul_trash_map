import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import _ from 'lodash'

import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps'
import Geocode from "react-geocode";
import jsonfile from '../../DATA/address.json'

import { geocodeKey, mapkey } from '../../apiKey'

Geocode.setApiKey(geocodeKey);
Geocode.setLanguage("kor");
Geocode.setRegion("kor");

function Index() {
  const [nowLoc, setNowLoc] = useState({ lat: 37.555946, lng: 126.972317 })
  const [markerLoc, setMarkerLoc] = useState({ lat: 0, lng: 0 })
  const [zoom, setZoom] = useState(15)
  return (
    <Container>
      <Nav
        setNowLoc={setNowLoc}
        setZoom={setZoom}
        setMarkerLoc={setMarkerLoc}></Nav>
      <RenderAfterNavermapsLoaded
        ncpClientId={mapkey} // 자신의 네이버 계정에서 발급받은 Client ID
        error={<p>Maps Load Error</p>}
        loading={<div className="spinner-border"></div>}
      >
        <Map
          nowLoc={nowLoc}
          setNowLoc={setNowLoc}
          markerLoc={markerLoc}
          zoom={zoom}></Map>
      </RenderAfterNavermapsLoaded>
    </Container>
  );
}

function Map({ nowLoc, setNowLoc, markerLoc, zoom }) {
  const navermaps = window.naver.maps;
  // const dispatch = useDispatch()
  // const onClose = () => {
  //   dispatch({ type: 'CLOSE' })
  // }
  return (
    <NaverMap style={{ width: "100%", height: "100%" }}
      // onClick={onClose}
      zoom={zoom} center={nowLoc}>
      <Marker id="search__marker"
        style={{
          width: "100%",
          height: "400px",
        }}
        position={new navermaps.LatLng(markerLoc.lat, markerLoc.lng)}
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

function Nav({ setNowLoc, setMarkerLoc, setZoom }) {
  const file = jsonfile // 원본 파일

  const uniqDate = (file) => {
    const uniqFile = _.uniqBy(file, '자치구명') // 자치구명 중복제거

    uniqFile.sort((a, b) => {
      return a.자치구명 < b.자치구명 ? -1 : 1;
    })

    let data = []

    for (let i = 0; i < uniqFile.length; i++) {
      data.push({ label: uniqFile[i].자치구명, value: 0 })
    }
    // 자치구명만 빼서 새로운 배열객체데이터 생성

    let num = 0
    for (let i = 0; i < data.length; i++) {
      num = 0
      for (let j = 0; j < file.length; j++) {
        if (data[i].label === file[j].자치구명) {
          num = num + 1;
        }
      }
      data[i].value = num
    }
    // 자치구명의 갯수 빼서 저장

    return data
  }

  const filters = (loc) => {
    const locData = []
    for (let i = 0; i < file.length; i++) {
      if (file[i].자치구명 === loc) {
        locData.push(file[i])
      }
    }
    return locData
  }

  const [width, setWidth] = useState({ 'marginLeft': '-500px' })
  const [border, setBorder] = useState({ 'borderRight': '5px solid #FFA500' })

  const loc = useSelector(state => state.location.loc)
  const isOpen = useSelector(state => state.isOpen.isOpen)
  const dispatch = useDispatch();

  const onOpen = () => {
    dispatch({ type: 'OPEN' })
  }

  const onClose = () => {
    dispatch({ type: 'CLOSE' })
  }

  const changeIsOpen = () => isOpen ? onClose() : onOpen()
  const isShowState = () => isOpen ? setWidth({ 'marginLeft': '-500px' }) : setWidth({ 'marginLeft': '0' })
  const chageBorder = () => isOpen ? setBorder({ 'borderRight': '5px solid #FFA500' }) : setBorder({ 'borderRight': '5px solid #eee' })

  const onClickBtn = () => {
    changeIsOpen()
    isShowState()
    chageBorder()
  }

  const onChangeLoc = (loc) => {
    dispatch({ type: 'LOC', loc })
  }

  const onClickLoc = (address) => {
    Geocode.fromAddress(`${address}`).then(
      (res) => {
        const { lat, lng } = res.results[0].geometry.location;
        setNowLoc({ lat, lng })
      },
      (err) => {
        alert(err);
      }
    );
    setZoom(15)
    onChangeLoc(`${address}`)
  };

  const onClickInfo = (address) => {
    Geocode.fromAddress(`${address}`).then(
      (res) => {
        const { lat, lng } = res.results[0].geometry.location;
        setNowLoc({ lat, lng })
        setMarkerLoc({ lat, lng })
      },
      (err) => {
        alert(err);
      }
    );
    setZoom(17)
  };

  const view = loc === '' ? uniqDate(file).map((data, i) => {
    return (
      <Loc key={i} onClick={() => onClickLoc(data.label)}>
        {data.label}
        <Icons>
          <Span
            className="material-icons size2"
            style={{ 'transform': 'scale(1.2)', backgroundColor: '#F3D92C', borderRadius: '5px 5px 5px 0' }}>
            chat_bubble_outline</Span>
          <Alert>
            {data.value}
          </Alert>
        </Icons>
      </Loc >
    )
  }) : (
    <>
      <Title>{loc}
        <CancelBtn
          className='material-icons'
          onClick={() => { onChangeLoc('') }}>backspace
        </CancelBtn>
      </Title>
      <div>
        {filters(loc).map((data, i) => {
          return (
            <LocList key={i} onClick={(e) => { onClickInfo(e.target.innerHTML) }}>
              {data['도로(가로)명'] + ' ' + data.설치위치}
            </LocList>
          )
        })}
      </div>
    </>
  )
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
        <SearchIcon onClick={() => alert("아직 준비 중인 기능입니다")}>
          <Span
            className="material-icons size1"
            style={{ 'transform': 'scale(1.1)', 'fontWeight': '1000' }}>
            search
            </Span>
        </SearchIcon>
      </Bar>
      <State style={width}>
        {view}
      </State>
      <ForwardIcon className="material-icons size1" onClick={onClickBtn}>
        {isOpen ? 'arrow_back' : 'arrow_forward'}
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
  border-right: 5px solid #FFA500;
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
  padding: 10px;
  ::-webkit-scrollbar{
    width: 5px;
    background-color: gray;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #FFA500;
  }
`
const ForwardIcon = styled.span`
  position: absolute;
  top:50%;
  right: -20px;
  background-color: white;
  font-weight: 1000;
  box-shadow: 2px 2px gray;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 10px 0;
  cursor: pointer;
`
const HomeIcon = styled.div`
  margin: 10px 0 5px;
  padding: 10px;
  border: 3px solid #FFA500;
  border-radius: 10px;
  transition: .2s;
  cursor: pointer;
  :hover{
    transform: scale(1.2);
    background-color: #FFA500;
    color: white;
  }
`
const ChartIcon = styled.div`
  margin: 5px 0 10px;
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
const SearchIcon = styled.div`
  padding: 10px;
  border: 3px solid #7BA949;
  border-radius: 10px;
  transition: .2s;
  cursor: pointer;
  :hover{
    transform: scale(1.2);
    background-color: #7BA949;
    color: white;
  }
`
const Span = styled.span``

const Loc = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 10px;
  margin: 10px 7px;
  transition: .5s;
  font-size: 20px;
  cursor: pointer;
  :hover{
    transform: scale(1.1);
    background: linear-gradient( to left, #eee, #FFA500 );
    border-top: 1px solid transparent ;
    border-bottom: 1px solid transparent ;
    border-radius: 10px;
    font-weight: 1000;
    padding-left: 30px;
  }
`
const Icons = styled.div`
  position: relative;
  margin-left: 10px;
`
const Alert = styled.div`
  font-size: 15px;
  top: 6%;
  right: 11%;
  position: absolute;
  /* border-radius: 10px; */
  padding: 3px;
  /* margin-left: 10px; */
  font-weight: 800;
`;

const Title = styled.p`
  position: relative;
  font-size: 30px;
  font-weight: 1000;
  text-align: center;
  border-bottom: 2px solid #eee;
  padding: 10px;
`
const CancelBtn = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`
const LocList = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 10px;
  margin: 10px 7px;
  transition: .5s;
  font-size: 20px;
  cursor: pointer;
  :hover{
    transform: scale(1.1);
    background: linear-gradient( to left, #eee, skyblue );
    border-top: 1px solid transparent ;
    border-bottom: 1px solid transparent ;
    border-radius: 10px;
    font-weight: 1000;
  }
`