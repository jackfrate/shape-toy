import { useEffect, useRef } from "react";
import { ShapeData } from "../../types/ShapeType";

type Props = {
    shapes: ShapeData[];
    hoveredShapeId: string | undefined;
    selectedShapeIds: string[];
};

const ShapeCanvas: React.FC<Props> = ({
    shapes,
    hoveredShapeId,
    selectedShapeIds,
}: Props) => {
    // TODO: when doing mouse hover / clicking, search in reverse to get the frontmost element

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        // Draw the non selected shapes first to avoid any artifacting when 
        // selected shapes overlap non-selected shapes

        console.log("RERENDER");
    }, [shapes, hoveredShapeId, selectedShapeIds]);

    return (
        // In my experience, canvases can be weird with events
        // So I'll do all the event captures on this div
        <div className="h-[500px] w-[500px] bg-white">
            <canvas width={500} height={500} ref={canvasRef}></canvas>
        </div>
    );
};

export default ShapeCanvas;
