import type { ReactNode } from "react";

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  action,
}: PlaceholderPageProps) {
  return (
    <div className="page-content">
      <section className="placeholder-card">
        <div className="placeholder-icon" aria-hidden="true">⌘</div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        {action}
        <span className="placeholder-status">功能建设中 · 不包含模拟教学数据</span>
      </section>
    </div>
  );
}
