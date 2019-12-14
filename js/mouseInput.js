var clickableElements = [];

canvas.addEventListener("mousedown", e => {
    let x = e.clientX
    let y = e.clientY
    for (let i of clickableElements) {
        if (
            x < i.x + i.width && x > i.x &&
            y < i.y + i.height && y > i.y
        ) i.onClick();
    }
})

canvas.addEventListener("mousemove", e => {
    let x = e.clientX
    let y = e.clientY
    for (let i of clickableElements) {
        if (
            x < i.x + i.width && x > i.x &&
            y < i.y + i.height && y > i.y
        ) canvas.style.cursor = "pointer";
        else canvas.style.cursor = "default";
    }
})

class CanvasButton {
    constructor(text, x, y, width, height, onClick) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.onClick = () => onClick();

        clickableElements.push(this);
    }

    draw() {
        drawRect("#88888888", this.x, this.y, this.width, this.height)
        drawText(this.text, this.x + (this.width / 2), this.y + (this.height / 2), 25, "white", "Arial", "center", "middle")
    }
}