import renderGravitationalField from "./renderGravitationalField.js"
import renderObjectManipulation from "./renderObjectManipulation.js"

const gravitationalFieldCanvas = document.getElementById("gravitational-field")
gravitationalFieldCanvas.width = 481
gravitationalFieldCanvas.height = 481

const objectManipulationCanvas = document.getElementById("object-manipulation")
objectManipulationCanvas.width = 481
objectManipulationCanvas.height = 481

const objects = [
    {
        x: 0.45 * gravitationalFieldCanvas.width,
        y: 0.5 * gravitationalFieldCanvas.height,
        mass: 1000
    },
    {
        x: 0.2 * gravitationalFieldCanvas.width,
        y: 0.2 * gravitationalFieldCanvas.height,
        mass: 5000
    },
    {
        x: 0.4 * gravitationalFieldCanvas.width,
        y: 0.4 * gravitationalFieldCanvas.height,
        mass: 500
    },
    {
        x: 0.6 * gravitationalFieldCanvas.width,
        y: 0.4 * gravitationalFieldCanvas.height,
        mass: 100
    },
    {
        x: 0.6 * gravitationalFieldCanvas.width,
        y: 0.6 * gravitationalFieldCanvas.height,
        mass: 1000
    },
    {
        x: 0.4 * gravitationalFieldCanvas.width,
        y: 0.6 * gravitationalFieldCanvas.height,
        mass: 100
    },
    {
        x: 0.85 * gravitationalFieldCanvas.width,
        y: 0.7 * gravitationalFieldCanvas.height,
        mass: 2000
    }
]

let mouseDown = false
let showVectorField = true

const render = () => {
    renderGravitationalField(gravitationalFieldCanvas, gravitationalFieldCanvas.getContext("2d"), objects, mouseDown ? 8 : 1, mouseDown ? 3 : 10, mouseDown ? 1 : 3, showVectorField)
    renderObjectManipulation(objectManipulationCanvas, objectManipulationCanvas.getContext("2d"), objects, 20)
}

objectManipulationCanvas.addEventListener("mousedown", () => mouseDown = true)
objectManipulationCanvas.addEventListener("mouseup", () => {
    mouseDown = false
    render()
})

window.addEventListener("keypress", (e) => {
    if(e.code == "Space"){
        showVectorField = !showVectorField
        render()
    }
})

objectManipulationCanvas.addEventListener("mousemove", (e) => {
    if (!mouseDown) return

    for(let i = 0;i<objects.length;i++){
        const dx = e.offsetX - objects[i].x
        const dy = e.offsetY - objects[i].y

        if(dx * dx + dy * dy < 20 * 20){
            objects[i].x = e.offsetX
            objects[i].y = e.offsetY
            return render()
        }
    }
})

render()