import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

/**
 * Scaffolding Material Estimator – v4 (error‑free build)
 * ------------------------------------------------------
 * ▸ 面別【幅 / GL / 軒高】で入力
 * ▸ ジャッキ高さを自動提案（最大 500mm、それ以上は層を+1）
 * ▸ 本足場／一側足場、ピッチ A/B、手すり・落下防止を可変
 * ------------------------------------------------------
 */

// -------------------- 型定義 --------------------
interface SideDims {
  width: string; // mm
  gl: string; // Ground Level mm
  eave: string; // 軒高 mm
}

interface FormState {
  scaffoldType: "本足場" | "一側足場";
  pitchType: "A" | "B"; // A:450/1800, B:475/1900
  outerRailType: "手すり" | "先行手すり";
  innerRailType: "手すり" | "先行手すり";
  outerRailCount: "1" | "2";
  innerRailCount: "1" | "2";
  fallPrevent: "1" | "2" | "3";
  sides: Record<"south" | "east" | "north" | "west", SideDims>;
}

// -----------------  初期値 ----------------------
const blankSide: SideDims = { width: "", gl: "0", eave: "" };
const initState: FormState = {
  scaffoldType: "本足場",
  pitchType: "A",
  outerRailType: "手すり",
  innerRailType: "手すり",
  outerRailCount: "2",
  innerRailCount: "2",
  fallPrevent: "1",
  sides: {
    south: { ...blankSide },
    east: { ...blankSide },
    north: { ...blankSide },
    west: { ...blankSide },
  },
};

// -------------  計算ユーティリティ --------------
const PITCH = {
  A: { pitch: 0.45, layer: 1.8 },
  B: { pitch: 0.475, layer: 1.9 },
} as const;

const num = (v: string) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));

function jackHeight(gl: number, eave: number, layerMm: number) {
  if (eave <= gl) return 0;
  const diff = eave - gl; // mm
  const remainder = diff % layerMm;
  if (remainder === 0) return 0;
  if (remainder <= 500) return remainder;
  // remainder >500 → add one layer, jack = remainder - layer
  return remainder - layerMm;
}

function calc(form: FormState) {
  const { pitch, layer } = PITCH[form.pitchType];
  const layerMm = layer * 1000; // mm

  // 周長 m
  const perimeterMm =
    num(form.sides.south.width) +
    num(form.sides.east.width) +
    num(form.sides.north.width) +
    num(form.sides.west.width);
  const perimeter = perimeterMm / 1000;

  // 高さ（各面） mm
  const heightsMm = (Object.values(form.sides) as SideDims[]).map((s) =>
    Math.max(0, num(s.eave) - num(s.gl))
  );
  const maxHeight = Math.max(...heightsMm) / 1000; // m

  const steps = Math.max(1, Math.ceil(maxHeight / layer));
  const column = form.scaffoldType === "本足場" ? 2 : 1;
  const baseCount = Math.ceil(perimeter / pitch); // 支柱ピッチ数

  // 支柱（Posts）
  const posts = baseCount * column + 2 * column; // 両端追加

  // 手すり
  const outerCoef = form.outerRailType === "先行手すり" ? 1 : parseInt(form.outerRailCount);
  const innerCoef = form.innerRailType === "先行手すり" ? 1 : parseInt(form.innerRailCount);
  const railsPerLayer = baseCount;
  const outerRails = railsPerLayer * steps * outerCoef;
  const innerRails = column === 2 ? railsPerLayer * steps * innerCoef : 0;

  // 落下防止（中さん）
  const fallBars = railsPerLayer * steps * parseInt(form.fallPrevent);

  // ジャッキ高さ mm（面別）
  const jack = {
    south: jackHeight(num(form.sides.south.gl), num(form.sides.south.eave), layerMm),
    east: jackHeight(num(form.sides.east.gl), num(form.sides.east.eave), layerMm),
    north: jackHeight(num(form.sides.north.gl), num(form.sides.north.eave), layerMm),
    west: jackHeight(num(form.sides.west.gl), num(form.sides.west.eave), layerMm),
  } as const;

  return { posts, outerRails, innerRails, fallBars, jack, steps };
}

