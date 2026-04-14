const tapCount = document.querySelector(".tapCount");
const pointCont = document.querySelector(".pointCont");
const scoreCont = document.querySelector(".scoreCont");
const userCont = document.querySelector(".userCont");
const particleCount = 2;
let timer;
let points;
let userName;
// console.log(tapCount);

// *****
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  child,
  update,
  remove,
  get,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7N60pjSZd2cX5b7sC8VEWkq4DTWYnhyI",
  authDomain: "sapatg-ba630.firebaseapp.com",
  projectId: "sapatg-ba630",
  storageBucket: "sapatg-ba630.appspot.com",
  messagingSenderId: "213739469633",
  appId: "1:213739469633:web:af96904eab332a5842bfc0",
  measurementId: "G-YTGY6LXV2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// *****
const db = getDatabase();

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const tap = async (e) => {
  // Creating our element
  try {
    if (
      Number(scoreCont.textContent) > 0 &&
      Number(scoreCont.textContent) <= 250
    ) {
      for (let index = 0; index < particleCount; index++) {
        const particle = document.createElement("h4");
        particle.textContent = 1;
        tapCount.appendChild(particle); //APPEND ELEMENT TO OUR TAP CONTAINER
        // RANDOMIZE THE PARTICLE STARTING POSTION
        const startX = e.clientX - tapCount.offsetLeft + getRandomInt(-50, 50);
        const startY = e.clientY - tapCount.offsetTop + getRandomInt(-50, 50);
        particle.style.top = `${startY}px`;
        particle.style.left = `${startX}px`;
        particle.style.opacity = 1;

        // WORKING ON THE END POINTS
        const endX = e.clientX - tapCount.offsetLeft + getRandomInt(-100, 100);
        const endY = e.clientY - tapCount.offsetTop + getRandomInt(-100, 100);

        setTimeout(() => {
          particle.style.bottom = `${endY}px`;
          particle.style.right = `${endX}px`;
          particle.style.opacity = 0;
        }, 500);

        setTimeout(() => {
          particle.remove();
        }, 1000);
      }
      // DOM MANIPULATION
      points = Number(pointCont.textContent) + particleCount;
      pointCont.textContent = Number(pointCont.textContent) + particleCount;
      scoreCont.textContent = Number(scoreCont.textContent) - particleCount;
      await set(ref(db, "users/" + userName), {
        points: points,
      });
      // localStorage.setItem(userName, points);
      if (timer) {
        // console.log(timer);
      } else {
        renewCount();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// RENEW COUNT, LIKE RENEW ENERGY
const renewCount = () => {
  timer = setInterval(() => {
    if (Number(scoreCont.textContent) >= 250) {
      clearInterval(timer);
      timer = undefined;
    } else {
      scoreCont.textContent = Number(scoreCont.textContent) + particleCount;
    }
  }, 500);
};

// EVENT LISTENERS
tapCount.addEventListener("click", tap);

// RUNS WHEN THE WEBSITE LOADS
window.addEventListener("load", () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    userName = user.username;
    userCont.textContent = userName;
    const dbref = ref(db);
    get(child(dbref, "users/" + userName)).then((snapshot) => {
      if (snapshot.exists()) {
        pointCont.textContent = snapshot.val().points;
      } else {
        console.log("Not found");
      }
    });

  }

  // NEW FOR DOGS REPLICATE
  // if (window.Telegram && window.Telegram.WebApp) {
  //   const user = window.Telegram.WebApp.initDataUnsafe?.user;
  //   const isPremium = user.is_premium
  //   const dp = user.photo_url;
  //   // alert(JSON.stringify(user.is_premium),JSON.stringify(user.photo_url))
  //   const userId = user.id;
  //   if (userId) {
  //     let creationDate;
  //     if (userId < 100000000) {
  //       creationDate = "2014 or earlier";
  //     } else if (userId < 1000000000) {
  //       creationDate = "2015-2017";
  //     } else if (userId < 1000000000) {
  //       creationDate = "2018-2019";
  //     } else if (userId < 8000000000) {
  //       creationDate = "2020-2021";
  //     } else {
  //       creationDate = "2022 or later";
  //     }
  //     alert(creationDate);
  //   }
  //   // alert(JSON.stringify(user.photo_url))
  //   userName = user.username;
  //   userCont.textContent = userName;
  //   const dbref = ref(db);
  //   get(child(dbref, "users/" + userName)).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       pointCont.textContent = snapshot.val().points;
  //     } else {
  //       console.log("Not found");
  //     }
  //   });

  // }
});
// window.addEventListener("load", () => {
//     userName = "Nuelyoungtech";
//     userCont.textContent = userName;
//     const dbref = ref(db);
//     get(child(dbref, "users/"+ userName)).then((snapshot)=>{
//       if (snapshot.exists()) {
//       pointCont.textContent = snapshot.val().points;
//       }else{
//         console.log("Not found");

//       }
//     })
//     if (localStorage.getItem(userName) !== "undefined") {
//       console.log(localStorage.getItem(userName));
//       const savedPoints = localStorage.getItem(userName);
//       pointCont.textContent = Number(savedPoints);
//     }
// });
