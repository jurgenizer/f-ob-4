import './style.css';
import obFour from './ob-4.svg';
import audioTrack from './tibetan-bowl-meditation-music.mp3';
import { AudioController } from './audio';
import { Visualizer } from './visualizer';
import { BackgroundAnimation } from './background';

document.addEventListener('DOMContentLoaded', () => {

  const background = new BackgroundAnimation();
background.draw();

  document.querySelector('#app').innerHTML = `
    <div id='obfour'>
      <canvas id="visualizer" class="visualizer-canvas"></canvas>
      <img src='${obFour}' class='img-obfour' alt='Teenage Engineering OB-4' />
      <section class='control-section'>
        <section class='play-control-section'>
          <audio src='${audioTrack}' crossorigin='anonymous'></audio>
          <button data-playing='false' class='play-control-play' role='switch' aria-checked='false'>
            <span>play</span>
          </button>
        </section>
        <section class='volume-control-section'>
          <input type='range' id='volume' class='control-volume'
            min='0' max='2' value='1' list='gain-vals' step='0.01' data-action='volume'
          />
          <label for='volume'>< volume ></label>
        </section>
      </section>
    </div>
  `;

  const elements = {
    playButton: document.querySelector('.play-control-play'),
    audio: document.querySelector('audio'),
    volume: document.querySelector('[data-action="volume"]'),
    canvas: document.getElementById('visualizer'),
    image: document.querySelector('.img-obfour')
  };

  const audio = new AudioController(elements.audio, elements.volume);
  const visualizer = new Visualizer(elements.canvas, elements.image);

  function animate() {
    if (audio.analyser) {
      const { left, right } = audio.getChannelData();
      const getAmplitude = data => 
        data.reduce((sum, val) => sum + Math.abs(val), 0) / data.length;
      
      visualizer.draw(getAmplitude(left), getAmplitude(right));
    }
    requestAnimationFrame(animate);
  }

  // Event Listeners
  elements.playButton.addEventListener('click', () => {
    if (!audio.context) {
      audio.init();
      visualizer.updateSize();
      animate();
    }
    
    const isPlaying = elements.playButton.dataset.playing === 'true';
    elements.audio[isPlaying ? 'pause' : 'play']();
    elements.playButton.dataset.playing = !isPlaying;
    elements.playButton.setAttribute('aria-checked', !isPlaying);
    elements.playButton.querySelector('span').textContent = isPlaying ? 'play' : 'pause';
  });

  window.addEventListener('resize', () => visualizer.updateSize());
  elements.volume.addEventListener('input', e => {
    if (audio.gain) audio.gain.gain.value = e.target.value;
  });
});