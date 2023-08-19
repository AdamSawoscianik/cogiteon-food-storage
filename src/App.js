import React from 'react';
import io from 'socket.io-client';

const channel = new BroadcastChannel('food_storage');

const App = () => {
  const [socket, setSocket] = React.useState(null);
  const [video, setVideo] = React.useState(null);

  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const newSocket = io(`http://localhost:5000`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  React.useEffect(() => {
    if (socket) {
      const onButtonClicked = (id) => {
        if (id !== video) {
          channel.postMessage(id);
          videoRef.current.pause();
          videoRef.current.currentTime = '0';
          videoRef.current.play();
          setVideo(id);
        }
      };

      socket.on('data', onButtonClicked);

      socket.on('error', () =>
        alert('Wystąpił błąd w komunikacji, zgłoś się do obsługi eksponatu.')
      );

      return () => {
        socket.off('data', onButtonClicked);
      };
    }
  }, [socket, videoRef, video]);

  return socket ? (
    <div className="video">
      {/* <div className="buttons">
        <button onClick={() => socket.emit('test', '1')}>1</button>
        <button onClick={() => socket.emit('test', '2')}>2</button>
        <button onClick={() => socket.emit('test', '3')}>3</button>
        <button onClick={() => socket.emit('test', '4')}>4</button>
        <button onClick={() => socket.emit('test', '5')}>5</button>
      </div> */}
      <video
        ref={videoRef}
        src={`assets/bottom/${video}.m4v`}
        autoPlay={true}
        muted
        onEnded={() => setVideo(null)}
      />
    </div>
  ) : (
    'loading...'
  );
};

export default App;
