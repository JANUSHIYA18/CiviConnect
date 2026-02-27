import { createContext, useContext, useState, ReactNode } from "react";

export type LangCode = "en" | "hi" | "mr" | "ta";

const translations: Record<string, Record<LangCode, string>> = {
  "select_service": { en: "What can we help you with?", hi: "हम आपकी कैसे मदद कर सकते हैं?", mr: "आम्ही तुम्हाला कशी मदत करू शकतो?", ta: "நாங்கள் உங்களுக்கு எவ்வாறு உதவ முடியும்?" },
  "select_service_sub": { en: "Select a service to continue", hi: "जारी रखने के लिए एक सेवा चुनें", mr: "सुरू ठेवण्यासाठी एक सेवा निवडा", ta: "தொடர ஒரு சேவையைத் தேர்ந்தெடுக்கவும்" },
  "enter_phone": { en: "Enter Phone Number", hi: "फ़ोन नंबर दर्ज करें", mr: "फोन नंबर प्रविष्ट करा", ta: "தொலைபேசி எண்ணை உள்ளிடவும்" },
  "send_otp": { en: "Send OTP", hi: "OTP भेजें", mr: "OTP पाठवा", ta: "OTP அனுப்பவும்" },
  "verify_otp": { en: "Verify OTP", hi: "OTP सत्यापित करें", mr: "OTP सत्यापित करा", ta: "OTP சரிபார்க்கவும்" },
  "verify_continue": { en: "Verify & Continue", hi: "सत्यापित करें और जारी रखें", mr: "सत्यापित करा आणि सुरू ठेवा", ta: "சரிபார்த்து தொடரவும்" },
  "complaint": { en: "File Complaint", hi: "शिकायत दर्ज करें", mr: "तक्रार नोंदवा", ta: "புகார் பதிவு செய்" },
  "service_request": { en: "Service Request", hi: "सेवा अनुरोध", mr: "सेवा विनंती", ta: "சேவை கோரிக்கை" },
  "track_status": { en: "Track Status", hi: "स्थिति ट्रैक करें", mr: "स्थिती ट्रॅक करा", ta: "நிலையைக் கண்காணி" },
  "pay_bills": { en: "Pay Bills", hi: "बिल भुगतान", mr: "बिल भरा", ta: "பில் செலுத்து" },
  "done": { en: "Done", hi: "पूर्ण", mr: "पूर्ण", ta: "முடிந்தது" },
  "back": { en: "Back", hi: "वापस", mr: "मागे", ta: "பின்செல்" },
  "submit": { en: "Submit", hi: "जमा करें", mr: "सबमिट करा", ta: "சமர்ப்பி" },
  "home": { en: "Home", hi: "होम", mr: "होम", ta: "முகப்பு" },
  "logout": { en: "Logout", hi: "लॉगआउट", mr: "लॉगआउट", ta: "வெளியேறு" },
  "touch_to_begin": { en: "Touch to Begin", hi: "शुरू करने के लिए टच करें", mr: "सुरू करण्यासाठी स्पर्श करा", ta: "தொடங்க தொடவும்" },
  "select_language": { en: "Select Your Language", hi: "अपनी भाषा चुनें", mr: "तुमची भाषा निवडा", ta: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்" },
};

interface LanguageContextType {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<LangCode>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
