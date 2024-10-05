"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

import { pusher } from "@/lib/pusher";

const userId = (Math.random() + 1).toString(36).substring(2);
console.log("userId is", userId);

const debouncedPaintData: {
  lines: [number, number][];
  color: string;
  size: number;
} = {
  lines: [],
  color: "#000000",
  size: 5,
};
let isNew = true;

interface PaintData {
  coords: [number, number];
  color: string;
  size: number;
  isNew?: boolean;
}
const sendPaintDataDebounced = async (paintData: PaintData) => {
  const { coords, color, size } = paintData;
  debouncedPaintData.lines.push(coords);
  debouncedPaintData.color = color;
  debouncedPaintData.size = size;
  if (paintData.isNew) {
    isNew = true;
  }
};

const sendPaintData = async () => {
  const body = {
    lines: [...debouncedPaintData.lines],
    color: debouncedPaintData.color,
    size: debouncedPaintData.size,
    userId,
    isNew,
  };
  isNew = false;
  const response = await fetch("http://localhost:4000/v1/paint", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
};

setInterval(() => {
  if (debouncedPaintData.lines.length > 0) {
    sendPaintData();
  }
  debouncedPaintData.lines = [];
}, 1000);

export function DrawingCanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
    }
  }, []);

  useEffect(() => {
    const channel = pusher.subscribe("painting");

    channel.bind("draw", (rawData: { chunk: string }) => {
      try {
        const data = JSON.parse(rawData.chunk);
        console.log("Got message", { data });
        if (data.userId === userId) {
          return;
        }
        drawExternal(data.lines, data.color, data.size, data.isNew);
      } catch (error) {
        console.error("Error parsing message", error, rawData);
      }
    });

    return () => {
      channel.unbind("draw");
    };
  }, []);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;

    setIsDrawing(true);

    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const rect = canvas?.getBoundingClientRect();
    isNew = true;
    context.beginPath();
    context.moveTo(clientX - rect!.left, clientY - rect!.top);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;

    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const rect = canvas?.getBoundingClientRect();
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    const x = clientX - rect!.left;
    const y = clientY - rect!.top;
    context.lineTo(x, y);
    context.stroke();
    sendPaintDataDebounced({ coords: [x, y], color, size: brushSize });
  };

  const drawExternal = (
    coords: [number, number][],
    color: string,
    size: number,
    isNew: boolean
  ) => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    context.strokeStyle = color;
    context.lineWidth = size;
    if (isNew) {
      context.beginPath();
    }
    coords.forEach(([x, y]) => {
      context.lineTo(x, y);
    });
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas!.width, canvas!.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "drawing.png";
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-1/4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Room ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="roomId">Enter Room ID:</Label>
              <Input
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Drawing Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="color">Brush Color:</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-8 p-0 border-none"
                />
                <span>{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brushSize">Brush Size: {brushSize}px</Label>
              <Slider
                id="brushSize"
                min={1}
                max={50}
                step={1}
                value={[brushSize]}
                onValueChange={(value) => setBrushSize(value[0])}
              />
            </div>
            <div className="space-y-2">
              <Button
                onClick={clearCanvas}
                variant="secondary"
                className="w-full"
              >
                Clear Canvas
              </Button>
              <Button
                onClick={saveDrawing}
                variant="outline"
                className="w-full"
              >
                Save Drawing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full lg:w-3/4">
        <CardHeader>
          <CardTitle>Drawing Canvas</CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 rounded-md cursor-crosshair touch-none w-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </CardContent>
      </Card>
    </div>
  );
}
