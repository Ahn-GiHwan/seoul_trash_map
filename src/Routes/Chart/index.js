import React from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import '../../css/icon.css'
import _ from 'lodash'
import jsonfile from '../../DATA/address.json'

const file = jsonfile // 원본 파일

const createDate = (file) => {
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

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const chartConfigs = {
  type: 'column2d',
  width: 600,
  height: 400,
  dataFormat: 'json',
  dataSource: {
    chart: {
      caption: "서울특별시 자치구별 가로쓰레기통 갯수",
      subCaption: "최신 날짜 : 2019.9",
      theme: "fusion",
      baseFont: 'Hi Melody, cursive',
    },
    data: createDate(file)
  },
};

function index() {
  return (
    <Container>
      <ChartDiv>
        <ReactFC {...chartConfigs} />
        <Link to='/'><Span className="material-icons size2">keyboard_backspace</Span></Link>
      </ChartDiv>
    </Container>
  );
}

export default index;

const Container = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ChartDiv = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
  background-color: skyblue;
  border-radius: 10px;
  padding: 20px;
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