import { clamp, distance } from "@popmotion/popcorn";

// Prevent rapid reverse swapping
const buffer = 5;

export const findIndex = (i, yOffset, positions) => {
  let target = i;
  const { left, width } = positions[i];
  const bottom = left + width;

  // If moving down
  if (yOffset > 0) {
    const nextItem = positions[i + 1];
    if (nextItem === undefined) return i;

    const swapOffset =
      distance(bottom, nextItem.left + nextItem.width / 2) + buffer;
    if (yOffset > swapOffset) target = i + 1;

    // If moving up
  } else if (yOffset < 0) {
    const prevItem = positions[i - 1];
    if (prevItem === undefined) return i;

    const prevBottom = prevItem.left + prevItem.width;
    const swapOffset = distance(left, prevBottom - prevItem.width / 2) + buffer;
    if (yOffset < -swapOffset) target = i - 1;
  }

  return clamp(0, positions.length, target);
};
