class Processor {
    constructor() {
        // init skeleton, will get position from it
        this.skeleton = new Skeleton(3, 5); // 3 rows, 5 columns
        // init controllers array for html controllers, can be hidden or shown based on the mode 
        this.controllers = [];
        // face detection
        this.detector = new objectdetect.detector(160, 120, 1.1, objectdetect.frontalface);
        // webcam for processor only, becuase it preload the face convertion 
        this.webcam = new Webcam(video, this.detector);
    }
    init() {
        // intialize the processor with no loops
        // create html sliders, push to controlelrs array
        this.redSlider = createSlider(0, 255, 128);
        this.redSlider.position(this.skeleton.getPosition(2, 0, 'controller').x, this.skeleton.getPosition(2, 0, 'controller').y + this.skeleton.grid.height);
        this.controllers.push(this.redSlider);
        this.greenSlider = createSlider(0, 255, 128);
        this.greenSlider.position(this.skeleton.getPosition(2, 1, 'controller').x, this.skeleton.getPosition(2, 1, 'controller').y + this.skeleton.grid.height);
        this.controllers.push(this.greenSlider);
        this.blueSlider = createSlider(0, 255, 128);
        this.blueSlider.position(this.skeleton.getPosition(2, 2, 'controller').x, this.skeleton.getPosition(2, 2, 'controller').y + this.skeleton.grid.height);
        this.controllers.push(this.blueSlider);
        styleNeonSlider(this.redSlider, [255, 0, 0]);   // Red neon
        styleNeonSlider(this.greenSlider, [0, 255, 0]); // Green neon
        styleNeonSlider(this.blueSlider, [0, 0, 255]);  // Blue neon

        this.YCBCrSlider = createSlider(0, 255, 128);
        this.YCBCrSlider.position(this.skeleton.getPosition(4, 1, 'controller', 20).x, this.skeleton.getPosition(4, 1, 'controller', 20).y + this.skeleton.grid.height);
        styleNeonSlider(this.YCBCrSlider, [0, 160, 160]);
        this.controllers.push(this.YCBCrSlider);

        this.HSVSlider = createSlider(0, 255, 128);
        this.HSVSlider.position(this.skeleton.getPosition(4, 2, 'controller', 20).x, this.skeleton.getPosition(4, 2, 'controller', 20).y + this.skeleton.grid.height);
        styleNeonSlider(this.HSVSlider, [110, 80, 110]);
        this.controllers.push(this.HSVSlider);

        // Create Snapshot Button
        this.snapshotBtn = new SnapshotBtn(this.skeleton.getPosition(0, 0).x + this.skeleton.grid.width, this.skeleton.getPosition(0, 0, 'title').y, 20);
        this.controllers.push(this.snapshotBtn);
    }

    // control all the html controllers at once
    turnOff() {
        for (let controller of this.controllers) {
            if (controller) {
                controller.hide()
            }
        }
    }
    turnOn() {
        for (let controller of this.controllers) {
            if (controller) {
                controller.show()
            }
        }
    }

    // convert to grayscale and increase brightness by 20%
    displayGrayScaleBrightness() {
        // In webniar Dr. MYK said using oop concept, so I splited the function into 2 functions

        // grayscale
        let grayScaleImage = convertToGrayScale(img);
        // increase brightness by 20%
        let brightGrey = increaseBrightness(grayScaleImage);
        // display the grayscale & inceased brightness image
        image(brightGrey, this.skeleton.getPosition(0, 1).x, this.skeleton.getPosition(0, 1).y, this.skeleton.grid.width, this.skeleton.grid.height);
        // draw neon frame and title of the image
        drawNeonFrame(this.skeleton.getPosition(0, 1).x, this.skeleton.getPosition(0, 1).y, this.skeleton.grid.width, this.skeleton.grid.height, [200, 200, 200]);
        drawTitle("Gray Scale + Brightness 20%", this.skeleton.getPosition(0, 1, 'title'), [150, 150, 150]);
    }

    displayWebcamCapture() {
        // this webcam is for static catpure, freeze after taking a snapshot
        const position = this.skeleton.getPosition(0, 0);
        if (!this.snapshotBtn.isClicked) {
            this.displayLiveWebcam(position);
        }
        else {
            image(img, position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height);
        }
        drawNeonFrame(position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height, [255, 255, 255]);
        drawTitle("Webcam", this.skeleton.getPosition(0, 0, 'title'));
    }

