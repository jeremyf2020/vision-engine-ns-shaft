// live webcam for image processor
// preload face detction & convertion when frame update
// prevent calcualtion time > frame update time

class Webcam {
    constructor(video, detector) {
        this.video = video;
        this.detector = detector;
        this.detections = [];
        this.faceFilter = '';
        this.filterImg = this.video.get();
    }

    update() {
        // get the current video frame for each draw loop
        let img = this.video.get();
        // preloading the detection and filtered image can enhance the performance
        this.detections = this.detector.detect(img.canvas);
        this.filterImg = this.convertToFilter(img);
    }

    changeOption(option) {
        // change the number input to the filter string
        switch (option) {
            case 1:
                this.faceFilter = 'Grayscale';
                break;
            case 2:
                this.faceFilter = 'Blurred';
                break;
            case 3:
                this.faceFilter = 'YCBCr';
                break;
            case 4:
                this.faceFilter = 'Pixel';
                break;
            default:
                this.faceFilter = '';
                break;
        }
    }

    drawFactFrame(face, pos, frameColor) {
        // draw the neon  face frame 
        drawNeonFrame(pos.x + face[0], pos.y + face[1],
            face[2], face[3], frameColor);
    }

    convertToFilter(img) {
        // convert the image to the selected filter
        switch (this.faceFilter) {
            case 'Grayscale':
                return convertToGrayScale(img);
            case 'Blurred':
                return convertToBlurred(img);
            case 'YCBCr':
                return convertToYCbCrLinear(img);
            case 'Pixel':
                const preGrayFace = convertToGrayScale(img);
                return convertToPixel(preGrayFace);
            default:
                return img;
        }
    }

    displayFaceFilters(face, pos) {
        // display the filtered face
        const extractedFilterFace = this.filterImg.get(face[0], face[1], face[2], face[3]);
        image(extractedFilterFace, pos.x + face[0], pos.y + face[1], face[2], face[3]);
    }

    display(pos, frameColor = [255, 255, 255], faceDetect = false, size = { x: 160, y: 120 }) {
        // display the video 
        let img = this.video.get();
        image(img, pos.x, pos.y, size.x, size.y);

        // display the face detection and filter if face detected
        if (faceDetect && this.detections.length > 0) {
            this.detections.forEach(face => {
                this.displayFaceFilters(face, pos);
                this.drawFactFrame(face, pos, frameColor);
            });
        }
    }
}

