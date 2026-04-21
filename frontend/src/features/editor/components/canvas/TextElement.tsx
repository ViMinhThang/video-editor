/**
 * @what An interactive text object within the Konva scene graph.
 * @why Enables declarative management of text properties (font size, color, rotation) and integrates with the Konva Transformer for professional-grade manipulation.
 * @how Wraps the Konva '<Text />' component and manages selection states for transformation overlays.
 */

import React, { useRef, useEffect } from "react";
import { Text, Transformer } from "react-konva";
import Konva from "konva";
import type { TrackItem } from "@/types";

interface TextElementProps {
  item: TrackItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<TrackItem>) => void;
}

export const TextElement: React.FC<TextElementProps> = ({
  item,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        ref={shapeRef}
        text={item.text_content}
        x={item.x ?? 100}
        y={item.y ?? 100}
        rotation={item.rotation ?? 0}
        fontSize={item.fontSize ?? 24}
        fill={item.color || "#ffffff"}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            ...item,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            fontSize: Math.max(5, (item.fontSize ?? 24) * scaleX),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          anchorFill="#3b82f6"
          anchorStroke="#ffffff"
          anchorCornerRadius={4}
          borderStroke="#3b82f6"
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
