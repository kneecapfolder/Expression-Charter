import { useCallback, useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";






async function setupLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    // path/to/wasm/root
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  
  const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        // modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        modelAssetPath: "../public/models/face_landmarker.task",
        delegate: "GPU"
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO"
    }
  );

  return faceLandmarker;
}

const faceLandmarker = await setupLandmarker();


// Sort Data
function processResults(detections) {
  const blendshapes = detections.faceBlendshapes;
  // console.log(detections);
  
  if (blendshapes && blendshapes.length > 0) { // Check if data is valid for processing

      blendshapes[0].categories.forEach(category => { // Use the first detected face
          console.log(`Expression: ${category.categoryName}, Score: ${category.score}`);
      });
  }
}








// SCREEN 1 - YouTube Link Input
function Screen1({ setVideoFile, fileName, setFileName, setCurrentScreen, cameraStream, setCameraStream }) {
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const videoRef = useRef(null);
  

  // Video Upload drag handlers
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFile(url);
      setFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setVideoFile(url);
      setFileName(file.name);
    }
  };

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
        console.error("Error accessing camera:", error);
        alert("Unable to access camera. Please check permissions.");
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

          {/* Camera Preview Display */}
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
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              )
            }
            
          </div>
            

          {/* <input
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e ) => setYoutubeLink(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 mb-6 transition"
          /> */}

          
          {/* <div class="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">Video File:</p>
              <label for="dropzone-file" class="flex flex-col items-center dark:bg-slate-800 justify-center rounded-lg w-full h-64 bg-neutral-secondary-medium border dark:border-slate-700 border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
                  <div class="flex flex-col items-center justify-center text-body pt-5 pb-6">
                      <svg class="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
                      <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                      <p class="text-xs text-gray-400">MP4, MOV, MKV, ... (MAX. 200 MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" class="hidden" accept="video/*" />
              </label>
          </div>  */}

          

            {/* <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm font-semibold">Upload Video:</p>
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition group">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">MP4, WebM, or any video format</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  // onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div> */}


          {/* Video File Upload Input */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm font-semibold">Upload Video:</p>
            
            {!fileName ? (
              <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition group"
              >
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">MP4, WebM, or any video format</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            
            ) : (
              <div className="w-full px-4 py-4 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-green-700 dark:text-green-400 font-semibold">File selected</p>
                      <p className="text-green-600 dark:text-green-500 text-sm truncate w-130">{fileName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFileName(null);
                      setVideoFile(null);
                    }}
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>




          <button
            onClick={() => setCurrentScreen(2)}
            disabled={isLoadingCamera || cameraStream || !fileName}
            className={`w-full font-semibold py-3 rounded-lg transition duration-200 transform ${
              isLoadingCamera || cameraStream || !fileName // disable button when input empty or 
              ? "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
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
function Screen2({ fileName, videoFile, cameraStream, setCurrentScreen }) {
  
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // Update camera stream
  useEffect(() => {
    if (cameraStream && cameraRef.current) {
      cameraRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Detect Expressions
  let lastVideoTime = -1;

  async function detectionLoop(camera) {

    // console.log(videoRef.current.ended);

    if (videoRef.current.ended)
      return;

    // Make sure the same frame doesnt get processed twice
    if (Math.floor(camera.currentTime) !== lastVideoTime) {
      
      const detections = faceLandmarker.detectForVideo(camera, performance.now());
      processResults(detections);
      
      lastVideoTime = Math.floor(camera.currentTime);
    }
    
    // Loop function
    requestAnimationFrame(() => {
      detectionLoop(camera);
    });
  }

  // Start the expression detection when the cam display is loaded
  const handleLoadedCamera = () => {
      // console.log(cameraRef.current);
      lastVideoTime = -1
      detectionLoop(cameraRef.current)
  }

  // Update progress bar as video plays
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const videoDuration = videoRef.current.duration;
      const progressPercent = (currentTime / videoDuration) * 100;
      // console.log("time update")
      setProgress(progressPercent);
    }
  };

  // Handle video load
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle the video finishing while avoiding unnecessary rerenders
  const handleVideoEnded = useCallback(() => {
    setVideoEnded(true);
    console.log("video ended");
  }, []);



  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700">

          <div className="flex justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                🎥 Analyzing Video
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Watching File: <span className="text-blue-600 dark:text-blue-400 overflow-hidden text-ellipsis whitespace-nowrap">{fileName}</span>
              </p>
            </div>

            <video
              ref={cameraRef}
              onLoadedMetadata={handleLoadedCamera}
              autoPlay
              playsInline
              className="bg-gray-100 dark:bg-slate-800 mb-6 border border-gray-300 dark:border-slate-700 rounded-lg"
              style={{"height":"80px"}}
            />
          </div>


          {/* <div className="relative w-full mb-6 bg-gray-100 dark:bg-slate-800 mb-6 border border-gray-300 dark:border-slate-700 rounded-lg" style={{ paddingBottom: "56.25%" }}>
            <iframe 
              // src={String(youtubeLink).replace("watch?v=", "embed/") + "?controls=0&autoplay=1"}
              // title="YouTube video player"
              // frameborder="0"
              // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              // referrerpolicy="strict-origin-when-cross-origin"
              // allowfullscreen

              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
            
          </div> */}


          <video
            ref={videoRef}
            src={videoFile}
            autoPlay={true}
            // muted={true}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            className="relative w-full mb-6 bg-gray-100 dark:bg-slate-800 mb-6 border border-gray-300 dark:border-slate-700 rounded-lg"
            // style={{ paddingBottom: "56.25%" }}
          />




          <div className="mb-6">
            {/* progress bar */}
            <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-blue-600 h-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* timestamp displays */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            {/* view results button */} 
            <button
              onClick={() => setCurrentScreen(3)}
              disabled={!videoEnded}
              className={`flex-1 font-semibold py-3 rounded-lg transition duration-200 ${
                videoEnded
                  ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  : "bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              📈 View Results
            </button>

            {/* back button */}
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
              setYoutubeLink("");
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
  const [cameraStream, setCameraStream] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  return (
    <div>
      {currentScreen === 1 && (
        <Screen1 
          setVideoFile={setVideoFile} 
          fileName={fileName} 
          setFileName={setFileName} 
          setCurrentScreen={setCurrentScreen} 
          setCameraStream={cameraStream} 
          setCameraStream={setCameraStream} 
        />
      )}
      {currentScreen === 2 && (
        <Screen2 
          fileName={fileName} 
          videoFile={videoFile} 
          cameraStream={cameraStream} 
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
