// drawing all the neon effect frame, titles, and sliders

// rectangle neon frame
function drawNeonFrame(x, y, w, h, color = [255, 255, 255]) {
    // outer
    stroke(color[0], color[1], color[2], 40);
    strokeWeight(8);
    noFill();
    rect(x, y, w, h);
    // middle
    stroke(color[0], color[1], color[2], 100);
    strokeWeight(5);
    rect(x, y, w, h);
    // inner
    stroke(color[0], color[1], color[2], 255);
    strokeWeight(2);
    rect(x, y, w, h);
}

function drawTitle(title, pos, color = [255, 255, 255]) {
    let glowIntensity = 10; // Number of glow layers
    let padding = 10;
    let offSet = 5; // Vertical offset for text
    let skew = 7; // Skew value 

    push();
    textSize(10);
    let textWidthVal = textWidth(title);
    let textHeightVal = 16; // Approximate height for text

    // Define parallelogram coordinates
    let x1 = pos.x - padding;
    let y1 = pos.y - textHeightVal + offSet;
    let x2 = x1 + textWidthVal + 2 * padding;
    let y2 = y1;
    let x3 = x2 - skew;
    let y3 = y1 + textHeightVal + padding;
    let x4 = x1 - skew;
    let y4 = y3;

    // Neon glow effect using multiple expanding strokes
    for (let i = glowIntensity; i > 0; i--) {
        let alpha = map(i, 0, glowIntensity, 50, 5); // Decreasing transparency
        stroke(color[0], color[1], color[2], alpha);
        strokeWeight(i);
        noFill();
        quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    // parallelogram
    stroke(color);
    strokeWeight(2);
    fill(0);
    quad(x1, y1, x2, y2, x3, y3, x4, y4);

    // title text
    fill(color);
    noStroke();
    text(title, pos.x - offSet, pos.y + offSet);

    pop();
}

function styleNeonSlider(slider, neonColor) {
    slider.style('width', '160px');
    slider.style('background', '#1a1a1a');
    slider.style('-webkit-appearance', 'none');
    slider.style('height', '8px');
    slider.style('border-radius', '4px');

    // Neon glow effect for the track
    let glowStyle = `0 0 10px rgba(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]}, 0.8), ` +
        `0 0 20px rgba(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]}, 0.6), ` +
        `0 0 30px rgba(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]}, 0.4)`;
    slider.style('box-shadow', glowStyle);

    // Since slider.style() can't directly target ::-webkit-slider-thumb,
    // i inject the thumb style using a workaround with the slider's elt
    slider.elt.className = `neon-slider-${neonColor[0]}-${neonColor[1]}-${neonColor[2]}`;

    // Add hover effect
    slider.elt.addEventListener('mouseover', () => {
        slider.style('cursor', 'pointer');
    });

    // Inject thumb styling via a dynamic stylesheet 
    // ! style sheet doesnt work in p5.js
    // but working better on neon effect
    let thumbStyle = `
        .neon-slider-${neonColor[0]}-${neonColor[1]}-${neonColor[2]}::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgb(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]});
            box-shadow: 0 0 8px rgba(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]}, 1),
                       0 0 16px rgba(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]}, 0.8);
            cursor: pointer;
        }
        .neon-slider-${neonColor[0]}-${neonColor[1]}-${neonColor[2]}::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgb(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]});
            box-shadow: 0 0 8px rgba(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]}, 1),
                       0 0 16px rgba(${neonColor[0]}, ${neonColor[1]}, ${neonColor[2]}, 0.8);
            cursor: pointer;
        }
    `;

    // Inject the custom thumb style into the document (only once per unique color)
    if (!document.querySelector(`#neon-style-${neonColor[0]}-${neonColor[1]}-${neonColor[2]}`)) {
        let styleSheet = document.createElement('style');
        styleSheet.id = `neon-style-${neonColor[0]}-${neonColor[1]}-${neonColor[2]}`;
        styleSheet.textContent = thumbStyle;
        // https://stackoverflow.com/questions/4481485/changing-css-pseudo-element-styles-via-javascript
        // p5js create element after html is loaded, so have to append after new element & sytle are generated
        document.head.appendChild(styleSheet);
    }
}