    displayRGBChannels() {
        // To reduce the memory usage, i split channels in the same loop
        const spliedImages = splitChannels(img);

        // display each of RGB channels
        image(spliedImages[0], this.skeleton.getPosition(1, 0).x, this.skeleton.getPosition(1, 0).y, this.skeleton.grid.width, this.skeleton.grid.height);
        image(spliedImages[1], this.skeleton.getPosition(1, 1).x, this.skeleton.getPosition(1, 1).y, this.skeleton.grid.width, this.skeleton.grid.height);
        image(spliedImages[2], this.skeleton.getPosition(1, 2).x, this.skeleton.getPosition(1, 2).y, this.skeleton.grid.width, this.skeleton.grid.height);

        // draw neon frame and title of the image
        drawNeonFrame(this.skeleton.getPosition(1, 0).x, this.skeleton.getPosition(1, 0).y, this.skeleton.grid.width, this.skeleton.grid.height, [250, 0, 250]);
        drawTitle("Red Channel", this.skeleton.getPosition(1, 0, 'title'), [250, 0, 250]);
        drawNeonFrame(this.skeleton.getPosition(1, 1).x, this.skeleton.getPosition(1, 1).y, this.skeleton.grid.width, this.skeleton.grid.height, [180, 250, 180]);
        drawTitle("Green Channel", this.skeleton.getPosition(1, 1, 'title'), [180, 250, 180]);
        drawNeonFrame(this.skeleton.getPosition(1, 2).x, this.skeleton.getPosition(1, 2).y, this.skeleton.grid.width, this.skeleton.grid.height, [0, 250, 250]);
        drawTitle("Blue Channel", this.skeleton.getPosition(1, 2, 'title'), [0, 250, 250]);

        // output the array for thresholding
        return spliedImages;
    }

    displayThresholding(splittedImages) {
        // Get html slider values
        let redThreshold = this.redSlider.value();
        let greenThreshold = this.greenSlider.value();
        let blueThreshold = this.blueSlider.value();

        // Apply thresholding to each channel
        let redThresholded = convertToThreshold(splittedImages[0], redThreshold);
        let greenThresholded = convertToThreshold(splittedImages[1], greenThreshold);
        let blueThresholded = convertToThreshold(splittedImages[2], blueThreshold);

        // Display thresholded images in the grid
        image(redThresholded, this.skeleton.getPosition(2, 0).x, this.skeleton.getPosition(2, 0).y, this.skeleton.grid.width, this.skeleton.grid.height);
        image(greenThresholded, this.skeleton.getPosition(2, 1).x, this.skeleton.getPosition(2, 1).y, this.skeleton.grid.width, this.skeleton.grid.height);
        image(blueThresholded, this.skeleton.getPosition(2, 2).x, this.skeleton.getPosition(2, 2).y, this.skeleton.grid.width, this.skeleton.grid.height);

        // draw neon frams
        drawNeonFrame(this.skeleton.getPosition(2, 0).x, this.skeleton.getPosition(2, 0).y, this.skeleton.grid.width, this.skeleton.grid.height, [250, 0, 0]);
        drawTitle("Red Threshold", this.skeleton.getPosition(2, 0, 'title'), [250, 0, 0]);

        drawNeonFrame(this.skeleton.getPosition(2, 1).x, this.skeleton.getPosition(2, 1).y, this.skeleton.grid.width, this.skeleton.grid.height, [0, 250, 0]);
        drawTitle("Green Threshold", this.skeleton.getPosition(2, 1, 'title'), [0, 250, 0]);

        drawNeonFrame(this.skeleton.getPosition(2, 2).x, this.skeleton.getPosition(2, 2).y, this.skeleton.grid.width, this.skeleton.grid.height, [0, 0, 250]);
        drawTitle("Blue Threshold", this.skeleton.getPosition(2, 2, 'title'), [0, 0, 250]);
    }

    drawLiveWebcamGrid(offSet) {
        // live webcam, for dynamic capture
        const position = this.skeleton.getPosition(3, 0, '', offSet)
        drawNeonFrame(position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height, [255, 255, 255]);
        drawTitle("Live Webcam", this.skeleton.getPosition(3, 0, 'title', offSet));
    }

