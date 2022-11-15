const renderGravitationalField = (canvas, ctx, objects, gridStep, flowMarkerStep, flowMarkerLength, showVectorField) => {
    let greatestForceMagnitude = 0
    const gravitationalField = []
    for(let i = 0;i<canvas.width/gridStep;i++){
        gravitationalField.push([])
        for(let j = 0;j<canvas.height/gridStep;j++){
            let netForce = {
                x: 0,
                y: 0
            }
            objects.forEach(object => {
                const dx = i * gridStep - object.x
                const dy = j * gridStep - object.y
                const magnitude = Math.sqrt(dx * dx + dy * dy)

                if(magnitude != 0){
                    const forceMagnitude = object.mass / (magnitude * magnitude)
        
                    netForce.x -= forceMagnitude * dx / magnitude
                    netForce.y -= forceMagnitude * dy / magnitude
                }
            })
            const forceMagnitude = Math.sqrt(netForce.x * netForce.x + netForce.y * netForce.y)
            greatestForceMagnitude = Math.max(greatestForceMagnitude, forceMagnitude)
            gravitationalField[i].push(netForce)
        }
    }
    for(let i = 0;i<gravitationalField.length;i++){
        for(let j = 0;j<gravitationalField[0].length;j++){
            gravitationalField[i][j].x /= greatestForceMagnitude
            gravitationalField[i][j].y /= greatestForceMagnitude

            const angle = Math.floor(360 * (Math.atan2(gravitationalField[i][j].y, gravitationalField[i][j].x) + Math.PI) / (2 * Math.PI))
            const magnitude = 60 + 40 * Math.floor(gravitationalField[i][j].x * gravitationalField[i][j].x + gravitationalField[i][j].y * gravitationalField[i][j].y)
            ctx.fillStyle = `hsl(${angle}, ${magnitude}%, 50%)`
            ctx.fillRect(i * gridStep, j * gridStep, gridStep, gridStep)
        }
    }

    if(showVectorField){
        ctx.strokeStyle = "white"
        ctx.fillStyle = "white"
        for(let i = 0;i<gravitationalField.length;i+=flowMarkerStep){
            for(let j = 0;j<gravitationalField[0].length;j+=flowMarkerStep){
                const strength = Math.sqrt(gravitationalField[i][j].x * gravitationalField[i][j].x + gravitationalField[i][j].y * gravitationalField[i][j].y)
                ctx.beginPath()
                ctx.moveTo(i * gridStep, j * gridStep)
                ctx.lineTo(gridStep * (i + flowMarkerLength * gravitationalField[i][j].x / strength), gridStep * (j + flowMarkerLength * gravitationalField[i][j].y / strength))
                ctx.closePath()
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(gridStep * (i + flowMarkerLength * gravitationalField[i][j].x / strength), gridStep * (j + flowMarkerLength * gravitationalField[i][j].y / strength), gridStep * flowMarkerLength / 6, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.fill()
            }
        }
    }
}

export default renderGravitationalField