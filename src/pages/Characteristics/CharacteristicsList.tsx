import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { create } from "zustand";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCharacteristicsEditStore } from "@/store/characteristicsStore";

// Types 
type CharType = "select" | "text" | "number";

interface Characteristic {
  id: number;
  name: string;
  type: CharType;
  valuesCount: number | null;
  categories: string;
  date: string;
}

interface CharacteristicsStore {
  characteristics: Characteristic[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  searchQuery: string;
  setPage: (page: number) => void;
  setSearch: (query: string) => void;
  deleteItem: (id: number) => void;
}

interface DeleteTarget {
  id: number;
  name: string;
}

// Zod schema
const searchSchema = z.object({
  query: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

// Mock data 
const MOCK_DATA: Characteristic[] = [
  { id: 1, name: "Rang",      type: "select", valuesCount: 12,  categories: "8 ta kategoriya",  date: "12 Okt, 2024" },
  { id: 2, name: "O'lcham",   type: "select", valuesCount: 8,   categories: "14 ta kategoriya", date: "10 Okt, 2024" },
  { id: 3, name: "Material",  type: "text",   valuesCount: null, categories: "24 ta kategoriya", date: "08 Okt, 2024" },
  { id: 4, name: "Og'irligi", type: "number", valuesCount: null, categories: "45 ta kategoriya", date: "05 Okt, 2024" },
  { id: 5, name: "Brend",     type: "select", valuesCount: 156, categories: "Barchasi",          date: "01 Okt, 2024" },
];

// Zustand store 
const useStore = create<CharacteristicsStore>((set) => ({
  characteristics: MOCK_DATA,
  currentPage: 1,
  totalItems: 24,
  totalPages: 5,
  searchQuery: "",

  setPage:    (page)  => set({ currentPage: page }),
  setSearch:  (query) => set({ searchQuery: query, currentPage: 1 }),
  deleteItem: (id)    => set((s) => ({
    characteristics: s.characteristics.filter((c) => c.id !== id),
  })),
}));

// Type badge config
const TYPE_CONFIG: Record<CharType, { label: string; className: string }> = {
  select: {
    label: "Select (Tanlov)",
    className: "bg-purple-100 text-purple-700 border border-purple-200",
  },
  text: {
    label: "Matn (Text)",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  number: {
    label: "Raqam (Number)",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
};

// TypeBadge 
function TypeBadge({ type }: { type: CharType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// Pagination 
function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "…", total];
  if (current >= total - 2) return [1, "…", total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

interface PagBtnProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

function PagBtn({ children, active, disabled, onClick, ...props }: PagBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
        ${active
          ? "bg-orange-500 text-white shadow-sm"
          : disabled
          ? "border border-[var(--border)] text-[var(--muted-foreground)] opacity-40 cursor-not-allowed"
          : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] cursor-pointer"
        }`}
      {...props}
    >
      {children}
    </button>
  );
}

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

function Pagination({ current, total, onChange }: PaginationProps) {
  const pages = buildPages(current, total);

  return (
    <div className="flex items-center gap-1">
      <PagBtn
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        aria-label="Oldingi"
      >
        <ChevronLeft size={14} />
      </PagBtn>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="w-8 h-8 flex items-center justify-center text-sm text-[var(--muted-foreground)] select-none"
          >
            …
          </span>
        ) : (
          <PagBtn
            key={p}
            onClick={() => onChange(p as number)}
            active={current === p}
          >
            {p}
          </PagBtn>
        )
      )}

      <PagBtn
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        aria-label="Keyingi"
      >
        <ChevronRight size={14} />
      </PagBtn>
    </div>
  );
}

// MetaCell 
function MetaCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-0.5">
        {label}
      </p>
      <p className="text-sm text-[var(--foreground)]">{children}</p>
    </div>
  );
}

// Delete Modal 
interface DeleteModalProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({ name, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
    >
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            O'chirishni tasdiqlang
          </h3>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] mb-6 pl-[52px]">
          <span className="font-medium text-[var(--foreground)]">"{name}"</span>{" "}
          xarakteristikasini o'chirishni xohlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 active:bg-red-700 transition-colors cursor-pointer"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

// Asosiy sahifa =================================================================================== 
export default function CharacteristicsPage() {
  const navigate = useNavigate();
  const { setSelectedChar } = useCharacteristicsEditStore();
  const {
    characteristics,
    currentPage,
    totalItems,
    totalPages,
    searchQuery,
    setPage,
    setSearch,
    deleteItem,
  } = useStore();

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const { register } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  const filtered = characteristics.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => navigate("/characteristics/add");

  const handleEdit = (id: number) => {
    const found = characteristics.find((c) => c.id === id);
    if (!found) return;
    setSelectedChar({
      id: found.id,
      name: { uz: found.name, ru: "", en: "", kz: "" },
      type: found.type,
      values: [],
    });
    navigate("/characteristics/edit");
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteItem(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-5">
        <span className="hover:text-[var(--foreground)] cursor-pointer transition-colors">
          Boshqaruv
        </span>
        <span>›</span>
        <span className="text-[var(--foreground)] font-medium">Mahsulotlar</span>
      </nav>

      {/* Header row */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Xarakteristikalar
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Barcha xarakteristikalarni boshqarish va tahrirlash
          </p>
        </div>

        <div className="flex gap-2 sm:items-center">
          {/* Search — desktop only */}
          <div className="hidden sm:flex relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
            />
            <input
              {...register("query")}
              onChange={(e) => setSearch(e.target.value)}
              value={searchQuery}
              placeholder="Nom bo'yicha qidirish..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 w-56 transition-all"
            />
          </div>

          <button onClick={handleAdd} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap cursor-pointer">
            <Plus size={16} />
            <span>Yangi xarakteristika</span>
          </button>
        </div>
      </div>

      {/* Search — mobile only */}
      <div className="sm:hidden relative mb-4">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
        />
        <input
          {...register("query")}
          onChange={(e) => setSearch(e.target.value)}
          value={searchQuery}
          placeholder="Nom bo'yicha qidirish..."
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all"
        />
      </div>

      {/* ── Desktop / Tablet table ── */}
      <div className="hidden sm:block bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
                {["NOMI", "TURI", "QIYMATLAR SONI", "KATEGORIYALAR", "SANA", "AMALLAR"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-semibold text-[var(--muted-foreground)] tracking-widest uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-[var(--muted-foreground)]">
                    Hech qanday natija topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors group"
                  >
                    <td className="px-5 py-4 font-medium text-[var(--foreground)] text-sm">
                      {item.name}
                    </td>
                    <td className="px-5 py-4">
                      <TypeBadge type={item.type} />
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                      {item.valuesCount != null ? `${item.valuesCount} ta` : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                      {item.categories}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--foreground)] whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Tahrirlash"
                          onClick={() => handleEdit(item.id)}
                          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          title="O'chirish"
                          onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--muted)]/20">
          <p className="text-sm text-[var(--muted-foreground)]">
            Jami{" "}
            <span className="font-semibold text-[var(--foreground)]">{totalItems}</span>{" "}
            tadan{" "}
            <span className="font-semibold text-[var(--foreground)]">1-{filtered.length}</span>{" "}
            ko'rsatilmoqda
          </p>
          <Pagination current={currentPage} total={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* ── Mobile cards ── */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--muted-foreground)]">
            Hech qanday natija topilmadi
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="font-semibold text-[var(--foreground)] text-base">
                  {item.name}
                </span>
                <TypeBadge type={item.type} />
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-3">
                <MetaCell label="Qiymatlar soni">
                  {item.valuesCount != null ? `${item.valuesCount} ta` : "—"}
                </MetaCell>
                <MetaCell label="Kategoriyalar">{item.categories}</MetaCell>
                <MetaCell label="Sana">{item.date}</MetaCell>
              </div>

              <div className="flex items-center justify-end gap-1 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Pencil size={13} />
                  Tahrirlash
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  O'chirish
                </button>
              </div>
            </div>
          ))
        )}

        <div className="pt-2 flex flex-col items-center gap-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            Jami{" "}
            <span className="font-semibold text-[var(--foreground)]">{totalItems}</span>{" "}
            tadan{" "}
            <span className="font-semibold text-[var(--foreground)]">1-{filtered.length}</span>{" "}
            ko'rsatilmoqda
          </p>
          <Pagination current={currentPage} total={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-10 text-center text-xs text-[var(--muted-foreground)]">
        © 2024 Minibaba. Barcha huquqlar himoyalangan.
      </p>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}