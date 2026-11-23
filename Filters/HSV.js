function convertToHSV(img) {
    let newImg = createImage(img.width, img.height);
    newImg.loadPixels();
    img.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i] / 255.0;
        let g = img.pixels[i + 1] / 255.0;
        let b = img.pixels[i + 2] / 255.0;

        // Compute Cmax, Cmin, and Delta
        let Cmax = Math.max(r, g, b);
        let Cmin = Math.min(r, g, b);
        let delta = Cmax - Cmin;

        let H, S, V;

        // Compute Saturation (S)
        S = Cmax == 0 ? 0 : delta / Cmax;

        // Compute Value (V)
        V = Cmax;

        // Compute Hue (H) using Travis’s method
        if (delta == 0) {
            H = 0; // if undefined, set to 0 for grayscale
        } else {
            let R_prime = (Cmax - r) / delta;
            let G_prime = (Cmax - g) / delta;
            let B_prime = (Cmax - b) / delta;

            if (Cmax == r) {
                if (g == Cmin) H = 5 + B_prime;
                else H = 1 - G_prime;
            } else if (Cmax == g) {
                if (b == Cmin) H = R_prime + 1;
                else H = 3 - B_prime;
            } else { // Cmax == b
                H = 3 + G_prime;
            }
        }

        // Convert H to degrees (0–360)
        H = H * 60;
        if (H < 0) H += 360;

        // Convert to 8-bit format
        let H_8bit = (H / 360) * 255;
        let S_8bit = S * 255;
        let V_8bit = V * 255;

        // Store values in new image
        newImg.pixels[i] = H_8bit;
        newImg.pixels[i + 1] = S_8bit;
        newImg.pixels[i + 2] = V_8bit;
        newImg.pixels[i + 3] = 255; // Alpha
    }

    newImg.updatePixels();
    return newImg;
}