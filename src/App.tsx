import { useState } from "react";
import ProjectList from "./pages/ProjectList";
import ProjectEditor from "./pages/ProjectEditor";
import MyPage from "./pages/MyPage";
import type { Project } from "./pages/types";

// アプリ全体のタブナビゲーションを管理するコンポーネント

export default function App() {
  // 表示中のタブ。案件一覧かマイページかを保持
  const [tab, setTab] = useState<"list" | "mypage">("list");
  // 作成済みの案件を保持（インメモリ）
  const [projects, setProjects] = useState<Project[]>([]);
  // 編集対象の案件
  const [editing, setEditing] = useState<Project | null>(null);
  // 案件一覧画面か編集画面かを切り替える
  const [mode, setMode] = useState<"list" | "editor">("list");

  // 案件保存時の処理。既存データを更新して一覧に戻る
  const handleSave = (p: Project) => {
    setProjects((prev) => {
      const others = prev.filter((o) => o.id !== p.id);
      return [p, ...others].sort((a, b) => b.createdAt - a.createdAt);
    });
    setMode("list");
    setEditing(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* タブ切り替えメニュー */}
      <nav className="flex border-b">
        <button
          className={`flex-1 p-2 ${tab === "list" ? "border-b-2" : ""}`}
          onClick={() => setTab("list")}
        >
          案件一覧
        </button>
        <button
          className={`flex-1 p-2 ${tab === "mypage" ? "border-b-2" : ""}`}
          onClick={() => setTab("mypage")}
        >
          マイページ
        </button>
      </nav>
      <div className="flex-1 overflow-auto">
        {/* 案件一覧表示 */}
        {tab === "list" && mode === "list" && (
          <ProjectList
            projects={projects}
            onSelect={(id) => {
              const p = projects.find((pr) => pr.id === id) || null;
              setEditing(p);
              setMode("editor");
            }}
            onNew={() => {
              setEditing(null);
              setMode("editor");
            }}
          />
        )}
        {/* 案件作成・編集画面 */}
        {tab === "list" && mode === "editor" && (
          <ProjectEditor
            initial={editing || undefined}
            onSave={handleSave}
            onCancel={() => setMode("list")}
          />
        )}
        {/* マイページ（現在はダミー） */}
        {tab === "mypage" && <MyPage />}
      </div>
    </div>
  );
}
