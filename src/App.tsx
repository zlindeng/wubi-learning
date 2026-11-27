import { BookOpen, ChartNoAxesColumn, Home, Keyboard as KeyboardIcon, Library, Settings2 } from "lucide-react";
import { Keyboard } from "./components/Keyboard";

const navigation = [
  { label: "学习首页", icon: Home, active: true },
  { label: "课程学习", icon: BookOpen, active: false },
  { label: "专项练习", icon: KeyboardIcon, active: false },
  { label: "错题复习", icon: Library, active: false },
  { label: "学习报告", icon: ChartNoAxesColumn, active: false },
];

export function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="五笔学习首页">
          <span className="brand-mark">五</span>
          <span><strong>五笔学习</strong><small>WUBI LEARNING</small></span>
        </a>
        <div className="sidebar-label">学习空间</div>
        <nav className="main-nav" aria-label="主导航">
          {navigation.map(({ label, icon: Icon, active }) => (
            <a className={`nav-item ${active ? "active" : ""}`} href="#" key={label}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-item" href="#"><Settings2 size={18} /><span>设置</span></a>
          <div className="version-label">五笔 86 版 · MVP</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">学习首页 <span>/</span> 键盘认知</div>
          <div className="version-pill"><i />86 版</div>
        </header>

        <div className="page-content">
          <section className="welcome-section">
            <div>
              <div className="eyebrow">从理解到熟练 · 一步一步来</div>
              <h1>认识五笔键盘</h1>
              <p>先认识五个分区和 25 个字根键。掌握键位，是学习五笔的第一步。</p>
            </div>
            <div className="welcome-symbol" aria-hidden="true">键</div>
          </section>

          <div className="content-grid">
            <section className="primary-card">
              <div className="section-heading">
                <div>
                  <span className="step-label">第一步 · 键盘认知</span>
                  <h2>86 版键盘布局</h2>
                </div>
                <span className="verified-tag">键位骨架已核验</span>
              </div>
              <Keyboard />
            </section>

            <aside className="side-card">
              <div className="side-card-icon"><BookOpen size={20} /></div>
              <span className="step-label">学习提示</span>
              <h2>先记住五个区</h2>
              <p>五笔把字根分布在五个区域。每个区域对应一种基本笔画。</p>
              <ul className="area-list">
                <li><b>一</b><span>横区</span><small>G F D S A</small></li>
                <li><b>丨</b><span>竖区</span><small>H J K L M</small></li>
                <li><b>丿</b><span>撇区</span><small>T R E W Q</small></li>
                <li><b>丶</b><span>点捺区</span><small>Y U I O P</small></li>
                <li><b>乙</b><span>折区</span><small>N B V C X</small></li>
              </ul>
              <div className="info-note">提示：点击左侧键位，可以查看对应键名。完整字根表将在核验后逐步加入。</div>
            </aside>
          </div>
          <footer className="page-footer">知识数据版本：86 · 当前为键位认知原型</footer>
        </div>
      </main>
    </div>
  );
}
