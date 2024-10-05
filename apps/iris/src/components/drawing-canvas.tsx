"use client"

import { useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function DrawingCanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      context.lineCap = 'round'
      context.lineJoin = 'round'
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return

    setIsDrawing(true)

    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
    const rect = canvas?.getBoundingClientRect()
    context.beginPath()
    context.moveTo(clientX - rect!.left, clientY - rect!.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return

    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
    const rect = canvas?.getBoundingClientRect()
    context.strokeStyle = color
    context.lineWidth = brushSize
    context.lineTo(clientX - rect!.left, clientY - rect!.top)
    context.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas!.width, canvas!.height)
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = 'drawing.png'
    link.click()
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Drawing Canvas</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border border-gray-300 rounded-md cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="color">Color:</Label>
          <Input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 p-0 border-none"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="brushSize">Brush Size:</Label>
          <Input
            type="number"
            id="brushSize"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            min={1}
            max={50}
            className="w-16"
          />
        </div>
        <Button onClick={clearCanvas} variant="outline">Clear</Button>
        <Button onClick={saveDrawing}>Save</Button>
      </CardFooter>
    </Card>
  )
}