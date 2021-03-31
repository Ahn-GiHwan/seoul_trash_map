import React from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import '../../css/icon.css'

function Index() {
  return (
    <Container>
      <Main>
        <Title>서울시 가로쓰레기통</Title>
        <Icons>
          <Link to='/map'>
            <MapIcon className="mapIcon">
              <Span className="material-icons size2">map</Span>
            </MapIcon>
          </Link>
          <Link to='/chart'>
            <ChartIcon className="chartIcon">
              <Span className="material-icons size2">leaderboard</Span>
            </ChartIcon>
          </Link>
        </Icons>
        <InfoSection>
          <InfoLink href="http://data.seoul.go.kr/dataList/OA-15069/F/1/datasetView.do"
            target='_blank'
            alt="서울 열린데이터 광장"
            rel="noreferrer">
            쓰레기통 정보 엑셀 다운로드 바로가기
          </InfoLink>
        </InfoSection>
      </Main>
    </Container>
  );
}

export default Index;

// Style
const Container = styled.section`
  background-color: black;
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Main = styled.div`
  width: fit-content;
  height: 300px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: relative;
`
const Title = styled.span`
  font-size: 50px;
  font-weight: 700;
  margin: 10px;
`

const Icons = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`
const MapIcon = styled.div`
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

const InfoSection = styled.section`
  position:absolute;
  bottom:10px;
  display: flex;

`
const InfoLink = styled.a`
  transition:0.3s;
  :hover{
    transform:scale(1.1);
    font-weight: 1000;
    text-decoration: none;
    color: black;
  }
`
