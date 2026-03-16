import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, X, Save, Globe } from "lucide-react";

// ===== TYPES =====
interface Language {
  id: string;
  code: string;
  name: string;
  script: string;
  flag: string;
  isDefault: boolean;
  isActive: boolean;
}

// ===== MOCK DATA =====
const initialLanguages: Language[] = [
  { id: "1", code: "UZ", name: "O'zbekcha", script: "Latin", flag: "🇺🇿", isDefault: true,  isActive: true  },
  { id: "2", code: "RU", name: "Русский",   script: "Kiril", flag: "🇷🇺", isDefault: false, isActive: true  },
  { id: "3", code: "EN", name: "English",   script: "Latin", flag: "🇬🇧", isDefault: false, isActive: true  },
  { id: "4", code: "KZ", name: "Qazaqsha",  script: "Kiril", flag: "🇰🇿", isDefault: false, isActive: false },
];

const countryOptions = [
  { value: "uz", label: "Uzbekistan",   flag: "🇺🇿" },
  { value: "ru", label: "Russia",       flag: "🇷🇺" },
  { value: "en", label: "United Kingdom", flag: "🇬🇧" },
  { value: "kz", label: "Kazakhstan",   flag: "🇰🇿" },
  { value: "tr", label: "Turkey",       flag: "🇹🇷" },
  { value: "cn", label: "China",        flag: "🇨🇳" },
  { value: "de", label: "Germany",      flag: "🇩🇪" },
  { value: "fr", label: "France",       flag: "🇫🇷" },
];

// ===== ZOD SCHEMA =====
const langSchema = z.object({
  name:      z.string().min(1, "Til nomini kiriting"),
  code:      z.string().min(1, "Til kodini kiriting").max(5),
  country:   z.string().min(1, "Bayroq belgisini tanlang"),
  isDefault: z.boolean(),
  isActive:  z.boolean(),
});

type LangForm = z.infer<typeof langSchema>;

