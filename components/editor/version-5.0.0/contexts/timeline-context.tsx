import React, { createContext, useContext, useState } from "react";
import { INITIAL_ROWS, MAX_ROWS } from "../constants";

interface TimelineContextType {
  visibleRows: number;
  setVisibleRows: (rows: number) => void;
  addRow: () => void;
  removeRow: () => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined
);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);

  const addRow = () => {
    setVisibleRows((current) => Math.min(current + 1, MAX_ROWS));
  };

  const removeRow = () => {
    setVisibleRows((current) => Math.max(current - 1, INITIAL_ROWS));
  };

  return (
    <TimelineContext.Provider
      value={{ visibleRows, setVisibleRows, addRow, removeRow }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
};
