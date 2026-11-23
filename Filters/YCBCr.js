// using linear YCbCr instead of non-linear can improve the user experience when sliding the threshold value
// becuase the non-linear YCbCr shift the color range to the bright side, making every step in the slider change the color drastically

function convertToYCbCrLinear(img) {
    let newImg = createImage(img.width, img.height);
    newImg.loadPixels();
    img.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
        // Normalize RGB from 0-255 to 0-1
        let r = img.pixels[i] / 255.0;
        let g = img.pixels[i + 1] / 255.0;
        let b = img.pixels[i + 2] / 255.0;

        // Compute Y'CbCr components (ITU.BT-709)
        let Y = 0.2215 * r + 0.7154 * g + 0.0721 * b;
        let Cb = -0.1145 * r - 0.3855 * g + 0.5000 * b;
        let Cr = 0.5016 * r - 0.4556 * g - 0.0459 * b;

        // Compute the new RGB values
        let newR = Y + 0.0000 * Cb + 1.5701 * Cr;
        let newG = Y - 0.1870 * Cb - 0.4664 * Cr;
        let newB = Y - 1.8556 * Cb + 0.0000 * Cr;

        // Step 2: Scale to 8-bit range (0-255)
        let Y8bit = newR * 255;
        let Cb8bit = (newG + 0.5) * 255; // Shift Cb from [-0.5, 0.5] to [0, 255]
        let Cr8bit = (newB + 0.5) * 255; // Shift Cr from [-0.5, 0.5] to [0, 255]

        // Store results in pixels, constrained to 0-255
        newImg.pixels[i] = constrain(Y8bit, 0, 255);     // Y' in red channel
        newImg.pixels[i + 1] = constrain(Cb8bit, 0, 255); // Cb in green channel
        newImg.pixels[i + 2] = constrain(Cr8bit, 0, 255); // Cr in blue channel
        newImg.pixels[i + 3] = 255;                       // Alpha

    }
    newImg.updatePixels();
    return newImg;
}

