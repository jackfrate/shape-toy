import { CircleData } from "../../types/ShapeType";

type Props = {
    shapeData: CircleData;
    onShapeUpdate: (newShapeData: CircleData) => void;
};

const CircleEditor: React.FC<Props> = ({ shapeData, onShapeUpdate }: Props) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row gap-8 pl-4 items-center">
                <div className="font-bold">Radius</div>
                <input
                    type="range"
                    min="5"
                    max="250"
                    step={1}
                    value={shapeData.radius}
                    className="range range-primary"
                    onInput={(e) =>
                        onShapeUpdate({
                            ...shapeData,
                            radius: parseInt(e.currentTarget.value),
                        })
                    }
                />
            </div>
        </div>
    );
};

export default CircleEditor;
