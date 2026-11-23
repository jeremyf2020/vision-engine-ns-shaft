class NeonSwitch {
    constructor(text, x, y, onClick, borderColor = '#0ff', textColor = '#0ff') {
        // using hex color in css is easiler to make the neon effect
        this.button = createButton(text);
        this.button.position(x, y);
        this.borderColor = borderColor;
        this.textColor = textColor;
        this.applyNeonStyles();
        this.button.mousePressed(() => onClick(this));
        this.originalText = text;
    }

    applyNeonStyles() {
        // apply css styles to button
        this.button.style('background', 'black');
        this.button.style('border', `2px solid ${this.borderColor}`);
        this.button.style('color', this.textColor);
        this.button.style('padding', '8px 16px');
        this.button.style('font-family', 'Courier New');
        this.button.style('text-transform', 'uppercase');
        this.button.style('box-shadow', `0 0 10px ${this.borderColor}`);
    }

    setColors(borderColor, textColor) {
        this.borderColor = borderColor || this.borderColor;
        this.textColor = textColor || this.textColor;
        this.applyNeonStyles(); // Reapply styles with new colors
    }

    setText(newText) {
        // directly update the html inner text
        this.button.html(newText);
    }
}
