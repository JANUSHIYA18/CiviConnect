import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KioskLayout from "@/components/kiosk/KioskLayout";
import { useLanguage, LangCode } from "@/contexts/LanguageContext";

const languages = [
  { code: "en" as LangCode, nameKey: "language_english", badge: "EN", region: "GB" },
  { code: "hi" as LangCode, nameKey: "language_hindi", badge: "HI", region: "IN" },
  { code: "mr" as LangCode, nameKey: "language_marathi", badge: "MR", region: "IN" },
  { code: "ta" as LangCode, nameKey: "language_tamil", badge: "TA", region: "IN" },
];

const LanguageScreen = () => {
  const navigate = useNavigate();
  const { setLang, t } = useLanguage();

  const handleSelect = (code: LangCode) => {
    setLang(code);
    navigate("/auth");
  };

  return (
    <KioskLayout showHeader={false}>
      <div className="flex flex-1 flex-col items-center justify-center kiosk-hero-gradient px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-center">
          <h1 className="mb-1 text-3xl font-bold text-primary-foreground">{t("select_language")}</h1>
          <p className="text-lg text-primary-foreground/70">{t("language_hint")}</p>
        </motion.div>

        <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-5">
          {languages.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(lang.code)}
              className="touch-target kiosk-card-shadow hover:kiosk-card-shadow-hover flex cursor-pointer flex-col items-center gap-3 rounded-2xl bg-card p-8 transition-shadow"
            >
              <span className="font-mono text-2xl font-bold tracking-wide text-primary">{lang.region}</span>
              <span className="text-xl font-bold text-card-foreground">{t(lang.nameKey)}</span>
              <span className="text-sm font-medium text-muted-foreground">{lang.badge}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
};

export default LanguageScreen;
