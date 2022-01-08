let sourceImage;
let maskImage;

let backgroundColor;
let horizontalLinesColor;
let verticalLinesColor;
let verticalLinesStep = 12;
let stepMult = 1 / 3;
let horizontalLinesStep = verticalLinesStep * stepMult;
let weightMult = 1 / 3;
let verticalLinesWeight = 6;
let horizontalLinesWeight = verticalLinesWeight * weightMult;
let verticalFreq = 1 / 3;
let horizontalFreq = (verticalFreq * 1) / 3;

function setup() {
    createCanvas(500, 500);
    backgroundColor = color(20);
    horizontalLinesColor = color(220);
    verticalLinesColor = color(220);

    sourceImage = createGraphics(width, height);

    maskImage = createGraphics(width, height);
    maskImage.ellipse(width / 2, height / 2, 300);
}

function draw() {
    background(backgroundColor);
    drawVerticalLines(
        this,
        verticalLinesStep,
        verticalLinesColor,
        verticalLinesWeight
    );
    updateMasked();
    image(masked, 0, 0);
}

function updateMasked() {
    sourceImage.background(backgroundColor);
    drawHorizontalLines(
        sourceImage,
        horizontalLinesStep,
        horizontalLinesColor,
        horizontalLinesWeight
    );
    sourceImage.ellipse(width / 2, height / 2, 300);
    masked = sourceImage.get();
    masked.mask(maskImage);
}

function drawHorizontalLines(pg, step, c, sw) {
    pg.stroke(c);
    pg.strokeWeight(sw);
    pg.noFill();
    for (y = (frameCount * horizontalFreq) % step; y < pg.height; y += step) {
        pg.line(0, y, pg.width, y);
    }
}

function drawVerticalLines(pg, step, c, sw) {
    pg.stroke(c);
    pg.strokeWeight(sw);
    pg.noFill();
    for (x = (frameCount * verticalFreq) % step; x < pg.width; x += step) {
        pg.line(x, 0, x, height);
    }
}