// ----------------  コンポーネント ---------------
export default function ScaffoldEstimator() {
  const [form, setForm] = useState<FormState>(initState);
  const result = useMemo(() => calc(form), [form]);

  // 値更新ヘルパ
  const update = (path: string, value: string) => {
    setForm((prev) => {
      const copy: any = structuredClone(prev);
      const keys = path.split(".");
      let obj = copy;
      keys.slice(0, -1).forEach((k) => (obj = obj[k]));
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  // 面入力カード
  const sideInput = (label: string, key: keyof typeof form.sides) => (
    <Card>
      <CardContent className="p-3 flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <Input
          placeholder="幅 (mm)"
          value={form.sides[key].width}
          onChange={(e) => update(`sides.${key}.width`, e.target.value)}
          className="text-gray-900"
        />
        <Input
          placeholder="GL (mm)"
          value={form.sides[key].gl}
          onChange={(e) => update(`sides.${key}.gl`, e.target.value)}
          className="text-gray-900"
        />
        <Input
          placeholder="2階軒高 (mm)"
          value={form.sides[key].eave}
          onChange={(e) => update(`sides.${key}.eave`, e.target.value)}
          className="text-gray-900"
        />
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid md:grid-cols-2 gap-6 p-6"
    >
      {/* ---------------- 左：入力フォーム ---------------- */}
      <div className="flex flex-col gap-6">
        {/* 足場形式 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-900">足場形式</label>
          <Select value={form.scaffoldType} onValueChange={(v) => update("scaffoldType", v)}>
            <SelectTrigger className="text-gray-900">
              <SelectValue placeholder="選択" className="text-gray-900" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="本足場">本足場</SelectItem>
              <SelectItem value="一側足場">一側足場</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ピッチ規格 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-900">ピッチ規格</label>
          <Select value={form.pitchType} onValueChange={(v) => update("pitchType", v)}>
            <SelectTrigger className="text-gray-900">
              <SelectValue placeholder="選択" className="text-gray-900" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A規格 450/1,800</SelectItem>
              <SelectItem value="B">B規格 475/1,900</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 手すり設定 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Outer */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">外側手すり</label>
            <Select value={form.outerRailType} onValueChange={(v) => update("outerRailType", v)}>
              <SelectTrigger className="text-gray-900">
                <SelectValue placeholder="種類" className="text-gray-900" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="手すり">手すり (T-3.6)</SelectItem>
                <SelectItem value="先行手すり">先行手すり</SelectItem>
              </SelectContent>
            </Select>
            {form.outerRailType === "手すり" && (
              <Select value={form.outerRailCount} onValueChange={(v) => update("outerRailCount", v)}>
                <SelectTrigger className="mt-1 text-gray-900">
                  <SelectValue placeholder="本数" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 本</SelectItem>
                  <SelectItem value="2">2 本</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          {/* Inner */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-900">内側手すり</label>
            <Select value={form.innerRailType} onValueChange={(v) => update("innerRailType", v)}>
              <SelectTrigger className="text-gray-900">
                <SelectValue placeholder="種類" className="text-gray-900" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="手すり">手すり (T-3.6)</SelectItem>
                <SelectItem value="先行手すり">先行手すり</SelectItem>
              </SelectContent>
            </Select>
            {form.innerRailType === "手すり" && (
              <Select value={form.innerRailCount} onValueChange={(v) => update("innerRailCount", v)}>
                <SelectTrigger className="mt-1 text-gray-900">
                  <SelectValue placeholder="本数" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 本</SelectItem>
                  <SelectItem value="2">2 本</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* 落下防止 */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-900">落下防止（中さん）</label>
          <Select value={form.fallPrevent} onValueChange={(v) => update("fallPrevent", v)}>
            <SelectTrigger className="text-gray-900">
              <SelectValue placeholder="本数" className="text-gray-900" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 本</SelectItem>
              <SelectItem value="2">2 本</SelectItem>
              <SelectItem value="3">3 本</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 面別入力カード */}
        <div className="grid grid-cols-2 gap-3">
          {sideInput("南面", "south")}
          {sideInput("東面", "east")}
          {sideInput("北面", "north")}
          {sideInput("西面", "west")}
        </div>

        <Button variant="secondary" onClick={() => setForm(initState)} className="self-start">
          リセット
        </Button>
      </div>

      {/* ---------------- 右：結果テーブル ---------------- */}
      <div className="overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">材料数量</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900">部材</TableHead>
              <TableHead className="text-gray-900">数量</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-gray-900">支柱</TableCell>
              <TableCell className="text-gray-900">{result.posts}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-900">外側手すり</TableCell>
              <TableCell className="text-gray-900">{result.outerRails}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-900">内側手すり</TableCell>
              <TableCell className="text-gray-900">{result.innerRails}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-900">落下防止材</TableCell>
              <TableCell className="text-gray-900">{result.fallBars}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-900">ジャッキ高さ (mm)</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900">面</TableHead>
              <TableHead className="text-gray-900">推奨ジャッキ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-gray-900">南</TableCell>
              <TableCell className="text-gray-900">{result.jack.south}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-900">東</TableCell>
              <TableCell className="text-gray-900">{result.jack.east}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-900">北</TableCell>
              <TableCell className="text-gray-900">{result.jack.north}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-gray-900">西</TableCell>
              <TableCell className="text-gray-900">{result.jack.west}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
