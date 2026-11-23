// the matchstickplayer character in the game, handling movement, collision, action, and colour
class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = 5;
        this.falling = true;
        this.lives = { red: true, green: true, blue: true }; // display colour depends on current live
        this.faceX = null;
        this.prevX = x;
        this.animPhase = 0;
    }

    update(platforms, detections) {
        this.prevX = this.x;

        // Update position based on face detection if available
        if (detections && detections.length > 0) {
            const face = detections[0];
            this.faceX = 160 - face[0];
            this.faceX = constrain(this.faceX, 30, 160);
            this.x = map(this.faceX, 30, 160, 0, 320 - this.size);
        }

        this.falling = true;

        // Check collision with platforms
        for (let platform of platforms) {
            if (this.y + this.size >= platform.y - platform.height &&
                this.y + this.size <= platform.y &&
                this.x + this.size > platform.x &&
                this.x < platform.x + platform.width) {
                // stand on the platform
                this.falling = false;
                this.y = platform.y - this.size - platform.height;
                // extract colour if on spikes
                if (platform.hasSpikes) {
                    this.lives[platform.color] = false;
                } else {
                    this.lives[platform.color] = true;
                }
                break;
            }
        }

        // falling animation and speed
        if (this.falling) {
            this.y += 3;
            this.animPhase += 0.2;
        } else if (this.x !== this.prevX) {
            this.animPhase += 0.15;
        } else {
            this.animPhase = 0;
        }
    }

    display() {
        // Set color based on remaining lives
        let r = this.lives.red ? 255 : 0;
        let g = this.lives.green ? 255 : 0;
        let b = this.lives.blue ? 255 : 0;
        let direction = this.x - this.prevX;
        let animOffset = sin(this.animPhase) * 0.3;

        push();
        translate(this.x + this.size / 2, this.y + this.size / 2);
        stroke(r, g, b);
        strokeWeight(2);

        if (this.falling) {
            line(0, 0, 0, this.size / 2); // Body
            let armAngle = animOffset * this.size / 2;
            line(0, 0, -this.size / 2, 0); // Left arm
            line(-this.size / 2, 0, -this.size / 2 - armAngle, -this.size / 4);
            line(0, 0, this.size / 2, 0); // Right arm
            line(this.size / 2, 0, this.size / 2 + armAngle, -this.size / 4);
            let legSpread = animOffset * this.size / 4;// Legs 
            line(0, this.size / 2, -this.size / 2 - legSpread, this.size * 0.8);
            line(0, this.size / 2, this.size / 2 + legSpread, this.size * 0.8);
        } else if (direction !== 0) {
            // moving
            line(0, 0, 0, this.size / 2);
            let runTilt = direction > 0 ? -animOffset : animOffset;
            // display the hand like a Spirit Level to represent movement
            line(-this.size / 2, this.size / 4 + runTilt * this.size / 2, this.size / 2, this.size / 4 - runTilt * this.size / 2);
            line(0, this.size / 2, -this.size / 2 - runTilt * this.size / 4, this.size * 0.8);
            line(0, this.size / 2, this.size / 2 + runTilt * this.size / 4, this.size * 0.8);
        } else {
            // normal
            line(0, 0, 0, this.size / 2 + abs(animOffset) * 2);
            line(-this.size / 2, this.size / 4, this.size / 2, this.size / 4);
            line(0, this.size / 2, -this.size / 2, this.size * 0.8);
            line(0, this.size / 2, this.size / 2, this.size * 0.8);
        }

        // head
        noFill();
        ellipse(0, -this.size / 4, this.size / 2);
        noStroke();
        pop();
    }

    isGameOver(height) {
        return this.y < 0 || (!this.lives.red && !this.lives.green && !this.lives.blue) || this.y > height;
    }
}
