import renderElectricField from "./renderField.js"
import renderObjectManipulation from "./renderObjectManipulation.js"

const electricFieldCanvas = document.getElementById("electric-field")
electricFieldCanvas.width = 481
electricFieldCanvas.height = 481

const objectManipulationCanvas = document.getElementById("object-manipulation")
objectManipulationCanvas.width = 481
objectManipulationCanvas.height = 481

const objects = [
    {
        x: 0.45 * electricFieldCanvas.width,
        y: 0.5 * electricFieldCanvas.height,
        charge: -1
    },
    {
        x: 0.2 * electricFieldCanvas.width,
        y: 0.2 * electricFieldCanvas.height,
        charge: -5
    },
    {
        x: 0.4 * electricFieldCanvas.width,
        y: 0.4 * electricFieldCanvas.height,
        charge: -10
    },
    {
        x: 0.6 * electricFieldCanvas.width,
        y: 0.4 * electricFieldCanvas.height,
        charge: 1
    },
    {
        x: 0.6 * electricFieldCanvas.width,
        y: 0.6 * electricFieldCanvas.height,
        charge: 5
    },
    {
        x: 0.4 * electricFieldCanvas.width,
        y: 0.6 * electricFieldCanvas.height,
        charge: 10
    }
]

let mouseDown = false
let showVectorField = true

const render = () => {
    renderElectricField("electric", electricFieldCanvas, electricFieldCanvas.getContext("2d"), objects, mouseDown ? 8 : 1, mouseDown ? 3 : 24, mouseDown ? 1 : 8, showVectorField)
    renderObjectManipulation("electric", objectManipulationCanvas, objectManipulationCanvas.getContext("2d"), objects, 20)
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