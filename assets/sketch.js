// 🔑 여기에 본인의 공공데이터 API 키를 입력하세요
const API_KEY = "XfJWQc1l1vgddnQOTbhOd8s5ncU9dQhwLLg%2B5G9gKD4Qi7cKrBWJn0GQBJU26dGPqtQpsDx9Z1OuyzDmGzpuBw%3D%3D";

// 오행별 카운트 변수
let fiveElements = {
  목: 0,
  화: 0,
  토: 0,
  금: 0,
  수: 0,
};

let mainElements = "화";

// 천간 → 오행 매핑
const ganToElement = {
  갑: "목", 을: "목",
  병: "화", 정: "화",
  무: "토", 기: "토",
  경: "금", 신: "금",
  임: "수", 계: "수",
};

// 지지 → 오행 매핑
const jiToElement = {
  자: "수", 축: "토", 인: "목", 묘: "목", 진: "토", 사: "화",
  오: "화", 미: "토", 신: "금", 유: "금", 술: "토", 해: "수",
};

// 시간 천간지지 계산
function getSiGanJi(iljin, hour) {
  const ilgan = iljin.charAt(0);
  let siArr = [];

  if (["갑", "기"].includes(ilgan)) {
    siArr = ["갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유", "갑술", "을해"];
  } else if (["을", "경"].includes(ilgan)) {
    siArr = ["병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미", "갑신", "을유", "병술", "정해"];
  } else if (["병", "신"].includes(ilgan)) {
    siArr = ["무자", "기축", "경인", "신묘", "임진", "계사", "갑오", "을미", "병신", "정유", "무술", "기해"];
  } else if (["정", "임"].includes(ilgan)) {
    siArr = ["경자", "신축", "임인", "계묘", "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해"];
  } else if (["무", "계"].includes(ilgan)) {
    siArr = ["임자", "계축", "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해"];
  }

  const index = Math.floor(((hour + 1) % 24) / 2);
  return siArr[index];
}

// 오행 분석
function analyzeElements(ganzhiArray) {
  fiveElements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (let item of ganzhiArray) {
    const gan = item.charAt(0);
    const ji = item.charAt(1);

    if (ganToElement[gan]) fiveElements[ganToElement[gan]]++;
    if (jiToElement[ji]) fiveElements[jiToElement[ji]]++;
  }

  console.log("오행 분석 결과:", fiveElements);

  redraw();
  return fiveElements;
}

function analyzemainElements(ganzhiArray) {
  mainElements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (let item of ganzhiArray) {
    const gan = item.charAt(0);
    if (ganToElement[gan]) mainElements = ganToElement[gan];
  }
  redraw();
  return mainElements;
}

