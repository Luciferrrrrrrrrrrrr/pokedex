import { View, Text, StyleSheet } from "react-native";

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

export default function StatBar({
  label,
  value,
  color,
}: StatBarProps) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>

      <View style={styles.statBarBackground}>
        <View
          style={[
            styles.statBarFill,
            {
              flex: Math.min(value, 100) / 100,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    width: 60,
    fontSize: 12,
    fontWeight: "bold",
  },
  statBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
  },
  statValue: {
    width: 30,
    textAlign: "right",
    fontSize: 12,
  },
});
