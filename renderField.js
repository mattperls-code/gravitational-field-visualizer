const renderField = (modelType, canvas, ctx, objects, gridStep, flowMarkerStep, flowMarkerLength, showVectorField) => {
    const modelSignCoefficient = modelType == "gravity" ? -1 : 1

    const field = []
    for(let i = 0;i<canvas.width/gridStep;i++){
        field.push([])
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
                    const forceMagnitude = (modelType == "gravity" ? object.mass : object.charge) / dSquared
                    const magnitude = Math.sqrt(dSquared)
        
                    netForce.x += modelSignCoefficient * forceMagnitude * dx / magnitude
                    netForce.y += modelSignCoefficient * forceMagnitude * dy / magnitude
                }
            })
            const netForceMagnitude = Math.sqrt(netForce.x * netForce.x + netForce.y * netForce.y)
            netForce.x /= netForceMagnitude
            netForce.y /= netForceMagnitude
            field[i].push(netForce)
        }
    }
    for(let i = 0;i<field.length;i++){
        for(let j = 0;j<field[0].length;j++){
            const angle = Math.floor(360 * (Math.atan2(field[i][j].y, field[i][j].x) + Math.PI) / (2 * Math.PI))
            ctx.fillStyle = `hsl(${angle}, 60%, 50%)`
            ctx.fillRect(i * gridStep, j * gridStep, gridStep, gridStep)
        }
    }

    if(showVectorField){
        ctx.strokeStyle = "white"
        ctx.fillStyle = "white"
        for(let i = 0;i<field.length;i+=flowMarkerStep){
            for(let j = 0;j<field[0].length;j+=flowMarkerStep){
                ctx.beginPath()
                ctx.moveTo(i * gridStep, j * gridStep)
                ctx.lineTo(gridStep * (i + flowMarkerLength * field[i][j].x), gridStep * (j + flowMarkerLength * field[i][j].y))
                ctx.closePath()
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(gridStep * (i + flowMarkerLength * field[i][j].x), gridStep * (j + flowMarkerLength * field[i][j].y), gridStep * flowMarkerLength / 6, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.fill()
            }
        }
    }
}

export default renderField