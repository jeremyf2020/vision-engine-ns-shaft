function convertToGrayScale(imageData) {
    let convertedImg = createImage(imageData.width, imageData.height);
    convertedImg.loadPixels();
    imageData.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
        const r = imageData.pixels[i + 0];
        const g = imageData.pixels[i + 1];
        const b = imageData.pixels[i + 2];

        const gray = r * 0.299 + g * 0.587 + b * 0.114; // LUMA ratios 
        // const brightGrey = increaseBrightness(gray);
        // as said in webniar, Dr. MYK told us use OOP concept, so i commented this out.
        // it was following the pdf's requirement using in the same nested loop

        convertedImg.pixels[i + 0] = convertedImg.pixels[i + 1] = convertedImg.pixels[i + 2] = gray;
        convertedImg.pixels[i + 3] = 255;
    }


    convertedImg.updatePixels();
    return convertedImg;
}

// not in use, just showing why i deleted nested loop approach by Dr. MYK said in webniar
// function increaseBrightness(grayValue) {
//     let brightGrey = grayValue * 1.2; // Increase brightness by 20%
//     return Math.min(255, brightGrey); // Clamp value to a max of 255
// }