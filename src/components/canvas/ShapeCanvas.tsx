import { useEffect, useRef, useState } from "react";
import { drawShape } from "../../types/ShapeStrategy";
import { ShapeData } from "../../types/ShapeType";

type Coordinate = { x: number; y: number };

const checkIfPointerInShape = (
    { x, y }: Coordinate,
    shapePaths: Map<string, Path2D>,
    ctx: CanvasRenderingContext2D
): string | undefined => {
    let foundShapeId: string | undefined = undefined;
    shapePaths.forEach((path, shapeId) => {
        // Very nice that we can just cache the paths and use that to check
        if (ctx.isPointInPath(path, x, y)) {
            console.log("found shape");
            foundShapeId = shapeId;
            return shapeId;
        }
    });

    return foundShapeId;
};

type Props = {
    shapes: ShapeData[];
    hoveredShapeId: string | undefined;
    selectedShapeIds: string[];
    onShapeHover: (shapeId: string | undefined) => void;
    setSelectedShapeIds: (shapeIds: string[]) => void;
};

const ShapeCanvas: React.FC<Props> = ({
    shapes,
    hoveredShapeId,
    selectedShapeIds,
    onShapeHover,
    setSelectedShapeIds,
}: Props) => {
    // TODO: when doing mouse hover / clicking, search in reverse to get the frontmost element
    // TODO: try the double canvas approach when finished

    const [pointerIsDown, setPointerIsDown] = useState(false);
    const [pointerdownCoordinates, setPointerdownCoordinates] =
        useState<Coordinate>({ x: 0, y: 0 });

    const [shapePaths, setShapePaths] = useState<Map<string, Path2D>>(
        new Map()
    );

    const [currentPointerCoordinates, setCurrentPointerCoordinates] =
        useState<Coordinate>({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    const shapeCanvasRef = useRef<HTMLCanvasElement>(null);
    // Used to avoid re-drawing entire canvas on hover
    const outlineCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update shapes and their selection outlines
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

        const newPathMap = new Map<string, Path2D>();

        unSelectedShapes.forEach((shape) => {
            const path = drawShape(shape, shapeContext);
            newPathMap.set(shape.id, path);
        });

        selectedShapes.forEach((shape) => {
            const path = drawShape(shape, shapeContext);
            newPathMap.set(shape.id, path);

            // TODO: draw selected outline
        });

        setShapePaths(newPathMap);

        console.log("RERENDER");
    }, [shapes, selectedShapeIds]);

    // Update hover on shapes
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
        <div
            className="h-[500px] w-[500px] bg-white relative"
            ref={containerRef}
            onMouseDown={(e) => {
                setPointerIsDown(true);
                setPointerdownCoordinates({
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                });
            }}
            onMouseUp={() => {
                setPointerIsDown(false);
            }}
            // ensure we don't get buggy dragging
            onMouseLeave={() => setPointerIsDown(false)}
            onMouseMove={(e) =>
                setCurrentPointerCoordinates({
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                })
            }
            onClick={(e) => {
                const clickedShapeId = checkIfPointerInShape(
                    currentPointerCoordinates,
                    shapePaths,
                    // @ts-ignore
                    shapeCanvasRef.current?.getContext("2d")
                );
                console.log(`found element ${clickedShapeId}`);
                if (clickedShapeId === undefined) {
                    console.log("clicked OUTSIDE element");

                    setSelectedShapeIds([]);
                    return;
                }

                const newSelectedShapeIds: string[] = e.shiftKey
                    ? [...selectedShapeIds]
                    : [];
                newSelectedShapeIds.push(clickedShapeId);

                setSelectedShapeIds(newSelectedShapeIds);
            }}
        >
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
