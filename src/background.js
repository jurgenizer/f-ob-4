export class BackgroundAnimation {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.shapes = [];
      
      // Style the canvas
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.zIndex = '-1';
      
      // Add to DOM
      document.body.prepend(this.canvas);
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      // Initialize shapes
      this.initShapes();
    }
  
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
        initShapes() {
          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
          
          for (let i = 0; i < 200; i++) { 
            this.shapes.push({
              x: Math.random() * this.canvas.width,
              y: Math.random() * this.canvas.height,
              size: Math.random() * 70 + 15, 
              color: colors[Math.floor(Math.random() * colors.length)],
              rotation: Math.random() * Math.PI * 2,
              speed: (Math.random() - 0.5) * 0.02, 
              type: Math.random() < 0.5 ? 'triangle' : 'rectangle' 
            });
          }
        }
      
        draw() {
          // Clear canvas with a light gray background
          this.ctx.fillStyle = '#f8f8f8';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
          // Draw and update shapes
          this.shapes.forEach(shape => {
            this.ctx.save();
            this.ctx.translate(shape.x, shape.y);
            this.ctx.rotate(shape.rotation);
            
            // Draw geometric shape
            this.ctx.beginPath();
            this.ctx.fillStyle = shape.color;
            this.ctx.globalAlpha = 0.22; // Reduced opacity
            
            if (shape.type === 'triangle') {
              this.ctx.moveTo(-shape.size/2, shape.size/2);
              this.ctx.lineTo(shape.size/2, shape.size/2);
              this.ctx.lineTo(0, -shape.size/2);
            } else {
              this.ctx.rect(-shape.size/2, -shape.size/2, shape.size, shape.size);
            }
            
            this.ctx.fill();
            this.ctx.restore();
      
            // Update rotation
            shape.rotation += shape.speed;
          });
      
          requestAnimationFrame(() => this.draw());
        }
    }