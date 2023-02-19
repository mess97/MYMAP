import { get } from "../util/getDOM.js";
import {
  deleteMarkers,
  displayPlaces,
  addMarker,
  closeModal,
} from "./displayPlaces.js";
const searchInput = get(".search-bar");
const searchBtn = get(".search-btn");
const resultTitle = get(".result-title");
const mapBox = get(".map-box");
const myPlace = get(".my-place");
const resultSearch = (map) => {
  const searchValue = searchInput.value;

  resultTitle.innerHTML = `<bold>'${searchValue}'</bold> 의 검색결과`;
  const places = new kakao.maps.services.Places();

  //장소 검색이 완료 되었을때
  const callback = (data, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
      //검색목록과 마커를 표출한다
      displayPlaces(data, map);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      return;
    }
  };

  places.keywordSearch(searchValue, callback);
};

export const kakaoMap = () => {
  //시작부터 현위
  //현위치를 가져오는 매서드
  const succesGeolocation = (position) => {
    deleteMarkers();
    const { latitude, longitude } = position.coords;
    //현재맵에 현위치롤 이동
    // 현재 지도의 레벨을 얻어옵니다
    var level = map.getLevel();
    // 지도를 2레벨 내립니다 (지도가 확대됩니다)
    if (level > 3) {
      map.setLevel(level - 2);
    }

    //지도의 중심좌표
    const moveLating = new kakao.maps.LatLng(latitude, longitude);

    //마커를 생성하고 지도위에 표시하는 함수입니다
    addMarker(moveLating, map);
    map.panTo(new kakao.maps.LatLng(latitude, longitude));
  };

  //에러 나는경우 위치를 못찾거나 응답이 없는경우
  const errorGeolocation = (error) => {
    if (error.code === 1) {
      //1.권한 에러
      alert("위치 정보 수집할 권한이 없습니다");
    } else if (error.code === 2) {
      //2. 위치 조회 실패/혹은 불가능
      alert("사용할 수 없는 위치입니다");
    } else if (error.code === 3) {
      //위치 조회 타임 아웃 // 시간이 오래 걸릴때
      //혹은 인터넷 속도가 너무 느릴때
      alert("조회시간이 초과 했습니다");
    } else {
      alert("오류가 발생했습니다");
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        //현위치를 가져오는 매서드
        succesGeolocation,
        errorGeolocation
      );
    } else {
      alert("지도 api사용이 불가능합니다");
    }
  };
  ///------------------------------------------------
  // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
  const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

  const mapContainer = get(".map-box"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
      level: 5, // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  const map = new kakao.maps.Map(mapContainer, mapOption);
  getLocation();
  searchBtn.addEventListener("click", () => {
    //인풋창의 값이 없을 경우 리턴
    const searchValue = searchInput.value;
    if (!searchValue) return;
    resultSearch(map);
  });

  //인풋창에 포커스시 엔터 누르면   resultSearch();실행
  // 검색창에 포커스가 들어올 때 이벤트 핸들러 등록

  // 검색창에서 키보드 이벤트 발생시 이벤트 핸들러 등록
  searchInput.addEventListener("keydown", (event) => {
    const searchValue = searchInput.value;
    //인풋창의 값이 없을 경우 리턴
    if (!searchValue) return;
    // 눌린 키가 Enter(키코드 13)인 경우 resultSearch() 함수 호출
    if (event.keyCode === 13) {
      resultSearch(map);
    }
  });

  //맵을 클릭시 인풋창은 포커스 취소// 예외처리
  mapBox.addEventListener("click", () => {
    searchInput.blur();
  });

  //----------

  myPlace.addEventListener("click", () => {
    closeModal();
    //현위치로 가는 매소드
    getLocation();
  });
};
