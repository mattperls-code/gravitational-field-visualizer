import renderObjectManipulation from "./renderObjectManipulation.js"

const voltageFieldCanvas = document.getElementById("voltage-field")
voltageFieldCanvas.width = 481
voltageFieldCanvas.height = 481

const objectManipulationCanvas = document.getElementById("object-manipulation")
objectManipulationCanvas.width = 481
objectManipulationCanvas.height = 481

const objects = [
    {
        x: 0.45 * voltageFieldCanvas.width,
        y: 0.5 * voltageFieldCanvas.height,
        charge: -1
    },
    {
        x: 0.2 * voltageFieldCanvas.width,
        y: 0.2 * voltageFieldCanvas.height,
        charge: -5
    },
    {
        x: 0.4 * voltageFieldCanvas.width,
        y: 0.4 * voltageFieldCanvas.height,
        charge: -10
    },
    {
        x: 0.6 * voltageFieldCanvas.width,
        y: 0.4 * voltageFieldCanvas.height,
        charge: 1
    },
    {
        x: 0.6 * voltageFieldCanvas.width,
        y: 0.6 * voltageFieldCanvas.height,
        charge: 5
    },
    {
        x: 0.4 * voltageFieldCanvas.width,
        y: 0.6 * voltageFieldCanvas.height,
        charge: 10
    }
]

const renderVoltageField = (canvas, ctx, gridStep, flowMarkerStep, flowMarkerLength, showVoltageField) => {
    const electricField = []
    for(let i = 0;i<canvas.width/gridStep;i++){
        electricField.push([])
        for(let j = 0;j<canvas.height/gridStep;j++){
            let netForce = {
                x: 0,
                y: 0
            }
            objects.forEach(object => {
                const dx = i * gridStep - object.x
                const dy = j * gridStep - object.y
                const dSquared = dx * dx + dy * dy

                if(dx != 0 || dy != 0){
                    const forceMagnitude = object.charge / dSquared
                    const magnitude = Math.sqrt(dSquared)
        
                    netForce.x += forceMagnitude * dx / magnitude
                    netForce.y += forceMagnitude * dy / magnitude
                }
            })
            const netForceMagnitude = Math.sqrt(netForce.x * netForce.x + netForce.y * netForce.y)
            netForce.x /= netForceMagnitude
            netForce.y /= netForceMagnitude
            electricField[i].push(netForce)
        }
    }

    ctx.fillStyle = "rgb(240, 240, 240)"
    ctx.fillRect(0, 0, voltageFieldCanvas.width, voltageFieldCanvas.height)

    if(showVoltageField){
        const voltageField = []
        for(let i = 0;i<canvas.width;i++){
            voltageField.push([])
            for(let j = 0;j<canvas.height;j++){
                let netPotential = 0
                objects.forEach(object => {
                    const dx = i * gridStep - object.x
                    const dy = j * gridStep - object.y
                    const dSquared = dx * dx + dy * dy

                    if(dx != 0 || dy != 0){
                        const potentialMagnitude = object.charge / Math.sqrt(dSquared)

                        netPotential += potentialMagnitude
                    }
                })
                voltageField[i].push(netPotential)
            }
        }
        
        ctx.fillStyle = "rgb(250, 200, 0)"
        for(let i = 0;i<voltageField.length;i++){
            for(let j = 0;j<voltageField[0].length;j++){
                const potential = Math.abs(voltageField[i][j])
                if(potential >= 0.05 && (1 / Math.sqrt(potential)) % 0.5 < 0.1) {
                    ctx.fillRect(i, j, 2, 2)
                } else if (potential < 0.05 && (200 * Math.sqrt(potential)) % 5 < 1){
                    ctx.fillRect(i, j, 2, 2)
                }
            }
        }
    }

    ctx.strokeStyle = "rgb(40, 40, 40)"
    ctx.fillStyle = "rgb(40, 40, 40)"
    for(let i = 0;i<electricField.length;i+=flowMarkerStep){
        for(let j = 0;j<electricField[0].length;j+=flowMarkerStep){
            ctx.beginPath()
            ctx.moveTo(i * gridStep, j * gridStep)
            ctx.lineTo(gridStep * (i + flowMarkerLength * electricField[i][j].x), gridStep * (j + flowMarkerLength * electricField[i][j].y))
            ctx.closePath()
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(gridStep * (i + flowMarkerLength * electricField[i][j].x), gridStep * (j + flowMarkerLength * electricField[i][j].y), gridStep * flowMarkerLength / 5, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.fill()
        }
    }
}

let mouseDown = false

const render = () => {
    renderVoltageField(voltageFieldCanvas, voltageFieldCanvas.getContext("2d"), mouseDown ? 4 : 1, mouseDown ? 6 : 24, mouseDown ? 2 : 8, !mouseDown)
    renderObjectManipulation("electric", objectManipulationCanvas, objectManipulationCanvas.getContext("2d"), objects, 20)
}

objectManipulationCanvas.addEventListener("mousedown", () => mouseDown = true)
objectManipulationCanvas.addEventListener("mouseup", () => {
    mouseDown = false
    render()
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