// ===== BACKDROP =====
function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ===== TOGGLE =====
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        value ? "bg-[#F97316]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ===== LANG MODAL =====
function LangModal({
  editLang,
  onClose,
  onSave,
}: {
  editLang: Language | null;
  onClose: () => void;
  onSave: (data: LangForm, id?: string) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LangForm>({
    resolver: zodResolver(langSchema),
    defaultValues: {
      name:      editLang?.name      ?? "",
      code:      editLang?.code      ?? "",
      country:   editLang?.code.toLowerCase() ?? "",
      isDefault: editLang?.isDefault ?? false,
      isActive:  editLang?.isActive  ?? true,
    },
  });

  const isDefault = watch("isDefault");
  const isActive  = watch("isActive");
  const country   = watch("country");

  const selectedCountry = countryOptions.find((c) => c.value === country);

  const onSubmit = (data: LangForm) => {
    onSave(data, editLang?.id);
    onClose();
  };

  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {editLang ? "Til qo'shish / Tahrirlash" : "Yangi til qo'shish"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-5">
          {/* Til nomi + Til kodi */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Til nomi</label>
              <input
                {...register("name")}
                placeholder="O'zbekcha"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100 transition-all placeholder-gray-300"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div className="w-28">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Til kodi</label>
              <input
                {...register("code")}
                placeholder="uz"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100 transition-all placeholder-gray-300 uppercase"
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
            </div>
          </div>

          {/* Bayroq belgisi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bayroq belgisi</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                {selectedCountry?.flag ?? "🌐"}
              </div>
              <select
                {...register("country")}
                className="w-full appearance-none border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
              >
                <option value="">Tanlang</option>
                {countryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.flag} {c.label}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3">
            {/* Asosiy til */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-800">Asosiy til</p>
                <p className="text-xs text-gray-400 mt-0.5">Tizimda standart til sifatida o'rnatish</p>
              </div>
              <Toggle value={isDefault} onChange={(v) => setValue("isDefault", v)} />
            </div>

            {/* Faol */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-800">Faol</p>
                <p className="text-xs text-gray-400 mt-0.5">Saytda foydalanuvchilarga ko'rsatish</p>
              </div>
              <Toggle value={isActive} onChange={(v) => setValue("isActive", v)} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6c0c] text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-orange-100"
            >
              <Save className="w-4 h-4" />
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </Backdrop>
  );
}

// ===== DELETE CONFIRM MODAL =====
function DeleteModal({ lang, onClose, onConfirm }: { lang: Language; onClose: () => void; onConfirm: () => void }) {
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Tilni o'chirish</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex gap-3 items-start">
            <span className="text-red-400 text-lg mt-0.5">⚠️</span>
            <p className="text-sm text-red-600 leading-relaxed">
              <span className="font-semibold">{lang.name}</span> tilini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              Bekor qilish
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-red-100"
            >
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ===== MAIN PAGE =====
export default function LanguagesPage() {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);

  const handleSave = (data: LangForm, id?: string) => {
    const countryOpt = countryOptions.find((c) => c.value === data.country);
    if (id) {
      setLanguages((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, name: data.name, code: data.code.toUpperCase(), flag: countryOpt?.flag ?? "🌐", isDefault: data.isDefault, isActive: data.isActive }
            : data.isDefault ? { ...l, isDefault: false } : l
        )
      );
    } else {
      const newLang: Language = {
        id: Date.now().toString(),
        name: data.name,
        code: data.code.toUpperCase(),
        script: "Latin",
        flag: countryOpt?.flag ?? "🌐",
        isDefault: data.isDefault,
        isActive: data.isActive,
      };
      setLanguages((prev) => {
        const updated = data.isDefault ? prev.map((l) => ({ ...l, isDefault: false })) : prev;
        return [...updated, newLang];
      });
    }
  };

  const handleDelete = () => {
    if (selectedLang) {
      setLanguages((prev) => prev.filter((l) => l.id !== selectedLang.id));
    }
    setModal(null);
    setSelectedLang(null);
  };

  return (
    <div className="p-4 md:p-6 bg-[#f8f9fa] min-h-screen font-sans">

      {/* Modals */}
      {(modal === "add" || modal === "edit") && (
        <LangModal
          editLang={modal === "edit" ? selectedLang : null}
          onClose={() => { setModal(null); setSelectedLang(null); }}
          onSave={handleSave}
        />
      )}
      {modal === "delete" && selectedLang && (
        <DeleteModal
          lang={selectedLang}
          onClose={() => { setModal(null); setSelectedLang(null); }}
          onConfirm={handleDelete}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tillar</h1>
          <p className="text-sm text-gray-400 mt-0.5">Tizim tillarini boshqarish va tarjimalar</p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6c0c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-100"
        >
          <Plus className="w-4 h-4" />
          Yangi til qo'shish
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-3.5 w-20">Kod</th>
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-3.5">Nomi</th>
              <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-3.5">Holati</th>
              <th className="text-right text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-3.5">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {languages.map((lang, idx) => (
              <tr
                key={lang.id}
                className={`border-b border-gray-50 hover:bg-gray-50/40 transition-colors ${
                  idx === languages.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Code badge */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      lang.code === "UZ" ? "bg-blue-100 text-blue-600" :
                      lang.code === "RU" ? "bg-red-100 text-red-500" :
                      lang.code === "EN" ? "bg-green-100 text-green-600" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {lang.code}
                    </span>
                  </div>
                </td>

                {/* Name */}
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-800">{lang.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{lang.script}</p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {lang.isDefault ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-[#F97316]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                      Asosiy
                    </span>
                  ) : lang.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Faol
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      Nofaol
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setSelectedLang(lang); setModal("edit"); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-gray-400 hover:text-[#F97316] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {!lang.isDefault && (
                      <button
                        onClick={() => { setSelectedLang(lang); setModal("delete"); }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-8">
        © 2024 Minibaba. Barcha huquqlar himoyalangan.
      </p>
    </div>
  );
}