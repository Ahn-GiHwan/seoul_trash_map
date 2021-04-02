import React, { useState } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import styled from 'styled-components'
import '../../css/icon.css'
import _ from 'lodash'
import jsonfile from '../../DATA/address.json'

function Index() {
  const [select, setSelect] = useState('서울특별시')
  const file = jsonfile // 원본 파일

  const uniqFile = () => {
    const uniqFile = _.uniqBy(file, '자치구명')

    uniqFile.sort((a, b) => {
      return a.자치구명 < b.자치구명 ? -1 : 1;
    })
    return uniqFile
  }

  const seoul = () => {

    let data = []

    for (let i = 0; i < uniqFile().length; i++) {
      data.push({ label: uniqFile()[i].자치구명, value: 0 })
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

  const borough = () => {
    let data = []
    for (let i = 0; i < file.length; i++) {
      if (file[i].자치구명 === select) {
        data.push({ label: file[i]['도로(가로)명'], value: 0 })
      }
    }

    let num = 0
    let chartData = _.uniqBy(data, 'label')

    for (let i = 0; i < chartData.length; i++) {
      num = 0
      for (let j = 0; j < data.length; j++) {
        if (chartData[i].label === data[j].label) {
          num = num + 1;
        }
      }
      chartData[i].value = num
    }

    return chartData
  }

  ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

  const back = () => {
    window.history.back()
  }

  const checked = (e) => {
    let Els = document.querySelectorAll('.list');
    for (let i = 0; i < Els.length; i++) {
      if (Els[i].innerHTML === e.target.value) {
        Els[i].style.boxShadow = 'none';
      } else {
        Els[i].style.boxShadow = '4px 4px gray';
      }
    }
  }

  const defaultChecked = (e) => {
    let Els = document.querySelectorAll('.list');
    for (let i = 0; i < Els.length; i++) {
      if (Els[i].innerHTML === '전체') {
        Els[i].style.boxShadow = 'none';
      } else {
        Els[i].style.boxShadow = '4px 4px gray';
      }
    }
  }

  const chartData = select === '서울특별시' ? seoul() : borough()

  const chartConfigs = {
    type: 'column2d',
    width: '100%',
    height: 500,
    dataFormat: 'json',
    dataSource: {
      chart: {
        caption: `${select} 휴지통 현황`,
        subCaption: "최신 날짜 : 2019.9",
        theme: "fusion",
        baseFont: 'Hi Melody, cursive',
      },
      data: chartData
    },
  };

  return (
    <Container>
      <Menus>
        <BackIcon
          className="material-icons size2"
          onClick={back}>
          arrow_back
        </BackIcon>
        <Title><Span className='material-icons size2'>location_on</Span>지역</Title>
        <Lists>
          <List
            onClick={e => {
              setSelect('서울특별시')
              defaultChecked(e)
            }}>
            <Input type="radio" id='서울특별시' value='서울특별시' />
            <Label htmlFor='서울특별시' className='list' style={{ 'boxShadow': 'none' }}>전체</Label>
          </List>
          {uniqFile().map((loc, i) => {
            return (
              <List
                key={i}
                onClickCapture={e => {
                  setSelect(e.target.value)
                  checked(e)
                }}
              >
                <Input type="radio" id={loc.자치구명} value={loc.자치구명} />
                <Label htmlFor={loc.자치구명} className='list'>{loc.자치구명}</Label>
              </List>
            )
          })}
        </Lists>
      </Menus>
      <ChartDiv>
        <ReactFC {...chartConfigs} />
      </ChartDiv>
    </Container>
  );
}

export default Index;

const Container = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 512px){
    height: 85vh;
  }
`
const Menus = styled.div`
  position: relative;
  width: 80%;
  background-color: skyblue;
  border-radius: 10px;
  margin-bottom: 10px;
  @media screen and (max-width: 512px) {
    height: 100px;
  }
`
const Title = styled.div`
  width: 98%;
  border-bottom: 3px solid #eee;
  margin: 10px;
  font-size: 30px;
  padding: 10px;
  font-weight: 1000;
  display: flex;
  align-items: center;
  @media screen and (max-width: 512px) {
    font-size: 25px;
    margin: 3px;
    padding: 5px;
  }
`
const Lists = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 7px;
  ::-webkit-scrollbar{
    width: 5px;
    border-radius: 10px;
    background-color: #eee;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #5D62B5;
    border-radius: 10px;
  }
  @media screen and (max-width: 512px) {
    height: 50px;
    overflow: auto;
  }
`
const List = styled.div``
const Input = styled.input``
const Span = styled.span``

const Label = styled.label`
  width: 80px;
  text-align: center;
  font-size:15px;
  box-shadow: 4px 4px gray;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
  background-color: #fff;
  transition: .3s;
  border: 1px solid #fff;
  @media screen and (max-width: 512px) {
    margin: 5px 2px;
    width: 49px; 
    font-size: 10px;
    font-weight: 1000;
  }
`
const ChartDiv = styled.div`
  position: relative;
  width: 80vw;
  height: 56vh;
  background-color: skyblue;
  border-radius: 10px;
  padding: 10px;
  @media screen and (max-width: 512px){
    width: 95vw;
    padding: 5px;
    height: fit-content;
  }
`
const BackIcon = styled.span`
  position: absolute;
  top: -20px;
  right: -20px;
  border: 3px solid skyblue;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  animation-duration: 1s;
  animation-name: slidein;
  color: black;
  transition: .2s;
  :hover{
    transform: scale(1.2)
  }
  @media screen and (max-width: 512px) {
    top: 0;
    right: 0;
  }
  
  @keyframes slidein {
  from { 
    top: -20px;
    right: 300px;
  }
  to { 
    top: -20px;
    right: -20px;
  }
}
`