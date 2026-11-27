import { useEffect, useState } from "react";
import { getKeyboardRowKeys, keyboardRows, keyboardKeys, type KeyboardKey } from "../data/keyboard";

const keyboardKeysByCode = new Map(keyboardKeys.map((key) => [key.key, key]));

interface KeyboardProps {
  onSelectKey?: (key: KeyboardKey) => void;
}

export function Keyboard({ onSelectKey }: KeyboardProps) {
  const [selectedKey, setSelectedKey] = useState<KeyboardKey | null>(null);

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (!event.shiftKey || event.ctrlKey || event.altKey || event.metaKey ||
          event.isComposing || event.repeat || !/^Key[A-Y]$/.test(event.code)) return;
      const target = event.target;
      if (target instanceof HTMLElement &&
          (target.isContentEditable || target.closest("input, textarea, select, [contenteditable='true'], [role='textbox']'))) return;
      const key = keyboardKeysByCode.get(event.code.slice(3));
      if (!key) return;
      event.preventDefault();
      setSelectedKey(key);
      onSelectKey?.(key);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectKey]);

  function selectKey(key: KeyboardKey) {
    setSelectedKey(key);
    onSelectKey?.(key);
  }

  return (
    <section className="keyboard-panel" aria-label="86 版五笔键盘">
      <div className="keyboard-legend" aria-label="五区图例">
        <span><i className="legend-dot horizontal" />横区</span>
        <span><i className="legend-dot vertical" />竖区</span>
        <span><i className="legend-dot left_falling" />撇区</span>
        <span><i className="legend-dot dot" />点捺区</span>
        <span><i className="legend-dot turning" />折区</span>
      </div>
      <div className="keyboard-rows">
        {keyboardRows.map((row, index) => (
          <div className={`keyboard-row row-${index + 1}`} key={row}>
            {getKeyboardRowKeys(row).map((key) => (
              <button
                aria-label={`${key.key} 键，键名 ${key.keyName}，${key.areaLabel}`}
                aria-pressed={selectedKey?.key === key.key}
                className={`keyboard-key ${key.area} ${selectedKey?.key === key.key ? "selected" : ""}`}
                key={key.key}
                onClick={() => selectKey(key)}
                type="button"
              >
                <span className="key-letter">{key.key}</span>
                <span className="key-name">{key.keyName}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="key-detail" aria-live="polite">
        {selectedKey ? (
          <>
            <span className="detail-key">{selectedKey.key}</span>
            <div>
              <strong>{selectedKey.keyName} · {selectedKey.areaLabel}</strong>
              <p>键名字根已标注。该键的完整字根清单仍在核验中，暂不展示未经确认的内容。</p>
            </div>
          </>
        ) : (
          <p>选择一个键位，查看键名与所属分区。</p>
        )}
      </div>
      <p className="keyboard-note">按 <kbd>Shift</kbd> + 字母键可选择键位；当前展示已核验的 25 个键位骨架，完整字根数据尚未接入。</p>
    </section>
  );
}
