const renderObjectManipulation = (modelType, canvas, ctx, objects, objectRenderRadii) => {
    ctx.fillStyle = "rgb(240, 240, 240)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "rgb(40, 40, 40)"
    ctx.textAlign = "center"
    ctx.strokeStyle = "rgb(240, 240, 240)"
    objects.forEach(object => {
        ctx.beginPath()
        ctx.arc(object.x, object.y, objectRenderRadii, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.strokeText(modelType == "gravity" ? object.mass.toString() : object.charge.toString(), object.x, object.y + 3)
    })
}

export default renderObjectManipulation