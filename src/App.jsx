import { useEffect, useRef, useState } from 'react';


// SCREEN 1 - YouTube Link Input
function Screen1({ youtubeLink, setYoutubeLink, setCurrentScreen }) {
  const [cameraStream, setCameraStream] = useState(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const videoRef = useRef(null);

  // Request camera access on component mount
  useEffect(() => {
    const requestCamera = async () => {
      setIsLoadingCamera(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check permissions.');
      } finally {
        setIsLoadingCamera(false);
      }
    };

    requestCamera();

    // Cleanup: stop camera stream when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            {/* ✨  */}Facial Expression Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Analyze your emotions while watching videos
          </p>

          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">Camera Preview:</p>
            

            {
              isLoadingCamera ? (
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-lg h-96 flex items-center justify-center mb-6 border border-gray-300 dark:border-slate-700">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Fetching Camera...</p>
                  </div>
                </div>
              ) :
              (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              )
            }
            
          </div>
            

          <input
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e ) => setYoutubeLink(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 mb-6 transition"
          />

          <button
            onClick={() => youtubeLink && setCurrentScreen(2)}
            disabled={isLoadingCamera || !cameraStream || !youtubeLink}
            className={`w-full font-semibold py-3 rounded-lg transition duration-200 transform ${
              isLoadingCamera || !cameraStream || !youtubeLink // disable button when input empty or 
              ? 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            🎬 Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

// SCREEN 2 - Video Watch Screen
function Screen2({ youtubeLink, setCurrentScreen }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            🎥 Analyzing Video
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            YouTube Link: <span className="text-blue-600 dark:text-blue-400 overflow-hidden text-ellipsis whitespace-nowrap">{youtubeLink}</span>
          </p>

          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-lg h-96 flex items-center justify-center mb-6 border border-gray-300 dark:border-slate-700">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Detecting facial expressions...</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
            <div className="bg-blue-600 h-full w-2/3 transition-all duration-500"></div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentScreen(3)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              📈 View Results
            </button>
            <button
              onClick={() => setCurrentScreen(1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-black dark:text-white font-semibold py-3 rounded-lg transition duration-200 border border-gray-300 dark:border-slate-600"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// SCREEN 3 - Chart View
function Screen3({ setCurrentScreen, setYoutubeLink, setEmotionData }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            📊 Emotion Analysis Results
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Your Emotion Timeline</p>

          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-lg h-96 flex items-center justify-center mb-6 border border-gray-300 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400">Chart visualization will appear here</p>
          </div>

          <button
            onClick={() => {
              setCurrentScreen(1);
              setYoutubeLink('');
              setEmotionData([]);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            🔄 Analyze Another Video
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [emotionData, setEmotionData] = useState([]);

  return (
    <div>
      {currentScreen === 1 && (
        <Screen1 
          youtubeLink={youtubeLink} 
          setYoutubeLink={setYoutubeLink} 
          setCurrentScreen={setCurrentScreen} 
        />
      )}
      {currentScreen === 2 && (
        <Screen2 
          youtubeLink={youtubeLink} 
          setCurrentScreen={setCurrentScreen} 
        />
      )}
      {currentScreen === 3 && (
        <Screen3 
          setCurrentScreen={setCurrentScreen} 
          setYoutubeLink={setYoutubeLink} 
          setEmotionData={setEmotionData} 
        />
      )}
    </div>
  );
}

export default App;