    displayLiveWebcam(position) {
        // shared webcam 
        const webcamCapture = video.get();
        image(webcamCapture, position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height);
        return webcamCapture
    }

    displayYCbCrFilter(webcamCapture, position) {
        // using linear YCbCr instead of non-linear can improve the user experience when sliding the threshold value
        // becuase the non-linear YCbCr shift the color range to the bright side, making every step in the slider change the color drastically
        const YCBCrImage = convertToYCbCrLinear(webcamCapture);
        image(YCBCrImage, position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height);
        drawNeonFrame(position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height, [0, 191, 255]);
        drawTitle("YCbCr", this.skeleton.getPosition(3, 1, 'title', 20), [0, 191, 255]);
        return YCBCrImage;
    }

    displayHSVFilter(webcamCapture, position) {
        // HSV filter, neon frame and title
        const HSVimage = convertToHSV(webcamCapture);
        image(HSVimage, position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height);
        drawNeonFrame(position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height, [160, 0, 255]);
        drawTitle("HSV", this.skeleton.getPosition(3, 2, 'title', 20), [191, 0, 255]);
        return HSVimage;
    }


    displayYCbCrThreshold(YCBCrImage, position) {
        // YCbCr Threshold controlled by slider, neon frame and title
        let YCBCrThreshold = this.YCBCrSlider.value();
        image(convertToThreshold(YCBCrImage, YCBCrThreshold), position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height);
        drawNeonFrame(position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height, [0, 160, 160]);
        drawTitle("YCBCr Threshold", this.skeleton.getPosition(4, 1, 'title', 20), [0, 160, 160]);
    }

    displayHSVThreshold(HSVimage, position) {
        // HSV Threshold controlled by slider, neon frame and title
        let HSVThreshold = this.HSVSlider.value();
        image(convertToThreshold(HSVimage, HSVThreshold), position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height);
        drawNeonFrame(position.x, position.y, this.skeleton.grid.width, this.skeleton.grid.height, [110, 80, 110]);
        drawTitle("HSV Threshold", this.skeleton.getPosition(4, 2, 'title', 20), [110, 80, 110]);
    }

    displayFaceDetection() {
        const pos = this.skeleton.getPosition(4, 0, '', 20);
        this.webcam.display(pos, [255, 255, 150], true);
        drawNeonFrame(pos.x, pos.y, this.skeleton.grid.width, this.skeleton.grid.height, [255, 255, 0]);
        drawTitle(`Face detection (${this.webcam.faceFilter !== '' ? this.webcam.faceFilter : 'no'} filter)`, this.skeleton.getPosition(4, 0, 'title', 20), [255, 255, 0]);
        noStroke();
        fill(255, 255, 0);
        // [TODO: buttons for face filters]
        text(`Press 0-5 to switch filter`, this.skeleton.getPosition(4, 0, 'controller', 20).x, this.skeleton.getPosition(4, 0, 'controller', 20).y + 130);
    }

    draw() {
        // update webcam in every frame, which also preload the face detection and convertion
        this.webcam.update();

        // Row 0, Col 0: webcam image
        this.displayWebcamCapture();
        // Row 0, Col 1: grayscale image & brightness +20%
        this.displayGrayScaleBrightness();

        // Row 1, Col 0-2: RGB channels
        const spliedImages = this.displayRGBChannels();

        // Row 2, Col 0-2: thresholding for RGB channels
        this.displayThresholding(spliedImages);

        // Row 3, Co1 0: live webcam
        const webcamCapture = this.displayLiveWebcam(this.skeleton.getPosition(3, 0, '', 20));
        this.drawLiveWebcamGrid(20);
        // Row 3, Co1 1: YCbCr
        const YCBCrImage = this.displayYCbCrFilter(webcamCapture, this.skeleton.getPosition(3, 1, '', 20));
        // Row 3, Co1 2: HSV
        const HSVimage = this.displayHSVFilter(webcamCapture, this.skeleton.getPosition(3, 2, '', 20));

        // Row 4, Col 0: face detection
        this.displayFaceDetection();
        // Row 4, Col 1: YCbCr thresholding
        this.displayYCbCrThreshold(YCBCrImage, this.skeleton.getPosition(4, 1, '', 20));
        // Row 4, Col 2: HSV thresholding
        this.displayHSVThreshold(HSVimage, this.skeleton.getPosition(4, 2, '', 20));
    }
}
