import './style.css'
import obFour from './ob-4.svg';
import audioTrack from './tibetan-bowl-meditation-music.mp3';

document.querySelector('#app').innerHTML = `
  <div id='obfour'>
     <img src='${obFour}' class='img-obfour' alt='Teenage Engineering OB-4' />
     	<section class='tape'>
			<audio src='${audioTrack}' crossorigin='anonymous' ></audio>
			<button data-playing='false' class='tape-controls-play' role='switch' aria-checked='false'>
				<span>play</span>
			</button>
		</section>
         <section class='master-controls'>
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
          <datalist id='gain-vals'>
            <option value='0' label='min'></option>
            <option value='2' label='max'></option>
          </datalist>

          <label for='volume'>volume</label>

        </section>


  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  // instigate our audio context
  let audioCtx;
  let track;
  let gainNode;

  const playButton = document.querySelector('.tape-controls-play');
  const audioElement = document.querySelector('audio');
  const volumeControl = document.querySelector('[data-action="volume"]');

  function init() {
    audioCtx = new AudioContext();
    track = new MediaElementAudioSourceNode(audioCtx, {
      mediaElement: audioElement,
    });
    
    // Create and connect the gain node
    gainNode = new GainNode(audioCtx);
    track.connect(gainNode).connect(audioCtx.destination);
    
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
  volumeControl.addEventListener('input', () => {
    if (gainNode) {
      gainNode.gain.value = volumeControl.value;
    }
  }, false);
});

