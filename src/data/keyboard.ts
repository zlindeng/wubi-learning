export type WubiArea =
  | "horizontal"
  | "vertical"
  | "left_falling"
  | "dot"
  | "turning";

export interface KeyboardKey {
  key: string;
  keyName: string;
  area: WubiArea;
  areaLabel: string;
}

const areaLabels: Record<WubiArea, string> = {
  horizontal: "横区",
  vertical: "竖区",
  left_falling: "撇区",
  dot: "点捺区",
  turning: "折区",
};

const keyNames: Record<string, { keyName: string; area: WubiArea }> = {
  G: { keyName: "王", area: "horizontal" },
  F: { keyName: "土", area: "horizontal" },
  D: { keyName: "大", area: "horizontal" },
  S: { keyName: "木", area: "horizontal" },
  A: { keyName: "工", area: "horizontal" },
  H: { keyName: "目", area: "vertical" },
  J: { keyName: "日", area: "vertical" },
  K: { keyName: "口", area: "vertical" },
  L: { keyName: "田", area: "vertical" },
  M: { keyName: "山", area: "vertical" },
  T: { keyName: "禾", area: "left_falling" },
  R: { keyName: "白", area: "left_falling" },
  E: { keyName: "月", area: "left_falling" },
  W: { keyName: "人", area: "left_falling" },
  Q: { keyName: "金", area: "left_falling" },
  Y: { keyName: "言", area: "dot" },
  U: { keyName: "立", area: "dot" },
  I: { keyName: "水", area: "dot" },
  O: { keyName: "火", area: "dot" },
  P: { keyName: "之", area: "dot" },
  N: { keyName: "已", area: "turning" },
  B: { keyName: "子", area: "turning" },
  V: { keyName: "女", area: "turning" },
  C: { keyName: "又", area: "turning" },
  X: { keyName: "纟", area: "turning" },
};

export const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "XCVBNM"] as const;

export const keyboardKeys: KeyboardKey[] = Object.entries(keyNames).map(
  ([key, value]) => ({
    key,
    ...value,
    areaLabel: areaLabels[value.area],
  }),
);

export const keyboardKeyMap = new Map(
  keyboardKeys.map((definition) => [definition.key, definition]),
);

export function getKeyboardRowKeys(row: string): KeyboardKey[] {
  return [...row]
    .map((key) => keyboardKeyMap.get(key))
    .filter((key): key is KeyboardKey => key !== undefined);
}
