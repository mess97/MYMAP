import { get } from "../util/getDOM.js";
const searchInput = get(".search-bar");
const searchBtn = get(".search-btn");

const resultSearch = () => {
  const searchValue = searchInput.value;

  var places = new kakao.maps.services.Places();

  var callback = function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      console.log(result);
    }
  };

  places.keywordSearch(searchValue, callback);
};

export const kakaoMap = () => {
  // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
  var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

  var mapContainer = get(".map-box"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);

  searchBtn.addEventListener("click", () => {
    resultSearch();
  });

  //인풋창에 포커스시 엔터 누르면   resultSearch();실행
  // 검색창에 포커스가 들어올 때 이벤트 핸들러 등록
  searchInput.addEventListener("focus", function () {
    // 검색창에서 키보드 이벤트 발생시 이벤트 핸들러 등록
    searchInput.addEventListener("keydown", function (event) {
      // 눌린 키가 Enter(키코드 13)인 경우 resultSearch() 함수 호출
      if (event.keyCode === 13) {
        resultSearch();
      }
    });
  });
};
