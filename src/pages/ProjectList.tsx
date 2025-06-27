import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Project } from "./types";

// 案件一覧を表示するページ

export default function ProjectList({
  projects,
  onSelect,
  onNew,
}: {
  projects: Project[];
  onSelect: (id: number) => void;
  onNew: () => void;
}) {
  return (
    <div className="p-4 relative">
      <div className="flex flex-col gap-4">
        {/* 案件リスト */}
        {projects.map((p) => (
          <Card
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="p-4 cursor-pointer hover:bg-gray-50"
          >
            <CardContent className="p-0 flex flex-col gap-1">
              <span className="font-semibold text-gray-900">{p.title}</span>
              <span className="text-sm text-gray-500 line-clamp-1">
                {p.detail}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* 新規作成ボタン */}
      <Button
        onClick={onNew}
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0"
      >
        <Plus />
      </Button>
    </div>
  );
}
