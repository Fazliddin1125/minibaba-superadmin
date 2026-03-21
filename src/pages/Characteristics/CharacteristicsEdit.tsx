import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { create } from "zustand";
import { AlignJustify, Plus, Save, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useCharacteristicsEditStore,
  type MultiLangValue,
} from "../../store/characteristicsStore"
import type { CharType } from "@/store/characteristicsStore";

// Types

interface EditCharStore {
  isSubmitting: boolean;
  setSubmitting: (v: boolean) => void;
}

// Zod schema 
const multiLangValueSchema = z.object({
  uz: z.string().min(1, "UZ majburiy"),
  ru: z.string().min(1, "RU majburiy"),
  en: z.string().min(1, "EN majburiy"),
  kz: z.string().min(1, "KZ majburiy"),
});

const editCharSchema = z.object({
  name: z.object({
    uz: z.string().min(1, "UZ majburiy"),
    ru: z.string().min(1, "RU majburiy"),
    en: z.string().min(1, "EN majburiy"),
    kz: z.string().min(1, "KZ majburiy"),
  }),
  type: z.enum(["select", "text", "number"]),
  values: z.array(multiLangValueSchema).optional(),
});

type EditCharFormValues = z.infer<typeof editCharSchema>;

// Zustand store 
const useEditCharStore = create<EditCharStore>((set) => ({
  isSubmitting: false,
  setSubmitting: (v) => set({ isSubmitting: v }),
}));

// Mock data
const MOCK_CHAR: EditCharFormValues = {
  name: { uz: "Rang", ru: "Цвет", en: "Color", kz: "Түс" },
  type: "select",
  values: [
    { uz: "Qizil", ru: "Красный", en: "Red",  kz: "Қызыл" },
    { uz: "Ko'k",  ru: "Синий",   en: "Blue", kz: "Көк"   },
  ],
};

// Type options
const TYPE_OPTIONS: { value: CharType; label: string }[] = [
  { value: "select", label: "Tanlov (Select)" },
  { value: "text",   label: "Matn (Text)" },
  { value: "number", label: "Raqam (Number)" },
];

// Lang input
interface LangInputProps {
  lang: string;
  placeholder?: string;
  error?: boolean;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}

