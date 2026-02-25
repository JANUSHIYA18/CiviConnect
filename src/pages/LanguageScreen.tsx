import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import KioskLayout from "@/components/kiosk/KioskLayout";

const languages = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
];

const LanguageScreen = () => {
  const navigate = useNavigate();

  const handleSelect = (code: string) => {
    navigate("/auth");
  };

  return (
    <KioskLayout showHeader={false}>
      <div className="flex flex-1 flex-col items-center justify-center kiosk-hero-gradient px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center"
        >
          <h1 className="text-3xl font-bold text-primary-foreground mb-1">Select Your Language</h1>
          <p className="text-primary-foreground/70 text-lg">अपनी भाषा चुनें</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-5 w-full max-w-lg">
          {languages.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(lang.code)}
              className="flex flex-col items-center gap-3 rounded-2xl bg-card p-8 kiosk-card-shadow hover:kiosk-card-shadow-hover transition-shadow cursor-pointer touch-target"
            >
              <span className="text-4xl">{lang.flag}</span>
              <span className="text-xl font-bold text-card-foreground">{lang.native}</span>
              <span className="text-sm text-muted-foreground">{lang.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
};

export default LanguageScreen;
