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

  const chartData =
    select === '서울특별시' ? seoul() : borough()

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
      <Select onChange={(e) => { setSelect(e.target.value) }}>
        <Option value='서울특별시'>서울특별시</Option>
        {uniqFile().map((loc, i) => {
          return (<Option value={loc.자치구명} key={i}>{loc.자치구명}</Option>)
        })}
      </Select>
      <ChartDiv>
        <ReactFC {...chartConfigs} />
        <Span
          className="material-icons size2"
          onClick={back}>
          arrow_back
        </Span>
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
    height: 80vh;
  }
`
const Select = styled.select`
  font-size: 20px;
  padding: 10px;
  margin-bottom: 10px;
  /* border: 1px solid #5D62B5; */
  /* border-bottom: 3px solid #5D62B5; */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  outline: none;
  /* appearance:none; */
  ::-webkit-scrollbar{
    width: 5px;
    background-color: gray;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #FFA500;
  }
`

const Option = styled.option`
  font-size: 15px;
  border: 4px solid black;

  /* text-decoration: underline; */
  /* background-color: red; */
`
const ChartDiv = styled.div`
  position: relative;
  width: 80vw;
  height: fit-content;
  background-color: skyblue;
  border-radius: 10px;
  padding: 10px;
  @media screen and (max-width: 512px){
    width: 95vw;
    padding: 5px;
  }
`
const Span = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
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
  
  @keyframes slidein {
  from { 
    top: -10px;
    right: 300px;
  }
  to { 
    top: -10px;
    right: -10px;
  }
}
`