function LangInput({ lang, placeholder, error, registration }: LangInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--muted-foreground)] select-none uppercase">
        {lang}
      </span>
      <input
        {...registration}
        placeholder={placeholder ?? ""}
        className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all
          ${error
            ? "border-red-400 focus:border-red-400"
            : "border-[var(--border)] focus:border-orange-400"
          }`}
      />
    </div>
  );
}

// Asosiy sahifa ==========================================================================================
export default function EditCharacteristicsPage() {
  const navigate = useNavigate();
  const { selectedChar, clearSelectedChar } = useCharacteristicsEditStore();
  const { isSubmitting, setSubmitting } = useEditCharStore();

  const handleCancel = () => {
    clearSelectedChar();
    navigate("/characteristics");
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EditCharFormValues>({
    resolver: zodResolver(editCharSchema),
    defaultValues: selectedChar ?? MOCK_CHAR,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "values",
  });

  const selectedType = watch("type");
  const showValues = selectedType === "select";

  const onSubmit = async (data: EditCharFormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Updated:", selectedChar?.id, data);
    setSubmitting(false);
    clearSelectedChar();
    navigate("/characteristics");
  };

  const emptyValue: MultiLangValue = { uz: "", ru: "", en: "", kz: "" };

  // Name errors
  const nameErr = errors.name;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen flex flex-col"
    >
      {/* Scrollable content*/}
      <div className="flex-1">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-5 flex-wrap">
          <span
            onClick={() => navigate("/characteristics")}
            className="hover:text-[var(--foreground)] cursor-pointer transition-colors"
          >
            Mahsulotlar
          </span>
          <span>›</span>
          <span
            onClick={handleCancel}
            className="text-orange-500 hover:text-orange-600 cursor-pointer transition-colors sm:text-[var(--muted-foreground)] sm:hover:text-[var(--foreground)] sm:text-inherit"
          >
            Xarakteristika qo'shish
          </span>
        </nav>

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Xarakteristikani tahrirlash
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              Mahsulotlar uchun yangi ko'p tilli atribut yaratish
            </p>
          </div>

          {/* Desktop / Tablet action buttons */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <Save size={15} />
              )}
              {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>

        {/* ── Form card ── */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 md:p-6 shadow-sm">

          {/* Name section */}
          <div className="mb-2">
            <label className="text-sm font-medium text-[var(--foreground)] mb-3 block">
              Xarakteristika nomi (Barcha tillarda){" "}
              <span className="text-red-500">*</span>
            </label>

            {/* Desktop: 2-column grid */}
            <div className="hidden sm:grid grid-cols-2 gap-3">
              <LangInput
                lang="UZ"
                placeholder="Rang"
                error={!!nameErr?.uz}
                registration={register("name.uz")}
              />
              <LangInput
                lang="RU"
                placeholder="Цвет"
                error={!!nameErr?.ru}
                registration={register("name.ru")}
              />
              <LangInput
                lang="EN"
                placeholder="Color"
                error={!!nameErr?.en}
                registration={register("name.en")}
              />
              <LangInput
                lang="KZ"
                placeholder="Түс"
                error={!!nameErr?.kz}
                registration={register("name.kz")}
              />
            </div>

            {/* Mobile: stacked */}
            <div className="sm:hidden space-y-2.5">
              <LangInput
                lang="UZ"
                placeholder="Rang"
                error={!!nameErr?.uz}
                registration={register("name.uz")}
              />
              <LangInput
                lang="RU"
                placeholder="Цвет"
                error={!!nameErr?.ru}
                registration={register("name.ru")}
              />
              <LangInput
                lang="EN"
                placeholder="Color"
                error={!!nameErr?.en}
                registration={register("name.en")}
              />
              <LangInput
                lang="KZ"
                placeholder="Түс"
                error={!!nameErr?.kz}
                registration={register("name.kz")}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border)] my-5" />

          {/* Type select */}
          <div className="mb-6">
            <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
              Turi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("type")}
                className="w-full appearance-none px-3.5 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all cursor-pointer"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border)] mb-5" />

          {/* ── Qiymatlar (Ko'p tilli) ── */}
          {showValues && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlignJustify size={16} className="text-orange-500" />
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  Qiymatlar (Ko'p tilli)
                </h3>
                {/* Mobile count badge */}
                <span className="sm:hidden ml-auto bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {fields.length} ta mavjud
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {fields.map((field, index) => (
                  <ValueItem
                    key={field.id}
                    index={index}
                    register={register}
                    onRemove={() => remove(index)}
                    canRemove={fields.length > 1}
                    errors={errors.values?.[index]}
                  />
                ))}
              </div>

              {/* Add value button */}
              <button
                type="button"
                onClick={() => append(emptyValue)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-orange-400 text-orange-500 hover:bg-orange-50 active:bg-orange-100 transition-colors cursor-pointer"
              >
                <Plus size={15} />
                Qiymat qo'shish
              </button>
            </div>
          )}

          {/* Info block for non-select types */}
          {!showValues && (
            <div className="flex items-start gap-3 p-4 bg-[var(--muted)] rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-[var(--muted-foreground)]">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-0.5">
                  Qiymatlar kerak emas
                </p>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {selectedType === "text"
                    ? "Matn (Text) turi uchun oldindan belgilangan qiymatlar talab qilinmaydi."
                    : "Raqam (Number) turi uchun oldindan belgilangan qiymatlar talab qilinmaydi."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile fixed bottom bar ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--card)] border-t border-[var(--border)] px-4 py-3 flex items-center gap-3 shadow-lg">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-2.5 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors cursor-pointer"
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <Save size={15} />
          )}
          {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>

      {/* Footer */}
      <p className="hidden sm:block text-center text-xs text-[var(--muted-foreground)] py-6">
        © 2024 Minibaba. Barcha huquqlar himoyalangan.
      </p>
    </form>
  );
}

// ─── ValueItem component ──────────────────────────────────────────────────────
interface ValueItemProps {
  index: number;
  register: ReturnType<typeof useForm<EditCharFormValues>>["register"];
  onRemove: () => void;
  canRemove: boolean;
  errors?: {
    uz?: { message?: string };
    ru?: { message?: string };
    en?: { message?: string };
    kz?: { message?: string };
  };
}

function ValueItem({ index, register, onRemove, canRemove, errors }: ValueItemProps) {
  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--background)]">

      {/* Card header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--muted)]/50 border-b border-[var(--border)]">
        {/* Desktop: index circle | Mobile: "QIYMAT N" label */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-semibold select-none border border-[var(--border)]">
            {index + 1}
          </span>
        </div>
        <span className="sm:hidden text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-md tracking-wide">
          QIYMAT {index + 1}
        </span>

        {/* Delete button */}
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          title="O'chirish"
          className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Desktop: 2-column grid inputs */}
      <div className="hidden sm:grid grid-cols-2 divide-x divide-y divide-[var(--border)]">
        <LangSubInput lang="UZ" error={!!errors?.uz} registration={register(`values.${index}.uz`)} />
        <LangSubInput lang="RU" error={!!errors?.ru} registration={register(`values.${index}.ru`)} />
        <LangSubInput lang="EN" error={!!errors?.en} registration={register(`values.${index}.en`)} />
        <LangSubInput lang="KZ" error={!!errors?.kz} registration={register(`values.${index}.kz`)} />
      </div>

      {/* Mobile: 2-column grid inputs */}
      <div className="sm:hidden grid grid-cols-2 divide-x divide-y divide-[var(--border)]">
        <LangSubInput lang="UZ" error={!!errors?.uz} registration={register(`values.${index}.uz`)} />
        <LangSubInput lang="RU" error={!!errors?.ru} registration={register(`values.${index}.ru`)} />
        <LangSubInput lang="EN" error={!!errors?.en} registration={register(`values.${index}.en`)} />
        <LangSubInput lang="KZ" error={!!errors?.kz} registration={register(`values.${index}.kz`)} />
      </div>
    </div>
  );
}

// ─── LangSubInput: used inside value grid cells ───────────────────────────────
interface LangSubInputProps {
  lang: string;
  error?: boolean;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}

function LangSubInput({ lang, error, registration }: LangSubInputProps) {
  return (
    <div className={`flex flex-col px-3 py-2 ${error ? "bg-red-50/40" : ""}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1 select-none">
        {lang}
      </span>
      <input
        {...registration}
        className="text-sm bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none border-b border-transparent focus:border-orange-400 transition-colors pb-0.5"
      />
    </div>
  );
}