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

const taskCont = document.querySelector(".taskCont");
const txt_cont = document.querySelector(".txt_cont");
let userName;
let tasks;

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

// RENDER TASK
const renderTaskBoard = (taskData) => {
  if (taskData.length > 0) {
    // console.log(taskData);
    let taskBoardHtml = taskData
      .map((task, idx) => {
        if (!task.checked) {
          return `
   <li>
            <div class="txtcount">
              <h4>${task.description}</h4>
              <h5>+${task.points} Sapa</h5>
            </div>
            <a href="${task.link}" data-index=${task.id} target="_blank" class="btn"> Open </a>
          </li>
    `;
        }
      })
      .join("");

    taskCont.innerHTML = taskBoardHtml;
    // console.log(taskBoardHtml);
  } else {
    taskCont.innerHTML = ` <li>
            <div class="txtcount">
              <h4>Follow our X account</h4>
              <h5>+20 Ss</h5>
            </div>
            <a href="#" target="_blank" class="btn"> Open </a>
          </li>`;
  }
};

// FORMAT OUR TASKS
const formatTask = (taskData) => {
  const data = taskData.map((text, idx) => {
    const [description, link, points] = text.split(",");
    console.log(description);
    return {
      description: description.trim(),
      link: link.trim(),
      points: Number(points.trim()),
      id: idx,
      checked: false,
    };
  });
  return data;
};

// HANDLE CLICK EVENT

const handleTaskClick = (e) => {
  const taskId = e.target.getAttribute("data-index");
  const taskLink = e.target.getAttribute("href");
  // console.log(taskId,taskLink);
  window.open(taskLink, "_blank");
  // Gettig our db ref
  const userTaskRef = ref(db, `userTasks/${userName}/${taskId}`);
  const userPointsRef = ref(db, `users/${userName}/points`);

  set(userTaskRef, true)
    .then(() => {
      get(userPointsRef).then((snapshot) => {
        // console.log(snapshot.val());
        const taskpoints = tasks[taskId].points;
        const currentPoints = snapshot.exists() ? snapshot.val() : 0;
        update(ref(db, `users/${userName}`), {
          points: Number(currentPoints) + taskpoints,
        });
        helperFunc();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//TASKCONT CLICK  EVENT
taskCont.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("btn")) {
    handleTaskClick(e);
  }
});

// WORK ON ON ONLOAD FUNCTION
const helperFunc = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    userName = user.username;
    const dbRef = ref(db);
    get(child(dbRef, "Tasks"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const taskData = snapshot.val();
          const formattedData = formatTask(taskData);
          tasks = formattedData;
          get(ref(db, `userTasks/${userName}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                console.log(snapshot.val());

                const userTaskData = snapshot.val();
                formattedData.forEach((task, idx) => {
                  if (userTaskData[idx]) {
                    task.checked = true;
                  }
                });
                // console.log(formattedData);
                renderTaskBoard(formattedData);
              } else {
                renderTaskBoard(formattedData);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// RUNS WHEN THE WEBSITE LOADS
window.addEventListener("load", helperFunc);
