import type { FormState } from "@/components/EstimatorForm";
// calc の戻り値型を利用するためのインポート
import type { calc } from "@/components/EstimatorForm";

// 案件データの型定義
export interface Project {
  id: number;
  createdAt: number;
  title: string;
  detail: string;
  form: FormState;
  result: ReturnType<typeof calc>;
}
