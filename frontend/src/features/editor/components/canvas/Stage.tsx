/**
 * @what The root container for all visual elements on the editor canvas.
 * @why Provides a standardized, declarative stage for 'react-konva' rendering.
 * @how Orchestrates layers and manages stage-level events (like deselecting objects).
 */

import React from "react";
import { Stage, Layer } from "react-konva";

interface EditorStageProps {
  width: number;
  height: number;
  children: React.ReactNode;
  onStageClick?: (e: any) => void;
}

export const EditorStage: React.FC<EditorStageProps> = ({
  width,
  height,
  children,
  onStageClick,
}) => {
  return (
    <Stage
      width={width}
      height={height}
      onClick={onStageClick}
      onTap={onStageClick}
      className="bg-black shadow-inner"
    >
      <Layer>{children}</Layer>
    </Stage>
  );
};
