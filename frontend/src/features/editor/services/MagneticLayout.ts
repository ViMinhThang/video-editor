/**
 * @what A specialized layout service for 1-dimensional "Magnetic/Insert" dragging.
 * @why Enables the "make room for me" feature by shifting existing clips based on hover proximity.
 * @how Analyzes clip boundaries and calculates a temporary offset array to visualize the insertion point.
 */

import { TimelineLayoutItem } from "@/lib/utils";

export interface ShiftedLayoutResult {
  shiftedItems: (TimelineLayoutItem & { shiftedX: number })[];
  insertionIndex: number;
}

/**
 * Calculates the shifted positions of clips to accommodate a dragging item.
 */
export function calculateMagneticShift(
  layout: TimelineLayoutItem[],
  draggingId: number | null,
  dragX: number,
  dragWidth: number,
  groupGap: number
): ShiftedLayoutResult {
  if (draggingId === null) {
    return { 
      shiftedItems: layout.map(item => ({ ...item, shiftedX: item.x })), 
      insertionIndex: -1 
    };
  }

  // Filter out the item currently being dragged
  const otherItems = layout.filter(item => item.id !== draggingId);
  
  // Find where the dragging item would fit
  let insertionIndex = 0;
  for (let i = 0; i < otherItems.length; i++) {
    const item = otherItems[i];
    const midPoint = item.x + item.width / 2;
    if (dragX > midPoint) {
      insertionIndex = i + 1;
    } else {
      break;
    }
  }

  // Shift items after the insertion point to the right
  const shiftedItems = otherItems.map((item, idx) => {
    let shiftedX = item.x;
    if (idx >= insertionIndex) {
      shiftedX += dragWidth + groupGap;
    }
    return { ...item, shiftedX };
  });

  return { shiftedItems, insertionIndex };
}
