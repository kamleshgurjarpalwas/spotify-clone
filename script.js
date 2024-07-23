let currentSong = new Audio();
let songName;

function updaterunningTime() {
  currentSong.addEventListener("timeupdate", () => {
    // Update the seek pointer position
    document.querySelector(".seekpointer").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;

    // Update the running time display
    document.querySelector(
      ".running-time",
      ".song-time-in-mobile"
    ).innerText = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(
      ".song-time-in-mobile"
    ).innerText = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
  });
}

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let songs = await fetch("http://127.0.0.1:5500/songs/");

  let response = await songs.text();

  let div = document.createElement("div");

  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  let songArr = [];
  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songArr.push(as[i].href);
    }
  }
  return songArr;
}

function playMusic(track, e) {
  currentSong.pause();
  currentSong = new Audio("songs/" + track + ".mp3");
  currentSong.play();
  PLAYBTN.src = "stopBtn.svg";
  songName = e.getElementsByTagName("span")[0].innerText;
  document.querySelector(".running-song-name").innerText = songName;
  document.querySelector(".songe-name-in-mobile1").innerText = songName;
  updaterunningTime();
}

async function main() {
  let songs = await getSongs();
  currentSong = new Audio(songs[1]);

  let songsInUL = document.querySelector(".songsList");

  for (let song of songs) {
    songsInUL.innerHTML =
      songsInUL.innerHTML +
      `<li ><img src="music.svg" class="song-list-image" /> <span> ${song
        .slice(song.lastIndexOf("/") + 1, song.lastIndexOf("."))
        .replaceAll(
          "%20",
          " "
        )}</span> <span><b>Kamlesh</b></span> <img src="play.svg" class="song-list-paly-btn" /> </li>`;
  }

  //song start on click list element
  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      console.log(e.getElementsByTagName("span")[0].innerText.trim());
      playMusic(e.getElementsByTagName("span")[0].innerText.trim(), e);
    });
  });

  //current song play and pose
  PLAYBTN.addEventListener("click", (e) => {
    if (currentSong.paused) {
      currentSong.play();
      PLAYBTN.src = "stopBtn.svg";
    } else {
      currentSong.pause();
      PLAYBTN.src = "play.svg";
    }
    console.log(e);
  });

  document.querySelector(".duration-bar").addEventListener("click", (e) => {
    console.log(e);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".seekpointer").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  const hamBurger = document.querySelector("#hamburgerid");
  hamBurger.addEventListener("click", () => {
    const leftSection = document.querySelector(".left-section");
    leftSection.style.left = "-11px";
  });

  //cloasing left side bar
  const closeBtn = document.querySelector(".close-button");
  closeBtn.addEventListener("click", () => {
    const leftSection = document.querySelector(".left-section");
    leftSection.style.left = "-348px";
  });
}

main();
