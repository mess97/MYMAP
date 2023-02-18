import { get } from "../util/getDOM.js";

const openBtn = get(".open-btn");
const sideBar = get(".side-bar");
const backBtn = get(".back-btn");
export const sidebar = () => {
  openBtn.addEventListener("click", () => {
    sideBar.classList.add("display");
  });
  backBtn.addEventListener("click", () => {
    sideBar.classList.remove("display");
  });
};
