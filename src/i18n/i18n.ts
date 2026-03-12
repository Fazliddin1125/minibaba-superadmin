import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz: {
    translation: {
      // Login
      login_title: "Tizimga kirish",
      login_subtitle: "Boshqaruv paneliga kirish uchun ma'lumotlaringizni kiriting",
      email_label: "Email yoki foydalanuvchi nomi",
      email_placeholder: "Emailingizni kiriting",
      password_label: "Parol",
      password_placeholder: "Parolingizni kiriting",
      remember_me: "Meni eslab qol",
      forgot_password: "Parolni unutdingizmi?",
      login_btn: "Kirish",
      logging_in: "Kirish...",

      // Forgot Password
      forgot_title: "Parolni qayta tiklash",
      forgot_subtitle: "Elektron pochtangizni kiriting va biz sizga parolni tiklash havolasini yuboramiz",
      email_field: "Elektron pochta",
      email_forgot_placeholder: "example@minibaba.uz",
      send_btn: "Yuborish",
      sending: "Yuborilmoqda...",
      back_to_login: "Kirish sahifasiga qaytish",
      success_title: "Havola yuborildi!",
      success_subtitle: "Parolni tiklash havolasi quyidagi emailga yuborildi:",
      success_note: "Emailingizni tekshiring. Agar kelmagan bo'lsa, spam papkasini ham ko'ring.",

      // Validation
      email_required: "Email majburiy",
      email_invalid: "Email noto'g'ri formatda",
      password_required: "Parol majburiy",
      password_min: "Parol kamida 6 ta belgi bo'lishi kerak",

      // Footer
      copyright: "Copyright © 2024 Minibaba. Barcha huquqlar himoyalangan",
      safe_system: "Xavfsiz tizim",
      tech_support: "Texnik boshqaruv",
      hero_text: "O'zbekistondagi eng yirik marketplace boshqaruv tizimi",
      hero_desc: "Biznesingizni samarali boshqaring, buyurtmalarni kuzatib boring va savdolaringizni yangi bosqichga olib chiging.",
    },
  },
  ru: {
    translation: {
      // Login
      login_title: "Вход в систему",
      login_subtitle: "Введите свои данные для доступа к панели управления",
      email_label: "Email или имя пользователя",
      email_placeholder: "Введите ваш email",
      password_label: "Пароль",
      password_placeholder: "Введите ваш пароль",
      remember_me: "Запомнить меня",
      forgot_password: "Забыли пароль?",
      login_btn: "Войти",
      logging_in: "Вход...",

      // Forgot Password
      forgot_title: "Восстановление пароля",
      forgot_subtitle: "Введите вашу почту и мы отправим ссылку для восстановления пароля",
      email_field: "Электронная почта",
      email_forgot_placeholder: "example@minibaba.uz",
      send_btn: "Отправить",
      sending: "Отправка...",
      back_to_login: "Вернуться к входу",
      success_title: "Ссылка отправлена!",
      success_subtitle: "Ссылка для восстановления пароля отправлена на:",
      success_note: "Проверьте вашу почту. Если письмо не пришло, проверьте папку спам.",

      // Validation
      email_required: "Email обязателен",
      email_invalid: "Неверный формат email",
      password_required: "Пароль обязателен",
      password_min: "Пароль должен содержать не менее 6 символов",

      // Footer
      copyright: "Copyright © 2024 Minibaba. Все права защищены",
      safe_system: "Безопасная система",
      tech_support: "Техподдержка",
      hero_text: "Крупнейшая система управления маркетплейсом в Узбекистане",
      hero_desc: "Эффективно управляйте бизнесом, отслеживайте заказы и выводите продажи на новый уровень.",
    },
  },
  en: {
    translation: {
      // Login
      login_title: "Sign In",
      login_subtitle: "Enter your credentials to access the admin panel",
      email_label: "Email or username",
      email_placeholder: "Enter your email",
      password_label: "Password",
      password_placeholder: "Enter your password",
      remember_me: "Remember me",
      forgot_password: "Forgot password?",
      login_btn: "Sign In",
      logging_in: "Signing in...",

      // Forgot Password
      forgot_title: "Reset Password",
      forgot_subtitle: "Enter your email and we will send you a password reset link",
      email_field: "Email address",
      email_forgot_placeholder: "example@minibaba.uz",
      send_btn: "Send",
      sending: "Sending...",
      back_to_login: "Back to login",
      success_title: "Link sent!",
      success_subtitle: "Password reset link has been sent to:",
      success_note: "Check your email. If you didn't receive it, check your spam folder.",

      // Validation
      email_required: "Email is required",
      email_invalid: "Invalid email format",
      password_required: "Password is required",
      password_min: "Password must be at least 6 characters",

      // Footer
      copyright: "Copyright © 2024 Minibaba. All rights reserved",
      safe_system: "Secure system",
      tech_support: "Tech support",
      hero_text: "Uzbekistan's largest marketplace management system",
      hero_desc: "Efficiently manage your business, track orders and take your sales to the next level.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "uz",
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;