import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import {
    getHeatmapMonthCells,
    getMonthRanges,
} from "../../helper/heatmap/utils";
import type {
    CellColors,
    HeatmapActivity,
    HeatmapCell,
} from "../../types/heatmap/types";
import { ActivityHeatmapMonth } from "./ActivityHeatmapMonth";

type Props = {
  activities: Array<HeatmapActivity>;
  startDate?: Date;
  endDate?: Date;
  cellColors?: CellColors;
  renderTooltip?: (cell: HeatmapCell) => React.ReactNode;
  style?: ViewStyle;
  monthLabelStyle?: object;
  tooltipStyle?: object;
  cellSize?: number;
};

export const ActivityHeatmap: React.FC<Props> = ({
  activities,
  startDate,
  endDate,
  cellColors = {
    level0: "rgba(30, 41, 57)",
    level1: "rgba(5, 223, 114, 0.3)",
    level2: "rgba(5, 223, 114, 0.5)",
    level3: "rgba(5, 223, 114, 0.7)",
    level4: "rgba(5, 223, 114)",
  },
  renderTooltip,
  style,
  monthLabelStyle,
  tooltipStyle,
  cellSize = 12,
}) => {
  const today = new Date();
  const defaultStartDate = new Date(today);
  defaultStartDate.setDate(defaultStartDate.getDate() - 365);

  const effectiveStartDate = startDate ?? defaultStartDate;
  const effectiveEndDate = endDate ?? today;

  const monthRanges = getMonthRanges(effectiveStartDate, effectiveEndDate);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      style={[styles.scrollContainer, style]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.monthsContainer}>
        {monthRanges.map((month) => {
          const heatmapMonthCells = getHeatmapMonthCells(
            activities,
            month.start,
            month.end
          );
          const columnSizeInCells = Math.ceil(heatmapMonthCells.length / 7);

          return (
            <ActivityHeatmapMonth
              monthName={month.name}
              cells={heatmapMonthCells}
              columnSizeInCells={columnSizeInCells}
              key={month.name + month.start.toISOString()}
              cellColors={cellColors}
              renderTooltip={renderTooltip}
              monthLabelStyle={monthLabelStyle}
              tooltipStyle={tooltipStyle}
              cellSize={cellSize}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    width: "100%",
    maxWidth: "100%",
  },
  scrollContent: {
    paddingBottom: 16,
  },
  monthsContainer: {
    flexDirection: "row",
    gap: 4,
  },
});
