import {
  BarChart3,
  BookOpen,
  Home,
  Keyboard as KeyboardIcon,
  Library,
  Settings2,
} from "lucide-react";
import { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Keyboard } from "./components/Keyboard";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { PracticePage } from "./pages/PracticePage";

const navigation = [
  { label: "学习首页", icon: Home, to: "/", end: true },
  { label: "课程学习", icon: BookOpen, to: "/lessons" },
  { label: "专项练习", icon: KeyboardIcon, to: "/practice" },
  { label: "错题复习", icon: Library, to: "/mistakes" },
  { label: "学习报告", icon: BarChart3, to: "/statistics" },
];

const pageNames: Record<string, string> = {
  "/": "学习首页",
  "/lessons": "课程学习",
  "/practice": "专项练习",
  "/mistakes": "错题复习",
  "/statistics": "学习报告",
  "/settings": "设置",
};

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleGlobalShortcut(event: globalThis.KeyboardEvent) {
      const target = event.target;
      const isEditing = target instanceof HTMLElement &&
        (target.isContentEditable || target.closest("input, textarea, select, [contenteditable='true'], [role='textbox']"));
      if (isEditing || event.isComposing || event.repeat || !event.ctrlKey || !event.shiftKey || event.altKey || event.metaKey) {
        return;
      }
      const routes: Record<string, string> = {
        Digit1: "/", Digit2: "/lessons", Digit3: "/practice",
        Digit4: "/mistakes", Digit5: "/statistics", Digit6: "/settings",
      };
      const route = routes[event.code];
      if (!route) return;
      event.preventDefault();
      navigate(route);
    }
    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, [navigate]);
  const currentPage = pageNames[location.pathname] ?? "页面不存在";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="五笔学习首页">
          <span className="brand-mark">五</span>
          <span><strong>五笔学习</strong><small>WUBI LEARNING</small></span>
        </Link>
        <div className="sidebar-label">学习空间</div>
        <nav className="main-nav" aria-label="主导航">
          {navigation.map(({ label, icon: Icon, to, end }) => (
            <NavLink
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              end={end}
              key={to}
              to={to}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/settings"
          >
            <Settings2 size={18} /><span>设置</span>
          </NavLink>
          <div className="shortcut-help" aria-label="全局快捷键">
            <strong>键盘快捷键</strong>
            <span><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>1–6</kbd></span>
            <small>切换首页、课程、练习、错题、报告、设置</small>
          </div>
          <div className="version-label">五笔 86 版 · MVP</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">{currentPage}</div>
          <div className="version-pill"><i />86 版</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

function DashboardPage() {
  return (
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
          <div className="info-note">提示：点击键位，可以查看对应键名。完整字根表将在核验后逐步加入。</div>
        </aside>
      </div>
      <footer className="page-footer">知识数据版本：86 · 当前为键位认知原型</footer>
    </div>
  );
}

function NotFoundPage() {
  return (
    <PlaceholderPage
      eyebrow="404"
      title="页面不存在"
      description="这个页面地址无效。你可以返回学习首页继续学习。"
      action={<Link className="primary-action" to="/">返回学习首页</Link>}
    />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="lessons"
            element={
              <PlaceholderPage
                eyebrow="学习路径"
                title="课程学习"
                description="课程目录和课程内容将在下一步建立。目前先完成应用基础设施。"
              />
            }
          />
          <Route path="practice" element={<PracticePage />} />
          <Route
            path="mistakes"
            element={
              <PlaceholderPage
                eyebrow="复习巩固"
                title="错题复习"
                description="错题记录与复习功能尚未接入本地学习数据库。"
              />
            }
          />
          <Route
            path="statistics"
            element={
              <PlaceholderPage
                eyebrow="学习反馈"
                title="学习报告"
                description="学习时长、正确率和掌握情况将在学习记录模块完成后展示。"
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                eyebrow="应用设置"
                title="设置"
                description="数据备份、恢复和学习偏好设置将在后续实现。"
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
