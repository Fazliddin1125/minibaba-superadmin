import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "@/i18n/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingBag, Mail, ArrowLeft, CheckCircle, Shield, Headphones } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";


const forgotSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t("email_required")).email(t("email_invalid")),
  });

type ForgotFormData = { email: string };

const languages = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const { setLoading, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema(t)),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Forgot password for:", data.email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full font-sans">

      {/* Left Panel - desktop */}
      <div className="hidden md:flex md:w-[42%] bg-[#F97316] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute bottom-20 -right-16 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <ShoppingBag className="w-5 h-5 text-[#F97316]" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">Minibaba Superadmin.</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-4xl font-extrabold leading-tight mb-4">
            {t("hero_text")}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
            {t("hero_desc")}
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
          <button
            onClick={() => window.open("https://minibaba.uz/#", "_blank")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl px-4 py-2 backdrop-blur-sm transition-all duration-200"
          >
            <Shield className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">{t("safe_system")}</span>
          </button>
          <button
            onClick={() => window.open("https://minibaba.uz/#", "_blank")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl px-4 py-2 backdrop-blur-sm transition-all duration-200"
          >
            <Headphones className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">{t("tech_support")}</span>
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Mobile Header */}
        <div className="md:hidden bg-[#F97316] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md">
              <ShoppingBag className="w-4 h-4 text-[#F97316]" />
            </div>
            <span className="text-white font-bold text-base tracking-wide">Minibaba Admin</span>
          </div>
          <div className="flex gap-2 text-xs">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`transition-colors ${
                  i18n.language === lang.code
                    ? "text-white font-bold border-b border-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Form qismi */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-8 py-8">
          <div className="w-full max-w-md">

            {/* Til tanlash - desktop */}
            <div className="hidden md:flex justify-end gap-3 mb-10 text-sm">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`transition-colors ${
                    i18n.language === lang.code
                      ? "text-[#F97316] font-semibold border-b-2 border-[#F97316]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
              
            </div>

            {!submitted ? (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{t("forgot_title")}</h2>
                <p className="text-gray-400 text-sm mb-8">{t("forgot_subtitle")}</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      {t("email_field")}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register("email")}
                        type="text"
                        placeholder={t("email_forgot_placeholder")}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                          errors.email
                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 bg-gray-50 focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#F97316] hover:bg-[#ea6c0c] disabled:bg-orange-300 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {t("sending")}
                      </>
                    ) : t("send_btn")}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#F97316] transition-colors mt-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("back_to_login")}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-[#F97316]" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{t("success_title")}</h2>
                <p className="text-gray-400 text-sm mb-2">{t("success_subtitle")}</p>
                <p className="text-[#F97316] font-semibold text-sm mb-8">{getValues("email")}</p>
                <p className="text-gray-400 text-xs mb-8">{t("success_note")}</p>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#F97316] transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("back_to_login")}
                </button>
              </div>
            )}

            <p className="text-center text-gray-400 text-xs mt-8">{t("copyright")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}