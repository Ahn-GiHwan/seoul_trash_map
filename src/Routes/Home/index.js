import React from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import '../../css/icon.css'
import excel from '../../img/excel.png'

function Index() {
  return (
    <Container>
      <Main>
        <Title>서울시 가로휴지통</Title>
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
            <Img src={excel} alt='excel_icon' />
            파일 다운로드
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
  @media screen and (max-width: 512px){
    width: 80vw;
    height: 80vh;
    margin: 0 auto;
  }
`
const Main = styled.div`
  width: 60vw;
  height: 300px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: relative;
  @media screen and (max-width: 512px){
    width: 80vw;
  }
`
const Title = styled.span`
  width: 100%;
  font-size: 50px;
  font-weight: 700;
  margin: 10px;
  text-align: center;
  @media screen and (max-width: 512px){
   font-size: 30px;
  }
`
const Icons = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`
const MapIcon = styled.div`
  display:flex;
  justify-content: center;
  padding: 10px;
  margin-right: 10px;
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
  display:flex;
  justify-content: center;
  padding: 10px;
  margin-left: 10px;
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
const Span = styled.span`
  text-decoration: none;
`

const InfoSection = styled.section`
  position:absolute;
  bottom:10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition:0.3s;
  :hover{
    transform:scale(1.1);
    font-weight: 1000;
    text-decoration: none;
    color: black;
  }
`
const Img = styled.img`
  margin: -9px 0;
`
const InfoLink = styled.a``
