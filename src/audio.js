export class AudioController {
    constructor(audioElement, volumeControl) {
      this.audio = audioElement;
      this.volume = volumeControl;
      this.context = null;
      this.track = null;
      this.gain = null;
      this.analyser = null;
    }
  
    init() {
      this.context = new AudioContext();
      this.track = new MediaElementAudioSourceNode(this.context, {
        mediaElement: this.audio
      });
      
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.gain = new GainNode(this.context);
      
      this.track
        .connect(this.gain)
        .connect(this.analyser)
        .connect(this.context.destination);
  
      this.gain.gain.value = this.volume.value;
    }
  
    getChannelData() {
      const data = new Float32Array(this.analyser.frequencyBinCount);
      this.analyser.getFloatTimeDomainData(data);
      const mid = this.analyser.frequencyBinCount / 2;
      
      return {
        left: data.slice(0, mid),
        right: data.slice(mid)
      };
    }
  }