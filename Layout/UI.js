class UI {
    constructor() {
        this.currentMode = 'Image Processor'; // Initial mode
        this.switchButton = new NeonSwitch(
            `Switch to ${this.currentMode === 'Image Processor' ? 'Game Mode' : 'Image Processor'}`,
            20, 20, // Position
            this.handleModeSwitch.bind(this),
            '#0ff', '#0ff' // Cyan border & text
        );
        this.processor = new Processor();
        game = new Game(); // globally preload the game to increase performance
        this.title = new CyberText(this.currentMode, window.innerWidth / 2, 50);
        this.minHeight = 950; // Minimum height for Image Processor mode
        this.updateCanvasSize(); // Set initial canvas size based on mode
    }

    handleModeSwitch(button) {
        if (this.currentMode === 'Image Processor') {
            this.currentMode = 'Game Mode';
            button.setText('Switch to Image Processor');
            // using css because better performance in neon effect
            button.setColors('#ff00ff', '#ff00ff'); // magenta 
        } else {
            this.currentMode = 'Image Processor';
            button.setText('Switch to Game Mode');
            button.setColors('#0ff', '#0ff'); // Cyan 
        }
        this.title.updateText(this.currentMode);
        this.updateCanvasSize(); // Update canvas size when mode switches
    }

    drawBackgroundGrid() {
        stroke(0, 127, 255, 50); // dark blue grid
        for (let x = 0; x < width; x += 50) {
            line(x, 0, x, height);
        }
        for (let y = 0; y < height; y += 50) {
            line(0, y, width, y);
        }
    }

    updateCanvasSize() {
        // Set canvas height based on mode
        let canvasHeight = this.currentMode === 'Image Processor'
            ? Math.max(window.innerHeight, this.minHeight) // At least [950px] for Image Processor
            : window.innerHeight; // Full window height for Game Mode
        resizeCanvas(window.innerWidth, canvasHeight, true);
    }

    init() {
        createCanvas(window.innerWidth, window.innerHeight);
        pixelDensity(1); // can improve performance
        this.processor.init();
        this.updateCanvasSize(); // Ensure correct size at start
    }

    draw() {
        background('black'); // Clear the canvas each frame
        // Redraw the grid every frame othereise the transparency will covering each other
        this.drawBackgroundGrid();
        // draw the title only if the window is big enough
        if (window.innerWidth > 700) {
            this.title.draw();
        }
        if (this.currentMode === 'Image Processor') {
            this.processor.draw();
            // turning on all the html controllers (sliders and buttons)
            this.processor.turnOn();
        } else {
            this.processor.turnOff();
            // turning off all the html controllers (sliders and buttons)
            game.draw();
        }
    }

    windowResized() {
        this.updateCanvasSize();
    }
}

