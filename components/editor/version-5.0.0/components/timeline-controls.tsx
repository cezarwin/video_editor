import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Plus, Minus, Settings } from "lucide-react";
import { useEditorContext } from "../contexts/editor-context";
import { useTimeline } from "../contexts/timeline-context";
import { MAX_ROWS, INITIAL_ROWS } from "../constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
type AspectRatioOption = "16:9" | "9:16" | "1:1" | "4:5";

/**
 * Props for the TimelineControls component.
 * @interface TimelineControlsProps
 */
interface TimelineControlsProps {
  /** Indicates whether the timeline is currently playing */
  isPlaying: boolean;
  /** Function to toggle between play and pause states */
  togglePlayPause: () => void;
  /** The current frame number in the timeline */
  currentFrame: number;
  /** The total duration of the timeline in frames */
  totalDuration: number;
  /** Function to format frame numbers into a time string */
  formatTime: (frames: number) => string;
}

/**
 * TimelineControls component provides video playback controls and aspect ratio selection.
 * It displays:
 * - Play/Pause button
 * - Current time / Total duration
 * - Aspect ratio selector (hidden on mobile)
 *
 * @component
 * @param {TimelineControlsProps} props - Component props
 * @returns {React.ReactElement} Rendered TimelineControls component
 *
 * @example
 * ```tsx
 * <TimelineControls
 *   isPlaying={isPlaying}
 *   togglePlayPause={handlePlayPause}
 *   currentFrame={currentFrame}
 *   totalDuration={duration}
 *   formatTime={formatTimeFunction}
 * />
 * ```
 */
export const TimelineControls: React.FC<TimelineControlsProps> = ({
  isPlaying,
  togglePlayPause,
  currentFrame,
  totalDuration,
  formatTime,
}) => {
  // Context
  const {
    aspectRatio,
    setAspectRatio,
    setSelectedOverlayId,
    deleteOverlaysByRow,
  } = useEditorContext();
  const { visibleRows, addRow, removeRow } = useTimeline();

  // Handlers
  const handlePlayPause = () => {
    if (!isPlaying) {
      setSelectedOverlayId(null);
    }
    togglePlayPause();
  };

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value as AspectRatioOption);
  };

  const handleRemoveRow = () => {
    // Delete overlays on the last row before removing it
    deleteOverlaysByRow(visibleRows - 1);
    removeRow();
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-800 bg-gray-900/95 px-4 py-3 backdrop-blur-sm">
      {/* Left section: Empty div for spacing */}
      <div className="w-8" /> {/* This creates equal spacing on both sides */}
      {/* Center section: Play/Pause control and time display */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={handlePlayPause}
          size="icon"
          variant="default"
          className="bg-gray-800 hover:bg-gray-700"
        >
          {isPlaying ? (
            <Pause className="h-3 w-3 text-white" />
          ) : (
            <Play className="h-3 w-3 text-white" />
          )}
        </Button>
        <span className="text-xs font-medium text-white">
          {formatTime(currentFrame)} / {formatTime(totalDuration)}
        </span>
      </div>
      {/* Right section: Settings menu */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-200 hover:text-white hover:bg-gray-800/80 transition-colors rounded-md"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
            <DropdownMenuLabel className="text-zinc-200">
              Timeline Settings
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={addRow}
                disabled={visibleRows >= MAX_ROWS}
                className="text-zinc-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Row
                <span className="ml-auto text-zinc-400 text-sm">
                  ({visibleRows}/{MAX_ROWS})
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRemoveRow}
                disabled={visibleRows <= INITIAL_ROWS}
                className="text-zinc-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
              >
                <Minus className="mr-2 h-4 w-4" />
                Remove Row
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-zinc-400 text-xs">
                Aspect Ratio
              </DropdownMenuLabel>
              {["16:9", "9:16", "4:5"].map((ratio) => (
                <DropdownMenuItem
                  key={ratio}
                  onClick={() => handleAspectRatioChange(ratio)}
                  className="text-zinc-200 hover:text-white focus:text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <span
                    className={`${
                      aspectRatio === ratio ? "text-white" : "text-zinc-200"
                    }`}
                  >
                    {ratio}
                  </span>
                  {aspectRatio === ratio && (
                    <span className="ml-auto text-zinc-400">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
