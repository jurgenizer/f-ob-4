import './style.css'
import obFour from './ob-4.svg';
import audioTrack from './tibetan-bowl-meditation-music.mp3';

document.querySelector('#app').innerHTML = `
  <div id='obfour'>
    <canvas id="visualizer" class="visualizer-canvas"></canvas>
     <img src='${obFour}' class='img-obfour' alt='Teenage Engineering OB-4' />
     <section class='control-section'>
     	<section class='play-control-section'>
			  <audio src='${audioTrack}' crossorigin='anonymous' ></audio>
			    <button data-playing='false' class='play-control-play' role='switch' aria-checked='false'>
				    <span>play</span>
			    </button>
		  </section>
      <section class='volume-control-section'>
          <input
            type='range'
            id='volume'
            class='control-volume'
            min='0'
            max='2'
            value='1'
            list='gain-vals'
            step='0.01'
            data-action='volume'
          />
          <label for='volume'>volume</label>
        </section>
        </section>


  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  let audioCtx;
  let track;
  let gainNode;
  let analyser; 

  const playButton = document.querySelector('.play-control-play');
  const audioElement = document.querySelector('audio');
  const volumeControl = document.querySelector('[data-action="volume"]');
  const canvas = document.getElementById('visualizer');
  const canvasCtx = canvas.getContext('2d');
  const obFourImage = document.querySelector('.img-obfour');

  function updateCanvasSize() {
    const rect = obFourImage.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function draw() {
    // Create separate arrays for left and right channels
    const leftDataArray = new Float32Array(analyser.frequencyBinCount);
    
    // Get time domain data for both channels
    analyser.getFloatTimeDomainData(leftDataArray);
    const rightChannelData = leftDataArray.slice(analyser.frequencyBinCount / 2);
    
    // Calculate average amplitude for each channel
    const leftAmplitude = leftDataArray.reduce((acc, val) => acc + Math.abs(val), 0) 
      / leftDataArray.length;
    const rightAmplitude = rightChannelData.reduce((acc, val) => acc + Math.abs(val), 0) 
      / rightChannelData.length;
    
    // Clear canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    const leftCenterX = canvas.width * 0.314;
    const rightCenterX = canvas.width * 0.688;
    const centerY = canvas.height * 0.493;

    // Scale radius based on canvas size
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.145;
  
    // Draw left circle
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = '#181818';
    canvasCtx.lineWidth = Math.max(2, canvas.width * 0.0004);
    
    const leftRadius = baseRadius + (leftAmplitude * baseRadius);
    canvasCtx.arc(leftCenterX, centerY, leftRadius, 0, 2 * Math.PI);
    canvasCtx.stroke();
    
    // Draw right circle
    canvasCtx.beginPath();
    const rightRadius = baseRadius + (rightAmplitude * baseRadius);
    canvasCtx.arc(rightCenterX, centerY, rightRadius, 0, 2 * Math.PI);
    canvasCtx.stroke();
    
    requestAnimationFrame(draw);
  }

  function init() {
    audioCtx = new AudioContext();
    track = new MediaElementAudioSourceNode(audioCtx, {
      mediaElement: audioElement,
    });
  
    // Create analyzer node
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
  
    // Create and connect the gain node
    gainNode = new GainNode(audioCtx);
  
    // Connect nodes: track -> gain -> analyser -> destination
    track.connect(gainNode)
      .connect(analyser)
      .connect(audioCtx.destination);

    // Initial canvas size
    updateCanvasSize();

    // Update on window resize
    window.addEventListener('resize', updateCanvasSize);

    // Start the animation
    draw();

    // Set initial volume
    gainNode.gain.value = volumeControl.value;
  }



 

  playButton.addEventListener('click', () => {
    // Initialize audio context on first click
    if (!audioCtx) {
      init();
    }

    const isPlaying = playButton.getAttribute('data-playing') === 'true';
    if (isPlaying) {
      audioElement.pause();
      playButton.setAttribute('data-playing', 'false');
      playButton.setAttribute('aria-checked', 'false');
      playButton.querySelector('span').textContent = 'play';
    } else {
      audioElement.play();
      playButton.setAttribute('data-playing', 'true');
      playButton.setAttribute('aria-checked', 'true');
      playButton.querySelector('span').textContent = 'pause';
    }
  });

  // If track ends
  audioElement.addEventListener('ended', () => {
    playButton.dataset.playing = 'false';
    playButton.setAttribute('aria-checked', 'false');
    playButton.querySelector('span').textContent = 'play';
  }, false);

  // Volume control
  volumeControl.addEventListener('input', (e) => {
    // Handle volume change
    if (gainNode) {
      gainNode.gain.value = e.target.value;
    }

    // Handle color change
    const value = e.target.value;
    const max = e.target.max;
    const ratio = value / max;

    // Interpolate between dark (#181818) and bright green (#00FF00)
    const r = Math.round(24 + (0 - 24) * ratio);
    const g = Math.round(24 + (255 - 24) * ratio);
    const b = Math.round(24 + (0 - 24) * ratio);

    document.documentElement.style.setProperty('--thumb-color', `rgb(${r}, ${g}, ${b})`);

  }, false);


});

