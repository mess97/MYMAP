import { get } from "../util/getDOM.js";

const ResultContainer = get(".result-container");
const ResultBox = get(".result-box");
const resultClose = get(".result-close");
const imageSrc = "assets/pngegg.png",
  // 마커이미지의 주소입니다
  imageSize = new kakao.maps.Size(50, 50),
  // 마커이미지의 크기입니다
  imageOption = { offset: new kakao.maps.Point(27, 69) };
const markerImage = new kakao.maps.MarkerImage(
  imageSrc,
  imageSize,
  imageOption
);
let markers = [];

const setMarkers = (map) => {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

export const deleteMarkers = () => {
  //기존에 있는 마커들을 삭제합니다
  setMarkers(null);
};

export const addMarker = (moveLating, map) => {
  // 마커를 생성합니다
  const marker = new kakao.maps.Marker({
    position: moveLating,
    image: markerImage,
  });
  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);
  // 생성된 마커를 배열에 추가합니다
  markers.push(marker);
};

//모달을 닫고 맵을 이동 해주는 함수
const mapMoving = (item, map) => {
  //기존에 있는 마커들을 삭제합니다
  deleteMarkers();

  // 현재 지도의 레벨을 얻어옵니다
  var level = map.getLevel();
  // 지도를 2레벨 내립니다 (지도가 확대됩니다)
  if (level > 3) {
    map.setLevel(level - 2);
  }

  //지도의 중심좌표
  const moveLating = new kakao.maps.LatLng(item.y, item.x);
  //마커를 생성하고 지도위에 표시하는 함수입니다
  addMarker(moveLating, map);
  //맵을 이동하는 매서드
  map.panTo(moveLating);
  closeModal();
};

//모달을 닫고 result를 없앰
export const closeModal = () => {
  const getPrevList = document.getElementsByClassName("result-list")[0];
  getPrevList?.remove();
  ResultContainer.style.display = "none";
  ResultBox.style.display = "none";
};

// 검색 결과 목록과 마커를 표출하는 함수입니다
export const displayPlaces = (data, map) => {
  const getPrevList = document.getElementsByClassName("result-list")[0];
  if (getPrevList) {
    getPrevList.remove();
  }

  ResultContainer.style.display = "flex";
  ResultBox.style.display = "block";

  const resultList = document.createElement("ul");
  resultList.classList.add("result-list");

  //   ------------------
  //list 생성
  data.forEach((item) => {
    // ResultBox;
    const listItem = document.createElement("li");
    listItem.classList.add("list-item");
    listItem.innerHTML = `   
        <div class="place-name">
           ${item.place_name}
        </div>

        <div class="road-name">${item.address_name}</div>
       
    `;
    //카테고리 생성 및 각 리스트에 넣어주기
    const str = item.category_name;
    //카테고리를 배열로 넘겨줌
    const category = str.split(" > ");

    const placeCategory = document.createElement("div");
    placeCategory.classList.add("place-category");
    category.forEach((item) => {
      const categoryList = document.createElement("div");
      categoryList.classList.add("category-item");
      categoryList.innerHTML = item;
      placeCategory.appendChild(categoryList);
    });
    listItem.appendChild(placeCategory);
    resultList.appendChild(listItem);

    //list item을 클릭시
    listItem.addEventListener("click", () => {
      //모달을 닫고 맵을 이동 해주는 함수
      mapMoving(item, map);
    });
  });

  // --------------------------------
  //close button 클리시
  resultClose.addEventListener("click", () => {
    closeModal();
  });
  //결과 목록을 보여주기
  ResultBox.appendChild(resultList);
};
