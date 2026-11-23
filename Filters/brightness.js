// increase the brightness of the image by 20%
function increaseBrightness(imageData) {
    let convertedImg = createImage(imageData.width, imageData.height);
    convertedImg.loadPixels();
    imageData.loadPixels();

    for (let x = 0; x < convertedImg.width; x++) {
        for (let y = 0; y < convertedImg.height; y++) {

            const index = (x + y * convertedImg.width) * 4;

            const r = imageData.pixels[index + 0];
            const g = imageData.pixels[index + 1];
            const b = imageData.pixels[index + 2];

            // 1.2 is 20% more
            //Math.min is used to make sure the value does not exceed 255
            const brightRed = Math.min(255, r * 1.2);
            const brightGreen = Math.min(255, r * 1.2);
            const brightBlue = Math.min(255, r * 1.2);

            convertedImg.pixels[index + 0] = brightRed;
            convertedImg.pixels[index + 1] = brightGreen;
            convertedImg.pixels[index + 2] = brightBlue;
            convertedImg.pixels[index + 3] = 255;

            convertedImg.pixels[index + 3] = 255;
        }
    }
    convertedImg.updatePixels();
    return convertedImg;
}

