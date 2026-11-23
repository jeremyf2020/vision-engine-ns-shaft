// trying more advanced blurring technique using convolution matrix
// however, the performance is not good, iteration more times would get better blurred reuslt
let matrix = [
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256]
];

function convertToBlurred(img, iterations = 4) {
    // inspired by the idea from p5js's orginal blur function
    // doing multiple iterations is straightforward way to get a better blurred image
    let imgOut = img.get();
    let matrixSize = matrix.length;

    for (let i = 0; i < iterations; i++) {
        let tempImg = createImage(imgOut.width, imgOut.height);
        tempImg.loadPixels();
        imgOut.loadPixels();

        for (let x = 0; x < imgOut.width; x++) {
            for (let y = 0; y < imgOut.height; y++) {
                let index = (x + y * imgOut.width) * 4;
                let c = convolution(x, y, matrix, matrixSize, imgOut);

                tempImg.pixels[index + 0] = c[0];
                tempImg.pixels[index + 1] = c[1];
                tempImg.pixels[index + 2] = c[2];
                tempImg.pixels[index + 3] = 255; // Full opacity
            }
        }

        tempImg.updatePixels();
        imgOut = tempImg; // Use blurred version for the next iteration
    }

    return imgOut;
}

// convolution function to apply the matrix to the image
function convolution(x, y, matrix, matrixSize, img) {
    let totalRed = 0.0;
    let totalGreen = 0.0;
    let totalBlue = 0.0;
    let sumWeight = 0.0;
    let offset = Math.floor(matrixSize / 2);

    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            let xloc = x + i - offset;
            let yloc = y + j - offset;

            // Handle edges by mirroring pixels
            xloc = constrain(xloc, 0, img.width - 1);
            yloc = constrain(yloc, 0, img.height - 1);

            let index = (xloc + yloc * img.width) * 4;

            totalRed += img.pixels[index] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];

            sumWeight += matrix[i][j];
        }
    }

    return [
        totalRed / sumWeight,
        totalGreen / sumWeight,
        totalBlue / sumWeight
    ];
}
