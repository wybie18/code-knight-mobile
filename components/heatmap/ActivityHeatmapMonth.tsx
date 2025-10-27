import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getColor } from "../../helper/heatmap/utils";
import type { CellColors, HeatmapCell } from "../../types/heatmap/types";
import { Tooltip } from "./Tooltip";

type Props = {
  monthName: string;
  cells: HeatmapCell[];
  columnSizeInCells: number;
  cellColors: CellColors;
  renderTooltip?: (cell: HeatmapCell) => React.ReactNode;
  monthLabelStyle?: object;
  tooltipStyle?: object;
  cellSize?: number;
};

export const ActivityHeatmapMonth: React.FC<Props> = ({
  cells,
  monthName,
  columnSizeInCells,
  cellColors,
  renderTooltip,
  monthLabelStyle,
  tooltipStyle,
  cellSize = 12,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);

  const handleCellPress = (cell: HeatmapCell) => {
    if (cell === "invisible") return;

    const content = renderTooltip
      ? renderTooltip(cell)
      : `${cell.count} ${cell.count === 1 ? "activity" : "activities"} on ${cell.date}`;

    setTooltipContent(content);
    setTooltipVisible(true);
  };

  const gap = 2;

  const columns: HeatmapCell[][] = [];
  for (let col = 0; col < columnSizeInCells; col++) {
    columns[col] = [];
    for (let row = 0; row < 7; row++) {
      const index = col * 7 + row;
      columns[col][row] = cells[index] || "invisible";
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { gap }]}>
        {columns.map((column, colIndex) => (
          <View key={colIndex} style={[styles.column, { gap }]}>
            {column.map((cell, rowIndex) => {
              const cellIndex = colIndex * 7 + rowIndex;
              if (cell === "invisible") {
                return (
                  <View
                    key={cellIndex}
                    style={[
                      styles.cellInvisible,
                      { width: cellSize, height: cellSize },
                    ]}
                  />
                );
              }
              return (
                <TouchableOpacity
                  key={cellIndex}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getColor(cell.level, cellColors),
                    },
                  ]}
                  onPress={() => handleCellPress(cell)}
                  activeOpacity={0.7}
                />
              );
            })}
          </View>
        ))}
      </View>
      {columnSizeInCells >= 3 && (
        <Text style={[styles.monthName, monthLabelStyle]}>
          {monthName.slice(0, 3)}
        </Text>
      )}
      <Tooltip
        visible={tooltipVisible}
        content={tooltipContent}
        onClose={() => setTooltipVisible(false)}
        style={tooltipStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  grid: {
    flexDirection: "row",
    padding: 1,
  },
  column: {
    flexDirection: "column",
  },
  cell: {
    minWidth: 8,
    minHeight: 8,
  },
  cellInvisible: {
    backgroundColor: "transparent",
  },
  monthName: {
    fontSize: 10,
    marginTop: 4,
    color: "#a1a1aa"
  },
});
