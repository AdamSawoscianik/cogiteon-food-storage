const channel = new BroadcastChannel('food_storage');
const video = document.getElementById('video');
const image = document.getElementById('image');

const basePath = './../assets/top/';

channel.onmessage = ({ data }) => {
  image.style.display = 'none';
  const newPath = `${basePath}${data}.m4v`;
  video.src = newPath;
};

video.onended = () => {
  image.style.display = 'block';
  video.src = '';
};
