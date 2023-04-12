const channel = new BroadcastChannel('food_storage');
const video = document.getElementById('video');

const basePath = './../assets/top/';
let currentPath = null;

channel.onmessage = ({ data }) => {
  const newPath = `${basePath}${data}.m4v`;
  if (newPath !== currentPath) {
    video.src = newPath;
    currentPath = newPath;
  } else {
    video.pause();
    video.currentTime = '0';
    video.play();
  }
};

video.onended = () => {
  video.src = '';
};
