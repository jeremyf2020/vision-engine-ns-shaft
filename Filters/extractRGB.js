// extractRGB for red, green, blue color channels, using in game webcam filter
function extractRGB(imageData, color) {
    let convertedImg = createImage(imageData.width, imageData.height);
    convertedImg.loadPixels();
    imageData.loadPixels();

    for (let x = 0; x < convertedImg.width; x++) {
        for (let y = 0; y < convertedImg.height; y++) {

            const index = (x + y * convertedImg.width) * 4;

            const r = imageData.pixels[index + 0];
            const g = imageData.pixels[index + 1];
            const b = imageData.pixels[index + 2];

            convertedImg.pixels[index + 0] = color === 'r' ? 0 : r;
            convertedImg.pixels[index + 1] = color === 'g' ? 0 : g;
            convertedImg.pixels[index + 2] = color === 'b' ? 0 : b;
            convertedImg.pixels[index + 3] = 255;
        }
    }
    convertedImg.updatePixels();
    return convertedImg;
}

