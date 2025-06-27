import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EstimatorForm, { FormState, initFormState, calc } from "@/components/EstimatorForm";
import type { Project } from "./types";

// 案件の新規作成・編集を行う画面コンポーネント

export default function ProjectEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  // タイトルと詳細の入力値
  const [title, setTitle] = useState(initial?.title || "");
  const [detail, setDetail] = useState(initial?.detail || "");
  // EstimatorForm で使用するフォーム状態
  const [form, setForm] = useState<FormState>(initial?.form || initFormState);

  // 保存ボタンを押したときの処理
  const handleSave = () => {
    const result = calc(form);
    onSave({
      id: initial?.id || Date.now(),
      createdAt: initial?.createdAt || Date.now(),
      title,
      detail,
      form,
      result,
    });
  };

  // 画面レイアウト
  return (
    <div className="p-4 flex flex-col gap-4">
      <Input
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-gray-900"
      />
      <Input
        placeholder="案件詳細"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        className="text-gray-900"
      />
      {/* 数量計算フォーム */}
      <EstimatorForm form={form} onChange={setForm} />
      <div className="flex gap-2">
        {/* 保存・キャンセルボタン */}
        <Button onClick={handleSave}>保存</Button>
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </div>
  );
}
