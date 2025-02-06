import './style.css'
import obFour from './ob-4.svg';
import audioTrack from './tibetan-bowl-meditation-music.mp3';

document.querySelector('#app').innerHTML = `
  <div id='obfour'>
     <img src='${obFour}' class='img-obfour' alt='Teenage Engineering OB-4' />
     	<section class="tape">
			<audio src='${audioTrack}' crossorigin="anonymous" ></audio>
			<button data-playing="false" class="tape-controls-play" role="switch" aria-checked="false">
				<span>play</span>
			</button>
		</section>
  </div>
`




document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.querySelector('.tape-controls-play');
  const audio = document.querySelector('audio');

  playButton.addEventListener('click', () => {
    const isPlaying = playButton.getAttribute('data-playing') === 'true';
    if (isPlaying) {
      audio.pause();
      playButton.setAttribute('data-playing', 'false');
      playButton.setAttribute('aria-checked', 'false');
      playButton.querySelector('span').textContent = 'play';
    } else {
      audio.play();
      playButton.setAttribute('data-playing', 'true');
      playButton.setAttribute('aria-checked', 'true');
      playButton.querySelector('span').textContent = 'pause';
    }
  });
});
