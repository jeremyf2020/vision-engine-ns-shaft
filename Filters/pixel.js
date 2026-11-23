
function convertToPixel(img) {
    const blockSize = 5;  // Size of each pixel block
    let outimage = createImage(img.width, img.height);  // Create output image

    // Loop through image in steps of blockSize
    for (let y = 0; y < img.height; y += blockSize) {
        for (let x = 0; x < img.width; x += blockSize) {
            // Calculate average intensity for current block
            let totalR = 0;
            let totalG = 0;
            let totalB = 0;
            let pixelCount = 0;

            // Loop through each pixel in the 5x5 block to calculate average
            for (let blockY = y; blockY < y + blockSize && blockY < img.height; blockY++) {
                for (let blockX = x; blockX < x + blockSize && blockX < img.width; blockX++) {
                    let pixelColor = img.get(blockX, blockY);
                    totalR += red(pixelColor);
                    totalG += green(pixelColor);
                    totalB += blue(pixelColor);
                    pixelCount++;
                }
            }

            // Calculate average RGB values
            let aveR = totalR / pixelCount;
            let aveG = totalG / pixelCount;
            let aveB = totalB / pixelCount;
            let avePixInt = color(aveR, aveG, aveB);

            // Fill the block with average intensity
            for (let blockY = y; blockY < y + blockSize && blockY < img.height; blockY++) {
                for (let blockX = x; blockX < x + blockSize && blockX < img.width; blockX++) {
                    outimage.set(blockX, blockY, avePixInt);
                }
            }
        }
    }

    // Update and return the processed image
    outimage.updatePixels();
    return outimage;
}