import React, { useEffect, useState } from 'react';
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
        ncpClientId={mapkey}
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
  return (
    <NaverMap
      style={{ width: "100%", height: "100%" }}
      zoom={zoom} center={nowLoc}>
      <Marker
        style={{ width: "100%", height: "400px" }}
        position={new navermaps.LatLng(markerLoc.lat, markerLoc.lng)}
        animation={1}
        defaultZoom={15}
        onClick={() => setNowLoc(nowLoc)}>
      </Marker>
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
  const [isSearch, setIsSearch] = useState(false)

  const loc = useSelector(state => state.location.loc)
  const isOpen = useSelector(state => state.isOpen.isOpen)
  const dispatch = useDispatch();

  const onOpen = () => {
    dispatch({ type: 'OPEN' })
  }

  const onClose = () => {
    dispatch({ type: 'CLOSE' })
  }

  useEffect(() => {
    isShowState()
    chageBorder()
    changeBtn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const changeIsOpen = () => isOpen ? onClose() : onOpen()
  const isShowState = (True, False) => isOpen ? setWidth({ 'marginLeft': '0' }) : setWidth({ 'marginLeft': '-500px' })
  const chageBorder = () => isOpen ? setBorder({ 'borderRight': '5px solid #eee' }) : setBorder({ 'borderRight': '5px solid #FFA500' })
  const changeBtn = () => {
    const btnEl = document.querySelector('.btn')
    if (isOpen) {
      btnEl.style.backgroundColor = '#F2DA00'
    } else {
      btnEl.style.backgroundColor = 'white'

    }
  }

  const onClickBtn = () => {
    changeIsOpen()
    isShowState()
    chageBorder()
  }

  const onClickBtn_phone = () => {
    changeIsOpen()
    isShowState()
    changeBtn()
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
    setZoom(19)
  };

  const stateLists = loc === '' ? uniqDate(file).map((data, i) => {
    return (
      <Loc key={i} onClick={() => onClickLoc(data.label)}>
        {i + 1}. {data.label}
        <Icons>
          <Span
            className="material-icons size2"
            style={{
              transform: 'scale(1.2)',
              backgroundColor: '#F3D92C',
              borderRadius: '5px 5px 5px 0'
            }}>
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
          onClick={() => onChangeLoc('')}>arrow_back
        </CancelBtn>
      </Title>
      <Div>
        {filters(loc).map((data, i) => {
          return (
            <LocList key={i} onClick={(e) => onClickInfo(e.target.innerHTML)}>
              {i + 1}. {data['도로(가로)명'] + ' ' + data.설치위치}
            </LocList>
          )
        })}
      </Div>
    </>
  )
  const searchModal = isSearch ?
    <>
      <SearchBack>
      </SearchBack>
      <SearchDiv>
        <InputDiv>
          <SearchSpan className='material-icons size2'>search</SearchSpan>
          <Input
            type="text"
            placeholder='ex) 노원구 하계역'
            className='input'
            autoFocus />
        </InputDiv>
        <ResultDiv>
          아직 서비스 준비중...
        </ResultDiv>
        <CloseBtn
          className='material-icons'
          onClick={() => setIsSearch(false)}
        >
          backspace
        </CloseBtn>
      </SearchDiv>
    </> : ''

  return (
    <>
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
          <SearchIcon onClick={() => setIsSearch(true)}>
            <Span
              className="material-icons size1"
              style={{ 'transform': 'scale(1.1)', 'fontWeight': '1000' }}>
              search
            </Span>
          </SearchIcon>
          <MenuIcon onClick={() => {
            onClickBtn_phone()
          }} className="btn" >
            <Span
              className='material-icons size1'
              style={{ 'transform': 'scale(1.1)', 'fontWeight': '1000' }}>
              {isOpen ? 'clear' : 'menu'}
            </Span>
          </MenuIcon>
        </Bar>
        <State style={width}>
          {stateLists}
        </State>
        <ForwardIcon className="material-icons size1" onClick={onClickBtn}>
          {isOpen ? 'arrow_back' : 'arrow_forward'}
        </ForwardIcon>
      </Navbar>
      {searchModal}
    </>
  );
}

export default Index;

const Container = styled.section`
  width: 100%;
  height: 100vh;
`
const Navbar = styled.nav`
  padding:0;
  position: absolute;
  left: 0;
  z-index: 3;
  height: 100vh;
  display: flex;
  width:fit-content;
  @media screen and (max-width: 512px){
    position: fixed;
    bottom: 0;
    right: 0;
    height: 10vh;
    width: 100%;
  }
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
  @media screen and (max-width: 512px){
    width: 100%;
    height: 10vh;
    flex-direction: row;
    justify-content:space-around;
    align-items: center;
    align-content: center;
    border-right: 0px solid;
    border-top: 1px solid orange;
  }
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
  ::-webkit-scrollbar{
    width: 5px;
    background-color: gray;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #FFA500;
  }
  @media screen and (max-width: 512px) {
    position: absolute;
    top: -220px;
    left: 0;
    width: 100%;
    height: 220px;
    border-top: 3px double orange;

    ::-webkit-scrollbar{
    width: 5px;
    background-color: #eee;
  }
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
  display:flex;
  justify-content: center;
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
  @media screen and (max-width: 512px){
    margin: 0;
  }
`
const ChartIcon = styled.div`
  display:flex;
  justify-content: center;
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
  @media screen and (max-width: 512px){
    margin: 0;
  }
`
const SearchIcon = styled.div`
  display:flex;
  justify-content: center;
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
  @media screen and (max-width: 512px){
    margin: 0;
  }
`
const MenuIcon = styled.div`
  display: none;
  padding: 10px;
  border: 3px solid #F2DA00;
  border-radius: 10px;
  transition: .2s;
  cursor: pointer;
  @media screen and (max-width: 512px){
    display:flex;
    justify-content: center;
    margin: 0;
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
    background: linear-gradient( to left, #eee, #FFA500 );
    border-top: 1px solid transparent ;
    border-bottom: 1px solid transparent ;
    border-radius: 10px;
    font-weight: 1000;
    padding-left: 30px;
  }
  @media screen and (max-width: 512px) {
    font-size: 15px;
    justify-content: center;
  }
`
const Icons = styled.div`
  position: relative;
  margin-left: 10px;
`
const Alert = styled.div`
  font-size: 15px;
  top: 6%;
  right: 6%;
  position: absolute;
  padding: 3px;
  font-weight: 800;
`;

const Title = styled.p`
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  font-size: 30px;
  font-weight: 1000;
  text-align: center;
  border-bottom: 2px solid #eee;
  padding: 10px;
  @media screen and (max-width: 512px) {
    font-size: 20px;
  }
`
const CancelBtn = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  @media screen and (max-width: 512px) {
    right: 10px;
  }
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
  z-index: 1;
  :hover{
    background: linear-gradient( to left, #eee, skyblue );
    border-top: 1px solid transparent ;
    border-bottom: 1px solid transparent ;
    border-radius: 10px;
    font-weight: 1000;
  }
  @media screen and (max-width: 512px) {
    font-size: 15px;
  }
`
const SearchBack = styled.div`
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  background-color: white;
  opacity: 0.5;
`
const SearchDiv = styled.div`
  width: 400px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -250px 0 0 -200px;
  background-color: #7BA949;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  @media screen and (max-width: 512px){
    width: 300px;
    height: 400px;
    margin: -220px 0 0 -150px;
  }
`
const InputDiv = styled.div`
  width: 300px;
  position: relative;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  @media screen and (max-width: 512px){
    width: 200px;
  }
`
const Input = styled.input`
  width: 100%;
  border: none;
  border-bottom: 3px solid black;
  padding: 5px 15px 5px 45px;
  outline: none;
  font-size: 20px;
  font-weight: 800;
  @media screen and (max-width: 512px){
    font-size: 17px;
    padding: 0 12px 4px 42px;
  }
`
const SearchSpan = styled.span`
  position: absolute;
  top: 12px;
  left: 14px;
  @media screen and (max-width: 512px){
    top: 5px;
  }
`
const ResultDiv = styled.div`
  width: 100%;
  height: 90%;
  margin-top: 20px;
  border: 3px solid #eee;
  border-radius: 10px;
  background-color: #fff;
  overflow: auto;
`
const CloseBtn = styled.span`
  position: absolute;
  top: 0;
  right: 6px;
  color: white;
  font-size: 40px;
  cursor: pointer;
  @media screen and (max-width: 512px){
    font-size: 30px;
  }
`

const Div = styled.div``