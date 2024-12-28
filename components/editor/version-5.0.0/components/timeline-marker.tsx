import React, { useMemo } from "react";

/**
 * Props for the TimelineMarker component.
 * @interface TimelineMarkerProps
 * @property {number} currentFrame - The current frame position in the timeline.
 * @property {number} totalDuration - The total duration of the timeline.
 * @property {number} zoom - The current zoom level of the timeline.
 */
interface TimelineMarkerProps {
  currentFrame: number;
  totalDuration: number;
}

/**
 * TimelineMarker component displays a marker on a timeline to indicate the current position.
 * It renders a vertical line with a triangle pointer at the top.
 *
 * @component
 * @param {TimelineMarkerProps} props - The props for the TimelineMarker component.
 * @returns {React.ReactElement} A React element representing the timeline marker.
 */
const TimelineMarker: React.FC<TimelineMarkerProps> = React.memo(
  ({ currentFrame, totalDuration }) => {
    // Calculate the marker's position as a percentage of the timeline width
    const markerPosition = useMemo(() => {
      return `${(currentFrame / totalDuration) * 100}%`;
    }, [currentFrame, totalDuration]);

    return (
      <div
        className="absolute top-0 w-[2px] bg-red-500 pointer-events-none z-50"
        style={{
          left: markerPosition,
          transform: "translateX(-50%)",
          height: "calc(100% + 0px)",
          top: "0px",
        }}
      >
        {/* Triangle pointer at the top of the marker */}
        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500 absolute top-[0px] left-1/2 transform -translate-x-1/2" />
      </div>
    );
  }
);

TimelineMarker.displayName = "TimelineMarker";

export default TimelineMarker;