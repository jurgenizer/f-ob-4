export class Visualizer {
    constructor(canvas, image) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.image = image;
    }
  
    updateSize() {
      const rect = this.image.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }
  
    drawCircle(x, y, radius) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  
    draw(leftAmplitude, rightAmplitude) {
      const config = {
        leftX: this.canvas.width * 0.314,
        rightX: this.canvas.width * 0.689,
        centerY: this.canvas.height * 0.488,
        baseRadius: Math.min(this.canvas.width, this.canvas.height) * 0.146,
        lineWidth: Math.max(1.6, this.canvas.width * 0.0004)
      };
  
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = '#181818';
      this.ctx.lineWidth = config.lineWidth;
  
      this.drawCircle(
        config.leftX,
        config.centerY,
        config.baseRadius + (leftAmplitude * config.baseRadius)
      );
      this.drawCircle(
        config.rightX,
        config.centerY,
        config.baseRadius + (rightAmplitude * config.baseRadius)
      );
    }
  }