// 사주 분석 버튼 클릭 시 실행
function analyzeSaju() {
  const date = document.getElementById("birthdate").value;
  const hour = parseInt(document.getElementById("birthhour").value);
  const [year, month, day] = date.split("-");

  const url = `https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?solYear=${year}&solMonth=${month}&solDay=${day}&ServiceKey=${API_KEY}`;

  fetch(url)
    .then(res => res.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(xml => {
      const iljin = xml.querySelector("lunIljin").textContent;
      const wolgeon = xml.querySelector("lunWolgeon").textContent;
      const secha = xml.querySelector("lunSecha").textContent;

      const siganji = getSiGanJi(iljin, hour);

      console.log("일간지:", iljin, "시간간지:", siganji);

      const elements = analyzeElements([secha, wolgeon, iljin, siganji]);
      const mainelement = analyzemainElements([iljin]);
      console.log("main character : ", mainelement);

      // 오행 갯수 텍스트 표시
      const infoText = `You have <br> <b>${elements.목}</b> 🌳tree elemets, <br> <b>${elements.화}</b> 🔥fire elements,<br> <b>${elements.토}</b> 🪨soil elements, <br> <b>${elements.금}</b> 🪙metal elements <br> and <b>${elements.수}</b> 💧water elements.`;
      let mainelmentenglish;
      if (mainelement == "목") {
        mainelementenglish = "tree🌳";
      } else if (mainelement == "화") {
        mainelementenglish = "fire🔥";
      }
      else if (mainelement == "토") {
        mainelementenglish = "soil🪨";
      } else if (mainelement == "금") {
        mainelementenglish = "metal🪙";
      } else if (mainelement == "수") {
        mainelementenglish = "water💧";
      }
      const maininfo = `Your main element is <b>${mainelementenglish}</b>.`;
      document.getElementById("main-element").innerHTML = maininfo;
      document.getElementById("element-info").innerHTML = infoText;


      const treenum = elements.목;
      const firenum = elements.화;
      const soilnum = elements.토;
      const metalnum = elements.금;
      const waternum = elements.수;

      drawTalisman(treenum, firenum, soilnum, metalnum, waternum, mainelement); // 간단한 부적 도형 그리기
    })
    .catch(err => console.error("API 오류 발생:", err));




}



window.analyzeSaju = analyzeSaju;

// ----------------- p5.js --------------------
let treeimg, waterimg, fireimg, earthimg, metalimg;

function preload() {
  treeimg = loadImage('assets/tree.png');
  waterimg = loadImage('assets/water.png');
  fireimg = loadImage('assets/fire.png');
  soilimg = loadImage('assets/soil.png');
  metalimg = loadImage('assets/metal.png');
}

function setup() {
  const canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  noLoop();
}

function draw() {
  background(255);

  const colors = {
    목: "#7ed9ff",   // 기존 녹색보다 연하고 산뜻한 연두
    화: "#ff8a65",   // 기존 빨강보다 연한 코랄 오렌지
    토: "#ffd180",   // 기존 주황보다 연한 베이지 오렌지
    금: "#fafafa",   // 기존 회색보다 밝은 실버 그레이
    수: "#303030",   // 기존 검정 대신 연한 하늘색(물 느낌)
  };

  const total = Object.values(fiveElements).reduce((a, b) => a + b, 0);
  const barWidth = width / 5;
  let i = 0;

  for (const [el, count] of Object.entries(fiveElements)) {
    const h = map(count, 0, total || 1, 0, height);
    fill(colors[el]);
    rect(i * barWidth, height - h, barWidth - 10, h);
    i++;
  }
}

// 간단한 부적 도형 출력
function drawTalisman(tn, fn, sn, mn, wn, me) {
  noStroke();
  clear();
  background("#fafafa");

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 100;

  const shapeMap = {
    목: "rect",
    화: "triangle",
    토: "ellipse",
    금: "line",
    수: "arc",
  };

  const colors = {
    목: "#7ed9ff",
    화: "#ff8a00",
    토: "#ffdf80",
    금: "#fafafa",
    수: "#303030",
  };

  let backgroundcolored = false;

  //배경색 깔기 - 과한 기운들 눌러주기
  if (tn >= 3) {
    if (fn < 3 && sn < 3 && mn < 3 && wn < 3) {
      fill(colors.금);
      rect(0, 0, width, height);
    }
    else if (fn >= 3) {
      fill(colors.금);
      rect(0, 0, width / 2, height);
      fill(colors.수);
      rect(width / 2, 0, width / 2, height);
    }
    else if (sn >= 3) {
      fill(colors.목)
      rect(0, 0, width / 2, height);
      fill(colors.금);
      rect(width / 2, 0, width / 2, height);
    }
    else if (mn >= 3) {
      fill(colors.금);
      rect(0, 0, width / 2, height);
      fill(colors.화);
      rect(width / 2, 0, width / 2, height);
    }
    else if (wn >= 3) {
      fill(colors.토);
      rect(0, 0, width / 2, height);
      fill(colors.금);
      rect(width / 2, 0, width / 2, height);
    }
    backgroundcolored = true;
  }
  if (fn >= 3) {
    if (tn < 3 && sn < 3 && mn < 3 && wn < 3) {
      fill(colors.수);
      rect(0, 0, width, height);
    }
    else if (tn >= 3) {
      fill(colors.금);
      rect(0, 0, width / 2, height);
      fill(colors.수);
      rect(width / 2, 0, width / 2, height);
    }
    else if (sn >= 3) {
      fill(colors.수);
      rect(0, 0, width / 2, height);
      fill(colors.목);
      rect(width / 2, 0, width / 2, height);
    }
    else if (mn >= 3) {
      fill(colors.화);
      rect(0, 0, width / 2, height);
      fill(colors.수);
      rect(width / 2, 0, width / 2, height);
    }
    else if (wn >= 3) {
      fill(colors.수);
      rect(0, 0, width / 2, height);
      fill(colors.토);
      rect(width / 2, 0, width / 2, height);
    }
    backgroundcolored = true;
  }
  if (mn >= 3) {
    if (tn < 3 && fn < 3 && sn < 3 && wn < 3) {
      fill(colors.화);
      rect(0, 0, width, height);
    }
    else if (tn >= 3) {
      fill(colors.금);
      rect(0, 0, width / 2, height);
      fill(colors.화);
      rect(width / 2, 0, width / 2, height);
    }
    else if (fn >= 3) {
      fill(colors.화);
      rect(0, 0, width / 2, height);
      fill(colors.수);
      rect(width / 2, 0, width / 2, height);
    }
    else if (sn >= 3) {
      fill(colors.목);
      rect(0, 0, width / 2, height);
      fill(colors.화);
      rect(width / 2, 0, width / 2, height);
    }
    else if (wn >= 3) {
      fill(colors.화);
      rect(0, 0, width / 2, height);
      fill(colors.토);
      rect(width / 2, 0, width / 2, height);
    }
    backgroundcolored = true;
  }
  if (wn >= 3) {
    if (tn < 3 && fn < 3 && sn < 3 && mn < 3) {
      fill(colors.토);
      rect(0, 0, width, height);
    }
    else if (tn >= 3) {
      fill(colors.금);
      rect(0, 0, width / 2, height);
      fill(colors.토);
      rect(width / 2, 0, width / 2, height);
    }
    else if (fn >= 3) {
      fill(colors.토);
      rect(0, 0, width / 2, height);
      fill(colors.수);
      rect(width / 2, 0, width / 2, height);
    }
    else if (sn >= 3) {
      fill(colors.목);
      rect(0, 0, width / 2, height);
      fill(colors.토);
      rect(width / 2, 0, width / 2, height);
    }
    else if (mn >= 3) {
      fill(colors.토);
      rect(0, 0, width / 2, height);
      fill(colors.화);
      rect(width / 2, 0, width / 2, height);
    }
    backgroundcolored = true;
  }
  if (sn >= 3) {
    if (tn < 3 && fn < 3 && mn < 3 && wn < 3) {
      fill(colors.토);
      rect(0, 0, width, height);
    }
    else if (tn >= 3) {
      fill(colors.금);
      rect(0, 0, width / 2, height);
      fill(colors.목);
      rect(width / 2, 0, width / 2, height);
    }
    else if (fn >= 3) {
      fill(colors.목);
      rect(0, 0, width / 2, height);
      fill(colors.수);
      rect(width / 2, 0, width / 2, height);
    }
    else if (mn >= 3) {
      fill(colors.화);
      rect(0, 0, width / 2, height);
      fill(colors.목);
      rect(width / 2, 0, width / 2, height);
    }
    else if (wn >= 3) {
      fill(colors.목);
      rect(0, 0, width / 2, height);
      fill(colors.토);
      rect(width / 2, 0, width / 2, height);
    }
    backgroundcolored = true;
  }

  //배경색 칠하거나 선 긋기 / 0개인 오행들 / 부족한 부분 채워주기
  if (tn == 0) {
    if (backgroundcolored == true) {
      stroke(colors.목);
      strokeWeight(100);
      line(0, 0, width, height);
      noStroke();
    } else {
      if (fn == 0) {
        fill(colors.목);
        rect(0, 0, width / 2, height);
        fill(colors.화);
        rect(width / 2, 0, width / 2, height);
      }
      else if (sn == 0) {
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if (mn == 0) {
        fill(colors.목);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if (wn == 0) {
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else{
        fill(colors.목);
        rect(0, 0, width, height);
      }
      backgroundcolored = true;
    }
  }
  if (fn == 0) {
    if (backgroundcolored == true) {
      stroke(colors.화);
      strokeWeight(100);
      line(width/4*3, height, width/4*3, 0);
      noStroke();
    }
    else {
      if (tn == 0) {
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if (sn == 0) {
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.화);
        rect(width / 2, 0, width / 2, height);
      }
      else if (mn == 0) {
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if (wn == 0) {
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.화);
        rect(width / 2, 0, width / 2, height);
      }
      else{
        fill(colors.화);
        rect(0, 0, width, height);
      }
      backgroundcolored = true;
    }
  }
  if (sn == 0) {
    if (backgroundcolored == true) {
      stroke(colors.토);
      strokeWeight(100);
      line(0, height/2, width, height/2);
      noStroke();
    }
    else {
      if (tn == 0) {
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if (fn == 0) {
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.토);
        rect(width / 2, 0, width / 2, height);
      }
      else if (mn == 0) {
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if (wn == 0) {
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.토);
        rect(width / 2, 0, width / 2, height);
      }
      else{
        fill(colors.토);
        rect(0, 0, width, height);
      }
      backgroundcolored = true;
    }
  }
  if (mn == 0) {
    if (backgroundcolored == true) {
      stroke(colors.금);
      strokeWeight(100);
      line(width/4, 0, width / 4, height);
      noStroke();
    }
    else {
      if (tn == 0) {
        fill(colors.금);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if (fn == 0) {
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if (sn == 0) {
        fill(colors.금);
        rect(0, 0, width / 2, height);
        fill(colors.토);
        rect(width / 2, 0, width / 2, height);
      }
      else if (wn == 0) {
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else{
        fill(colors.금);
        rect(0, 0, width, height);
      }
      backgroundcolored = true;
    }
  }
  if (wn == 0) {
    if (backgroundcolored == true) {
      stroke(colors.수);
      strokeWeight(100);
      line(0, 0, width / 2, height);
      line(width / 2, height, width, 0);
      noStroke();
    }
    else {
      if (tn == 0) {
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if (fn == 0) {
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.수);
        rect(width / 2, 0, width / 2, height);
      }
      else if (sn == 0) {
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.토);
        rect(width / 2, 0, width / 2, height);
      }
      else if (mn == 0) {
        fill(colors.금);
        rect(0, 0, width / 2, height);
        fill(colors.수);
        rect(width / 2, 0, width / 2, height);
      }
      else{
        fill(colors.수);
        rect(0, 0, width, height);
      }
      backgroundcolored = true;
    }
  }

  //아직까지 배경 안 채워졌다면 2/2/2/1/1 조합
  if(backgroundcolored == false) {
    if(tn == 1){
      if(fn == 1){
        fill(colors.목);
        rect(0, 0, width / 2, height);
        fill(colors.화);
        rect(width / 2, 0, width / 2, height);
      }
      else if(sn == 1){
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if(mn == 1){
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if(wn == 1){
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
    }
    else if(fn == 1){
      if(tn == 1){
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if(sn == 1){
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.화);
        rect(width / 2, 0, width / 2, height);
      }
      else if(mn == 1){
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if(wn == 1){
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.화);
        rect(width / 2, 0, width / 2, height);
      }
    }
    else if(sn == 1){
      if(tn == 1){
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if(fn == 1){
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.토);
        rect(width / 2, 0, width / 2, height);
      }
      else if(mn == 1){
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if(wn == 1){
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.토);
        rect(width / 2, 0, width / 2, height);
      }
    }
    else if(mn == 1){
      if(tn == 1){
        fill(colors.금);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if(fn == 1){
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if(sn == 1){
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
      else if(wn == 1){
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.금);
        rect(width / 2, 0, width / 2, height);
      }
    } else if(wn == 1){
      if(tn == 1){
        fill(colors.수);
        rect(0, 0, width / 2, height);
        fill(colors.목);
        rect(width / 2, 0, width / 2, height);
      }
      else if(fn == 1){
        fill(colors.화);
        rect(0, 0, width / 2, height);
        fill(colors.수);
        rect(width / 2, 0, width / 2, height);
      }
      else if(sn == 1){
        fill(colors.토);
        rect(0, 0, width / 2, height);
        fill(colors.수);
        rect(width / 2, 0, width / 2, height);
      }
      else if(mn == 1){
        fill(colors.금);
        rect(0, 0, width / 2, height);
        fill(colors.수);
        rect(width / 2, 0, width / 2, height);
      }
    }
    backgroundcolored = true;
  }


  if (me == "화") {
    fill(colors.목);
    ellipse(centerX, centerY, 230,230);
    imageMode(CENTER);
    image(treeimg, centerX, centerY, 250, 200);
  }
  else if (me == "토") {
    ellipseMode(CENTER);
    fill(255,200,0);
    ellipse(centerX, centerY, 200,200);
    imageMode(CENTER);
    image(fireimg, centerX, centerY, 250, 200);
  }
  else if (me == "금") {
    fill('#ffff80');
    rectMode(CENTER);
    quad(centerX, centerY - 100, centerX - 125, centerY, centerX, centerY + 100, centerX + 125, centerY);
    rectMode(CORNERS);
    imageMode(CENTER);
    image(soilimg, centerX+10, centerY+10, 250, 200);
  }
  else if (me == "수") {
    ellipseMode(CENTER);
    fill(colors.금);
    quad(centerX, 0, centerX - 100, centerY, centerX, height, centerX + 100, centerY);
    imageMode(CENTER);
    image(metalimg, centerX, centerY, 250, 200);
  }
  else if (me == "목") {
    ellipseMode(CENTER);
    fill(colors.수);
    triangle(centerX, centerY-100, centerX-110,centerY+90, centerX+110, centerY+90);
    imageMode(CENTER);
    image(waterimg, centerX, centerY, 250, 200);
    console.log("draw water.");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("analyzeBtn").addEventListener("click", analyzeSaju);
});
