// title cyber feel text
class CyberText {
    constructor(str, x, y) {
        this.text = str;
        this.x = x;
        this.y = y;
        this.shadowColor = [255, 0, 255];  // Magenta shadow
        this.mainColor = [0, 255, 255];   // Cyan text
    }

    draw() {
        push();
        textAlign(CENTER);
        textSize(32);
        textFont('Courier New');
        fill(this.shadowColor[0], this.shadowColor[1], this.shadowColor[2]);
        text(this.text, this.x + 2, this.y + 2);
        fill(this.mainColor[0], this.mainColor[1], this.mainColor[2]);
        text(this.text, this.x, this.y);
        pop();
    }

    updateText(newText) {
        this.text = newText;
    }

    setColors(shadowColor, mainColor) {
        this.shadowColor = shadowColor || this.shadowColor;
        this.mainColor = mainColor || this.mainColor;
    }
}
