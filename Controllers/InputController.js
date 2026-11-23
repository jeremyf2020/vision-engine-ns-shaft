function mousePressed() {
    // in the Image Processor mode, check if snapshot button is clicked
    if (ui.currentMode === 'Image Processor') {
        ui.processor.snapshotBtn.clicked();
    }

    // in the Game mode, check if the restart button is clicked
    if (game && game.frozen && game.displayBoard.isRestartClicked(mouseX, mouseY)) {
        game.reset();
    }
}

function keyPressed() {
    // in the Image Processor mode, check if the user wants to save the current image
    if (ui.currentMode === 'Image Processor') {
        if (key === 's') {
            img = video.get()
        }
        if (key.match(/[0-9]/)) {
            ui.processor.webcam.changeOption(parseInt(key));
        }
    }
    else {
        // in the Game mode, check if the user wants to start a new game
        if (game && game.frozen && key === ' ') {
            game.reset();
        }
    }
}
