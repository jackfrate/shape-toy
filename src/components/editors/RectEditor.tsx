import { RectangleData } from "../../types/ShapeType";

type Props = {
    shapeData: RectangleData;
    onShapeUpdate: (newShapeData: RectangleData) => void;
};

const RectEditor: React.FC<Props> = ({ shapeData, onShapeUpdate }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-8 items-center">
                <div className="font-bold">Width</div>
                <input
                    type="range"
                    min="1"
                    max="500"
                    step={1}
                    value={shapeData.width}
                    className="range range-primary"
                    onInput={(e) =>
                        onShapeUpdate({
                            ...shapeData,
                            width: parseInt(e.currentTarget.value),
                        })
                    }
                />
            </div>
            <div className="flex flex-row gap-8 items-center">
                <div className="font-bold">Height</div>
                <input
                    type="range"
                    min="1"
                    max="500"
                    step={1}
                    value={shapeData.height}
                    className="range range-primary"
                    onInput={(e) =>
                        onShapeUpdate({
                            ...shapeData,
                            height: parseInt(e.currentTarget.value),
                        })
                    }
                />
            </div>
        </div>
    );
};

export default RectEditor;
