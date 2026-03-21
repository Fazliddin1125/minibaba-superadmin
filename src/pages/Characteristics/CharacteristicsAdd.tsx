import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { create } from "zustand";
import { AlignJustify, Plus, Save, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types
type CharType = "select" | "text" | "number";

interface AddCharStore {
  isSubmitting: boolean;
  setSubmitting: (v: boolean) => void;
}

// Zod schema 
const valueItemSchema = z.object({
  value: z.string().min(1, "Qiymat bo'sh bo'lishi mumkin emas"),
});

const addCharSchema = z.object({
  name: z
    .string()
    .min(1, "Xarakteristika nomi majburiy")
    .max(100, "Maksimal 100 ta belgi"),
  type: z.enum(["select", "text", "number"]),
  values: z.array(valueItemSchema).optional(),
});

type AddCharFormValues = z.infer<typeof addCharSchema>;

// Zustand store
const useAddCharStore = create<AddCharStore>((set) => ({
  isSubmitting: false,
  setSubmitting: (v) => set({ isSubmitting: v }),
}));

// Type options
const TYPE_OPTIONS: { value: CharType; label: string }[] = [
  { value: "select", label: "Tanlov (Select)" },
  { value: "text",   label: "Matn (Text)" },
  { value: "number", label: "Raqam (Number)" },
];

// Asosiy component =========================================================================================
export default function AddCharacteristicsPage() {
  const navigate = useNavigate();
  const { isSubmitting, setSubmitting } = useAddCharStore();

  const handleCancel = () => navigate("/characteristics");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AddCharFormValues>({
    resolver: zodResolver(addCharSchema),
    defaultValues: {
      name: "",
      type: "select",
      values: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "values",
  });

  const selectedType = watch("type");
  const showValues = selectedType === "select";

  const onSubmit = async (data: AddCharFormValues) => {
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Submitted:", data);
    setSubmitting(false);
    navigate("/characteristics");
  };

  const formCard = (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 md:p-6 shadow-sm">
      {/* Name + Type row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Xarakteristika nomi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Xarakteristika nomi{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="Masalan: Rang, O'lcham"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all
              ${errors.name
                ? "border-red-400 focus:border-red-400"
                : "border-[var(--border)] focus:border-orange-400"
              }`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>
          )}
        </div>

        {/* Turi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Turi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("type")}
              className={`w-full appearance-none px-3.5 py-2.5 text-sm rounded-lg border bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all cursor-pointer
                ${errors.type
                  ? "border-red-400 focus:border-red-400"
                  : "border-[var(--border)] focus:border-orange-400"
                }`}
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
          {errors.type && (
            <p className="text-xs text-red-500 mt-0.5">{errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--border)] mb-5" />

      {/* Qiymatlar section — only for "select" type */}
      {showValues && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlignJustify size={16} className="text-orange-500" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              Qiymatlar
            </h3>
            {/* Mobile-only count badge */}
            <span className="sm:hidden ml-auto bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {fields.length} ta qiymat
            </span>
          </div>

          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl overflow-hidden mb-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 px-3 py-0.5 border-b border-[var(--border)] last:border-0 group hover:bg-[var(--accent)] transition-colors"
              >
                {/* Index number */}
                <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-semibold select-none">
                  {index + 1}
                </span>

                {/* Input */}
                <input
                  {...register(`values.${index}.value`)}
                  placeholder={`${index + 1}-qiymat`}
                  className="flex-1 py-3 text-sm bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
                />

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  title="O'chirish"
                  className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {/* Validation errors for values */}
            {errors.values && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100">
                <p className="text-xs text-red-500">
                  Barcha qiymatlarni to'ldiring
                </p>
              </div>
            )}
          </div>

          {/* Add value button */}
          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-orange-400 text-orange-500 hover:bg-orange-50 active:bg-orange-100 transition-colors cursor-pointer"
          >
            <Plus size={15} />
            Qiymat qo'shish
          </button>
        </div>
      )}

      {/* Info text when type is not select */}
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
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen flex flex-col"
    >
      {/* Scrollable content*/}
      <div className="flex-1">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-5">
          <span className="hover:text-[var(--foreground)] cursor-pointer transition-colors">
            Mahsulotlar
          </span>
          <span>›</span>
          <span className="text-[var(--foreground)] font-medium">
            Xarakteristika qo'shish
          </span>
        </nav>

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Yangi xarakteristika
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              Mahsulotlar uchun yangi atribut yaratish
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

        {/* Form card */}
        {formCard}
      </div>

      {/* Mobile buttons*/}
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