// game's webcam, only for game because the other webcam preload things
// using the same class would cause laggy for the game
// not using class interface to extend becuase there are only 2

class WebcamDisplay {
    constructor(frameX, frameY, video, detector) {
        this.frameX = frameX;
        this.frameY = frameY;
        this.video = video;
        this.detector = detector;
        this.detections = [];
    }

    // return color converted image depends on lives/detection state
    getLives(lives) {
        let img = this.video.get();
        img.loadPixels();

        // webcam status
        if (this.detections && this.detections.length > 0) {
            // live status
            this.displayOnColors(img, lives);
        } else {
            this.displayGrayscale(img);
        }

        img.updatePixels();
        return img;
    }

    // extract lost colour from webcam
    displayOnColors(img, lives) {
        for (let i = 0; i < img.pixels.length; i += 4) {
            if (!lives.red) img.pixels[i] = 0;
            if (!lives.green) img.pixels[i + 1] = 0;
            if (!lives.blue) img.pixels[i + 2] = 0;
        }
    }

    // Convert to grayscale when no face detected
    displayGrayscale(img) {
        for (let i = 0; i < img.pixels.length; i += 4) {
            let r = img.pixels[i];
            let g = img.pixels[i + 1];
            let b = img.pixels[i + 2];
            let gray = (r + g + b) / 3;
            img.pixels[i] = gray;
            img.pixels[i + 1] = gray;
            img.pixels[i + 2] = gray;
        }
    }

    // Mirror the video image and display
    mirrorVideoImage(img, x, y, w, h) {
        push();
        translate(x + w, y);
        scale(-1, 1);
        image(img, 0, 0, w, h);
        pop();
    }

    // Display face position and bounding box
    // to let user know is the game in control
    displayFacePosition(webcamX, webcamY) {
        let faceX = "N/A";
        // bounding box if detected
        if (this.detections && this.detections.length > 0) {
            faceX = Math.round(160 - this.detections[0][0]);
            push();
            translate(webcamX + 160, webcamY);
            scale(-1, 1);
            noFill();
            stroke(0);
            strokeWeight(2);
            rect(this.detections[0][0], this.detections[0][1],
                this.detections[0][2], this.detections[0][3]);
            pop();
        }

        // display detection status (x.position) anyway
        push();
        textAlign(CENTER, TOP);
        textSize(16);
        fill(255);
        text(`X: ${faceX}`, webcamX + 80, webcamY + 130);
        pop();

        return faceX;
    }

    // Update detections
    update() {
        let img = this.video.get();
        this.detections = this.detector.detect(img.canvas);
    }

    // Main display function
    display(lives) {
        const webcamX = this.frameX + 320 + 30;
        const webcamY = this.frameY;

        let r = lives.red ? 255 : 0;
        let g = lives.green ? 255 : 0;
        let b = lives.blue ? 255 : 0;

        drawNeonFrame(webcamX, webcamY, 160, 120, [r, g, b]);
        let img = this.getLives(lives);
        this.mirrorVideoImage(img, webcamX, webcamY, 160, 120);
        this.displayFacePosition(webcamX, webcamY);
    }

    // Getter for detections
    getDetections() {
        return this.detections;
    }
}