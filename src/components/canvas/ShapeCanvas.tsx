import { useEffect, useRef } from "react";
import { drawShape } from "../../types/ShapeStrategy";
import { ShapeData } from "../../types/ShapeType";

type Props = {
    shapes: ShapeData[];
    hoveredShapeId: string | undefined;
    selectedShapeIds: string[];
    onShapeHover: (shapeId: string | undefined) => void
};

const ShapeCanvas: React.FC<Props> = ({
    shapes,
    hoveredShapeId,
    selectedShapeIds,
    onShapeHover
}: Props) => {
    // I used RxJS a lot, as my last job was in Angular. It's really good for chaining
    // UI events in non-messy ways

    // TODO: when doing mouse hover / clicking, search in reverse to get the frontmost element
    // TODO: try the double canvas approach when finished

    const shapeCanvasRef = useRef<HTMLCanvasElement>(null);
    // Used to avoid re-drawing entire canvas on hover
    const outlineCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update shapes and
    useEffect(() => {
        const shapeCanvas = shapeCanvasRef.current;
        if (!shapeCanvas) {
            return;
        }

        const shapeContext = shapeCanvas.getContext(
            "2d"
        ) as CanvasRenderingContext2D;
        shapeContext.clearRect(0, 0, 500, 500);

        // Draw the non selected shapes first to avoid any artifacting when
        // selected shapes overlap non-selected shapes

        const unSelectedShapes = [...shapes].filter(
            ({ id }) => !selectedShapeIds.includes(id)
        );
        const selectedShapes = [...shapes].filter(({ id }) =>
            selectedShapeIds.includes(id)
        );

        unSelectedShapes.forEach((shape) => {
            drawShape(shape, shapeContext);
        });

        selectedShapes.forEach((shape) => {
            drawShape(shape, shapeContext);
            // TODO: draw selected outline
        });

        console.log("RERENDER");
    }, [shapes, selectedShapeIds]);

    useEffect(() => {
        const outlineCanvas = outlineCanvasRef.current;
        if (
            !outlineCanvas ||
            !hoveredShapeId ||
            !shapes.some(({ id }) => id === hoveredShapeId)
        ) {
            console.log("nothing is hovered");
            return;
        }
        // TODO: draw hover outline if needed
        console.log(`${hoveredShapeId} is hovered`);
    }, [shapes, hoveredShapeId]);

    return (
        // In my experience, canvases can be weird with events
        // So I'll do all the event captures on this div
        <div className="h-[500px] w-[500px] bg-white relative">
            <canvas
                className="absolute z-0 pointer-events-none"
                width={500}
                height={500}
                ref={shapeCanvasRef}
            ></canvas>
            <canvas
                className="absolute z-10 pointer-events-none"
                width={500}
                height={500}
                ref={outlineCanvasRef}
            ></canvas>
        </div>
    );
};

export default ShapeCanvas;
