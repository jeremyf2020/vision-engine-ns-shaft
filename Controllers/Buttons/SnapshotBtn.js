class SnapshotBtn {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isHovered = false;
        this.isClicked = false;

        // Calculate dimensions
        this.bodyWidth = size;
        this.bodyHeight = size * 0.6;
        this.lensSize = size * 0.3;
        this.viewfinderSize = size * 0.2;
    }

    // Check if mouse is over camera, return true/false
    checkHover() {
        this.isHovered = mouseX > this.x - this.bodyWidth / 2 &&
            mouseX < this.x + this.bodyWidth / 2 &&
            mouseY > this.y - this.bodyHeight / 2 - 10 &&
            mouseY < this.y + this.bodyHeight / 2;
        return this.isHovered;
    }

    drawCamera() {
        // Set up neon effect
        noFill();
        stroke(this.isHovered ? color(255, 0, 255) : color(255, 255, 0)); // yellow or pink(hover)
        strokeWeight(2);

        // Adjust shadow based on hover state
        drawingContext.shadowBlur = this.isHovered ? 25 : 15;
        drawingContext.shadowColor = this.isHovered ? color(255, 0, 255) : color(255, 255, 0);

        // Draw main camera body
        rect(this.x - this.bodyWidth / 2, this.y - this.bodyHeight / 2,
            this.bodyWidth, this.bodyHeight, 2);

        // Draw lens
        ellipse(this.x + this.bodyWidth / 4, this.y, this.lensSize, this.lensSize);

        // Draw viewfinder
        rect(this.x - this.viewfinderSize / 2, this.y - this.bodyHeight / 2 - this.viewfinderSize / 2,
            this.viewfinderSize, this.viewfinderSize / 2, 2);

        // Draw lens shine
        strokeWeight(1);
        drawingContext.shadowBlur = this.isHovered ? 20 : 10;
        arc(this.x + this.bodyWidth / 4, this.y, this.lensSize * 0.6, this.lensSize * 0.6,
            -PI / 4, PI / 2);

        drawingContext.shadowBlur = 0;
    }

    hide() {
        // reset status
        this.isHovered = false;
        this.isClicked = false;
    }

    show() {
        this.drawCamera();
        this.checkHover();

        // Set cursor
        if (this.isHovered) {
            cursor('pointer');
        } else {
            cursor('default');
        }
    }

    // Handle click event
    clicked() {
        if (this.isHovered) {
            this.isClicked = true;
            this.onClick();
        }
    }

    // Customizable click function
    onClick() {
        img = video.get(); // Capture current frame
    }
}


