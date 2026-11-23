// platforms, with/without spikes
// using stroke instead of fill when no face detected
class Platform {
    constructor(x, y, spawnWithSpikes = false) {
        this.width = 80;
        this.height = 10;
        this.x = x;
        this.y = y;
        this.hasSpikes = spawnWithSpikes || random() < 0.3; // 30% chance of spikes
        this.color = random(["red", "green", "blue"]);
    }

    update(gameSpeed) {
        this.y -= gameSpeed;
    }

    display(faceDetected) {
        let color;
        switch (this.color) {
            case "red": color = [255, 0, 0]; break;
            case "green": color = [0, 255, 0]; break;
            case "blue": color = [0, 0, 255]; break;
        }

        // neon platform if not detected
        if (faceDetected) {
            fill(color[0], color[1], color[2]);
        } else {
            noFill();
        }

        // Draw three layered rectangles for neon effect
        stroke(color[0], color[1], color[2], 50);
        strokeWeight(10);
        rect(this.x, this.y, this.width, this.height);

        stroke(color[0], color[1], color[2], 120);
        strokeWeight(6);
        rect(this.x, this.y, this.width, this.height);

        stroke(color[0], color[1], color[2], 255);
        strokeWeight(3);
        rect(this.x, this.y, this.width, this.height);

        // Render spikes
        if (this.hasSpikes) {
            if (faceDetected) {
                fill(color[0], color[1], color[2]);
                noStroke();
            } else {
                noFill();
                stroke(color[0], color[1], color[2], 255);
                strokeWeight(2);
            }
            for (let x = this.x; x < this.x + this.width - 5; x += 15) {
                triangle(x, this.y, x + 10, this.y - 10, x + 20, this.y);
            }
        }
    }

    isOffScreen() {
        return this.y + this.height < 0;
    }
}
