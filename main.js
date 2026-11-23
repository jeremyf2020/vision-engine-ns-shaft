// init the global variables for faster access and preloading
let img, video, ui, game;

// the console keeps showing this error but it's p5.js's issue,
// therefore, these lines are added to suppress the error
/* https://londoncs.slack.com/archives/CDUQVC99D/p1723631514048839 */
const oc = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (t, o = {}) {
    o.willReadFrequently = true;
    return oc.call(this, t, o);
};

function preload() {
    img = loadImage('./assets/image.png');
}

function setup() {
    // global video setup could enhance the performance
    video = createCapture(VIDEO);
    video.size(160, 120);
    video.hide();

    ui = new UI();
    ui.init();

    // window ui is for resizeing the canvas
    window.ui = ui;
}

function draw() {
    window.ui.draw();
}

function windowResized() {
    window.ui.windowResized();
}