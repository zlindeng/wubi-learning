import { useEffect, useState, type KeyboardEvent } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { attemptRepository, mistakeRepository, progressRepository } from "../repositories";
import { keyboardKeys, type KeyboardKey } from "../data/keyboard";
import { usePracticeSessionStore } from "../stores";

const LESSON_ID = "keyboard-key-recognition";
const EXERCISE_PREFIX = "keyboard-key:";

type AnswerState = "correct" | "incorrect" | null;

function chooseQuestion(previousKey?: string): KeyboardKey {
  const candidates = previousKey
    ? keyboardKeys.filter((key) => key.key !== previousKey)
    : keyboardKeys;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function PracticePage() {
  const [question, setQuestion] = useState(() => chooseQuestion());
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [lastAnswer, setLastAnswer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const session = usePracticeSessionStore((state) => state.session);
  const startSession = usePracticeSessionStore((state) => state.startSession);
  const updateInput = usePracticeSessionStore((state) => state.updateInput);
  const completeSession = usePracticeSessionStore((state) => state.completeSession);

  useEffect(() => {
    startSession(`${EXERCISE_PREFIX}${question.key}`);
  }, [question.key, startSession]);

  async function submitAnswer(letter: string) {
    if (answerState !== null || isSaving) return;

    const normalized = letter.toUpperCase();
    setLastAnswer(normalized);
    const isCorrect = normalized === question.key;
    setAnswerState(isCorrect ? "correct" : "incorrect");
    setIsSaving(true);
    setSaveError("");
    completeSession();

    try {
      await attemptRepository.record({
        exerciseId: `${EXERCISE_PREFIX}${question.key}`,
        lessonId: LESSON_ID,
        submittedAnswer: normalized,
        isCorrect,
        answeredAt: Date.now(),
      });

      if (isCorrect) {
        await mistakeRepository.resolve(`${EXERCISE_PREFIX}${question.key}`);
      } else {
        await mistakeRepository.recordWrongAnswer(
          `${EXERCISE_PREFIX}${question.key}`,
          normalized,
        );
      }

      const previousProgress = await progressRepository.get(LESSON_ID);
      const lessonAttempts = await attemptRepository.listByLesson(LESSON_ID);
      const correctlyAnswered = new Set(
        lessonAttempts
          .filter((attempt) => attempt.isCorrect)
          .map((attempt) => attempt.exerciseId),
      );
      const mastered = correctlyAnswered.size === keyboardKeys.length;
      const now = Date.now();

      await progressRepository.save({
        lessonId: LESSON_ID,
        status: mastered ? "mastered" : "learning",
        startedAt: previousProgress?.startedAt ?? now,
        ...(mastered ? { completedAt: previousProgress?.completedAt ?? now } : {}),
        updatedAt: now,
      });
    } catch {
      setSaveError("本次答案已显示，但本地记录保存失败。请检查浏览器存储权限后重试。");
    } finally {
      setIsSaving(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (
      event.nativeEvent.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      !/^Key[A-Z]$/.test(event.code)
    ) {
      return;
    }

    event.preventDefault();
    const letter = event.code.slice(3);
    if (answerState === null) {
      updateInput(letter);
      void submitAnswer(letter);
    }
  }

  function nextQuestion() {
    setQuestion((current) => chooseQuestion(current.key));
    setAnswerState(null);
    setLastAnswer("");
    setSaveError("");
  }

  const progressLabel = session?.status === "completed" ? "本题已作答" : "等待输入";

  return (
    <div className="page-content">
      <section className="welcome-section">
        <div>
          <div className="eyebrow">第一课 · 键盘认知</div>
          <h1>键名找键位</h1>
          <p>看到键名字根后，按下它所在的字母键。先熟悉 86 版的 25 个正式字根键。</p>
        </div>
      </section>

      <section
        aria-label="五笔键位认知练习"
        className="practice-card"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="practice-meta">
          <span>86 版 · 键位识别</span>
          <span>{progressLabel}</span>
        </div>

        <div className="practice-prompt">
          <span className="practice-prompt-label">请按下这个键名字根对应的字母键</span>
          <strong aria-live="polite">{question.keyName}</strong>
          <span>{question.areaLabel}</span>
        </div>

        <div className="practice-answer-hint">
          <span>使用实体键盘输入 A–Y（不包含 Z）</span>
          <kbd>Key · {session?.currentInput || "—"}</kbd>
        </div>

        {answerState === "correct" && (
          <div className="practice-feedback correct" role="status">
            <CheckCircle2 size={20} />
            <div><strong>正确！</strong><span>{question.keyName} 对应 {question.key} 键。</span></div>
          </div>
        )}
        {answerState === "incorrect" && (
          <div className="practice-feedback incorrect" role="status">
            <XCircle size={20} />
            <div><strong>再记一下</strong><span>{question.keyName} 对应的是 {question.key} 键，你按下的是 {lastAnswer || "其他键"}。</span></div>
          </div>
        )}

        {saveError && <p className="practice-error" role="alert">{saveError}</p>}

        {answerState === null ? (
          <p className="practice-instruction">点击练习区域后，直接按键盘字母作答。答题后会立即显示反馈。</p>
        ) : (
          <button className="primary-action practice-next" disabled={isSaving} onClick={nextQuestion} type="button">
            {isSaving ? "正在保存…" : "下一题"}
            <RotateCcw size={15} />
          </button>
        )}
      </section>

      <p className="practice-footnote">
        题目只使用已核验的键名与键位映射。答对 25 个不同键位后，本课标记为已掌握。
      </p>
    </div>
  );
}
