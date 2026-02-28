import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type LangCode = "en" | "hi" | "mr" | "ta";

const translations: Record<string, Record<LangCode, string>> = {
  app_name: { en: "CiviConnect", hi: "CiviConnect", mr: "CiviConnect", ta: "CiviConnect" },
  powered_by: {
    en: "Powered by Smart City Initiative",
    hi: "स्मार्ट सिटी पहल द्वारा संचालित",
    mr: "स्मार्ट सिटी उपक्रमाद्वारे समर्थित",
    ta: "ஸ்மார்ட் சிட்டி முயற்சியால் இயக்கப்படுகிறது",
  },
  footer_tagline: {
    en: "CiviConnect - Unified Civic Utility Kiosk",
    hi: "CiviConnect - Unified Civic Utility Kiosk",
    mr: "CiviConnect - Unified Civic Utility Kiosk",
    ta: "CiviConnect - Unified Civic Utility Kiosk",
  },
  step_2_of_5: { en: "Step 2 of 5", hi: "5 में से चरण 2", mr: "5 पैकी चरण 2", ta: "5 இல் 2-ஆம் படி" },
  step_3_of_5: { en: "Step 3 of 5", hi: "5 में से चरण 3", mr: "5 पैकी चरण 3", ta: "5 இல் 3-ஆம் படி" },
  step_4_of_5: { en: "Step 4 of 5", hi: "5 में से चरण 4", mr: "5 पैकी चरण 4", ta: "5 இல் 4-ஆம் படி" },
  welcome_subtitle: {
    en: "Your Unified Smart Kiosk for Urban Civic Utility Services",
    hi: "शहरी नागरिक सेवाओं के लिए आपका एकीकृत स्मार्ट कियोस्क",
    mr: "शहरी नागरिक सेवांसाठी तुमचा एकात्मिक स्मार्ट किऑस्क",
    ta: "நகர்ப்புற குடிமக்கள் சேவைகளுக்கான உங்கள் ஒருங்கிணைந்த ஸ்மார்ட் கியோஸ்க்",
  },
  service_electricity: { en: "Electricity", hi: "बिजली", mr: "वीज", ta: "மின்சாரம்" },
  service_gas: { en: "Gas", hi: "गैस", mr: "गॅस", ta: "எரிவாயு" },
  service_municipal: { en: "Municipal", hi: "नगरपालिका", mr: "महानगरपालिका", ta: "நகராட்சி" },
  touch_to_begin: { en: "Touch to Begin", hi: "शुरू करने के लिए स्पर्श करें", mr: "सुरू करण्यासाठी स्पर्श करा", ta: "தொடங்க தொடவும்" },
  security_badge: {
    en: "AES-256 Encrypted • PCI DSS Compliant",
    hi: "AES-256 एन्क्रिप्टेड • PCI DSS अनुरूप",
    mr: "AES-256 एन्क्रिप्टेड • PCI DSS अनुरूप",
    ta: "AES-256 குறியாக்கம் • PCI DSS இணக்கம்",
  },
  select_language: { en: "Select Your Language", hi: "अपनी भाषा चुनें", mr: "तुमची भाषा निवडा", ta: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்" },
  language_hint: { en: "Choose your preferred language", hi: "अपनी पसंदीदा भाषा चुनें", mr: "आपली पसंतीची भाषा निवडा", ta: "உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்" },
  language_english: { en: "English", hi: "अंग्रेज़ी", mr: "इंग्रजी", ta: "ஆங்கிலம்" },
  language_hindi: { en: "Hindi", hi: "हिंदी", mr: "हिंदी", ta: "இந்தி" },
  language_marathi: { en: "Marathi", hi: "मराठी", mr: "मराठी", ta: "மராத்தி" },
  language_tamil: { en: "Tamil", hi: "तमिल", mr: "तामिळ", ta: "தமிழ்" },
  auth_title: { en: "Authentication", hi: "प्रमाणीकरण", mr: "प्रमाणीकरण", ta: "அங்கீகாரம்" },
  enter_phone: { en: "Enter Phone Number", hi: "फोन नंबर दर्ज करें", mr: "फोन नंबर टाका", ta: "தொலைபேசி எண்ணை உள்ளிடவும்" },
  send_otp_help: {
    en: "We'll send a 6-digit OTP to verify your identity",
    hi: "पहचान सत्यापित करने के लिए 6 अंकों का OTP भेजा जाएगा",
    mr: "ओळख पडताळणीसाठी 6 अंकी OTP पाठवला जाईल",
    ta: "அடையாளத்தை சரிபார்க்க 6 இலக்க OTP அனுப்பப்படும்",
  },
  aadhaar_optional: { en: "Aadhaar (optional)", hi: "आधार (वैकल्पिक)", mr: "आधार (ऐच्छिक)", ta: "ஆதார் (விருப்பம்)" },
  send_otp: { en: "Send OTP", hi: "OTP भेजें", mr: "OTP पाठवा", ta: "OTP அனுப்பவும்" },
  sending_otp: { en: "Sending OTP...", hi: "OTP भेजा जा रहा है...", mr: "OTP पाठवत आहे...", ta: "OTP அனுப்பப்படுகிறது..." },
  verify_otp: { en: "Verify OTP", hi: "OTP सत्यापित करें", mr: "OTP पडताळा", ta: "OTP சரிபார்க்கவும்" },
  otp_sent_to: { en: "Enter the 6-digit code sent to", hi: "भेजा गया 6 अंकों का कोड दर्ज करें", mr: "पाठवलेला 6 अंकी कोड टाका", ta: "அனுப்பிய 6 இலக்க குறியீட்டை உள்ளிடவும்" },
  verify_continue: { en: "Verify & Continue", hi: "सत्यापित करें और आगे बढ़ें", mr: "पडताळा आणि पुढे चला", ta: "சரிபார்த்து தொடரவும்" },
  verifying: { en: "Verifying...", hi: "सत्यापित हो रहा है...", mr: "पडताळणी सुरू आहे...", ta: "சரிபார்க்கப்படுகிறது..." },
  change_phone_number: { en: "Change phone number", hi: "फोन नंबर बदलें", mr: "फोन नंबर बदला", ta: "தொலைபேசி எண்ணை மாற்றவும்" },
  dev_otp: { en: "Dev OTP", hi: "डेव OTP", mr: "डेव्ह OTP", ta: "டெவ் OTP" },
  otp_sent_success: { en: "OTP sent to", hi: "OTP भेजा गया", mr: "OTP पाठवला", ta: "OTP அனுப்பப்பட்டது" },
  otp_send_failed: { en: "Failed to send OTP", hi: "OTP भेजने में विफल", mr: "OTP पाठवण्यात अयशस्वी", ta: "OTP அனுப்ப முடியவில்லை" },
  verified_success: { en: "Verified successfully!", hi: "सफलतापूर्वक सत्यापित!", mr: "यशस्वी पडताळणी!", ta: "வெற்றிகரமாக சரிபார்க்கப்பட்டது!" },
  verify_failed: { en: "OTP verification failed", hi: "OTP सत्यापन विफल", mr: "OTP पडताळणी अयशस्वी", ta: "OTP சரிபார்ப்பு தோல்வியடைந்தது" },
  select_service_title: { en: "Select Service", hi: "सेवा चुनें", mr: "सेवा निवडा", ta: "சேவையைத் தேர்ந்தெடுக்கவும்" },
  services_heading: { en: "What can we help you with?", hi: "हम आपकी कैसे मदद कर सकते हैं?", mr: "आम्ही तुम्हाला कशी मदत करू?", ta: "நாங்கள் எப்படி உதவலாம்?" },
  services_subheading: { en: "Select a service to continue", hi: "जारी रखने के लिए सेवा चुनें", mr: "पुढे जाण्यासाठी सेवा निवडा", ta: "தொடர ஒரு சேவையைத் தேர்ந்தெடுக்கவும்" },
  service_electricity_desc: { en: "Pay bills, report outages", hi: "बिल भुगतान, बिजली बाधा रिपोर्ट", mr: "बिल भरा, खंडित वीज नोंदवा", ta: "பில் செலுத்தல், மின்தடை புகார்" },
  service_gas_desc: { en: "Pipeline gas, cylinder booking", hi: "पाइपलाइन गैस, सिलेंडर बुकिंग", mr: "पाईप गॅस, सिलिंडर बुकिंग", ta: "குழாய் எரிவாயு, சிலிண்டர் பதிவு" },
  service_water: { en: "Water Supply", hi: "जल आपूर्ति", mr: "पाणीपुरवठा", ta: "நீர் வழங்கல்" },
  service_water_desc: { en: "Water bills, connection", hi: "पानी बिल, कनेक्शन", mr: "पाणी बिल, जोडणी", ta: "நீர் பில், இணைப்பு" },
  service_waste: { en: "Waste Mgmt", hi: "कचरा प्रबंधन", mr: "कचरा व्यवस्थापन", ta: "கழிவு மேலாண்மை" },
  service_waste_desc: { en: "Collection, complaints", hi: "संग्रह, शिकायतें", mr: "संकलन, तक्रारी", ta: "சேகரிப்பு, புகார்கள்" },
  service_property: { en: "Property Tax", hi: "संपत्ति कर", mr: "मालमत्ता कर", ta: "சொத்து வரி" },
  service_property_desc: { en: "Payments, assessments", hi: "भुगतान, आकलन", mr: "देयके, मूल्यमापन", ta: "கட்டணங்கள், மதிப்பீடுகள்" },
  service_certificates: { en: "Certificates", hi: "प्रमाणपत्र", mr: "प्रमाणपत्रे", ta: "சான்றிதழ்கள்" },
  service_certificates_desc: { en: "Birth, death, domicile", hi: "जन्म, मृत्यु, निवास", mr: "जन्म, मृत्यू, अधिवास", ta: "பிறப்பு, இறப்பு, குடியிருப்பு" },
  file_complaint: { en: "File Complaint", hi: "शिकायत दर्ज करें", mr: "तक्रार नोंदवा", ta: "புகார் பதிவு" },
  file_complaint_desc: { en: "Report an issue", hi: "समस्या दर्ज करें", mr: "समस्या नोंदवा", ta: "சிக்கலை பதிவு செய்யவும்" },
  service_request: { en: "Service Request", hi: "सेवा अनुरोध", mr: "सेवा विनंती", ta: "சேவை கோரிக்கை" },
  service_request_desc: { en: "New connection, changes", hi: "नया कनेक्शन, बदलाव", mr: "नवीन जोडणी, बदल", ta: "புதிய இணைப்பு, மாற்றங்கள்" },
  track_status: { en: "Track Status", hi: "स्थिति ट्रैक करें", mr: "स्थिती ट्रॅक करा", ta: "நிலையை கண்காணிக்கவும்" },
  track_status_desc: { en: "Check complaint/request", hi: "शिकायत/अनुरोध जांचें", mr: "तक्रार/विनंती तपासा", ta: "புகார்/கோரிக்கை நிலை பார்க்க" },
  payment_enter_account: { en: "Enter Account ID", hi: "खाता आईडी दर्ज करें", mr: "खातेचा आयडी भरा", ta: "கணக்கு ஐடியை உள்ளிடவும்" },
  payment_scan_qr: { en: "Or scan the QR code on your bill", hi: "या अपने बिल का QR कोड स्कैन करें", mr: "किंवा बिलवरील QR कोड स्कॅन करा", ta: "அல்லது உங்கள் பில்லின் QR குறியீட்டை ஸ்கேன் செய்யவும்" },
  payment_gateway_note: { en: "You will be redirected to secure Stripe checkout", hi: "आपको सुरक्षित Stripe चेकआउट पर भेजा जाएगा", mr: "तुम्हाला सुरक्षित Stripe चेकआउटकडे वळवले जाईल", ta: "நீங்கள் பாதுகாப்பான Stripe checkout-க்கு மாற்றப்படுவீர்கள்" },
  pay_with_stripe: { en: "Pay with Stripe", hi: "Stripe से भुगतान करें", mr: "Stripe ने पेमेंट करा", ta: "Stripe மூலம் செலுத்தவும்" },
  fetch_bill_details: { en: "Fetch Bill Details", hi: "बिल विवरण प्राप्त करें", mr: "बिल तपशील मिळवा", ta: "பில் விவரங்களை பெறவும்" },
  lookup_failed: { en: "Failed to fetch bill details", hi: "बिल विवरण प्राप्त नहीं हुआ", mr: "बिल तपशील मिळवता आला नाही", ta: "பில் விவரங்களை பெற முடியவில்லை" },
  bill_summary: { en: "Bill Summary", hi: "बिल सारांश", mr: "बिल सारांश", ta: "பில் சுருக்கம்" },
  service: { en: "Service", hi: "सेवा", mr: "सेवा", ta: "சேவை" },
  account: { en: "Account", hi: "खाता", mr: "खाते", ta: "கணக்கு" },
  period: { en: "Period", hi: "अवधि", mr: "कालावधी", ta: "காலம்" },
  due_date: { en: "Due Date", hi: "नियत तिथि", mr: "देय तारीख", ta: "கடைசி தேதி" },
  amount_due: { en: "Amount Due", hi: "देय राशि", mr: "देय रक्कम", ta: "செலுத்த வேண்டிய தொகை" },
  pay_now: { en: "Pay Now", hi: "अभी भुगतान करें", mr: "आत्ता भरा", ta: "இப்போது செலுத்தவும்" },
  payment_processing: { en: "Processing Payment", hi: "भुगतान संसाधित हो रहा है", mr: "देयक प्रक्रिया सुरू आहे", ta: "கட்டணம் செயலாக்கப்படுகிறது" },
  payment_processing_wait: { en: "Please wait while we process your transaction...", hi: "लेनदेन पूरा होने तक कृपया प्रतीक्षा करें...", mr: "व्यवहार पूर्ण होईपर्यंत कृपया थांबा...", ta: "பரிவர்த்தனை நடைபெறும் வரை காத்திருக்கவும்..." },
  payment_success: { en: "Payment Successful!", hi: "भुगतान सफल!", mr: "पेमेंट यशस्वी!", ta: "கட்டணம் வெற்றி!" },
  transaction_id: { en: "Transaction ID:", hi: "लेनदेन आईडी:", mr: "व्यवहार आयडी:", ta: "பரிவர்த்தனை ஐடி:" },
  payment_failed: { en: "Payment failed", hi: "भुगतान विफल", mr: "पेमेंट अयशस्वी", ta: "கட்டணம் தோல்வியடைந்தது" },
  more_services: { en: "More Services", hi: "और सेवाएं", mr: "अधिक सेवा", ta: "மேலும் சேவைகள்" },
  done: { en: "Done", hi: "समाप्त", mr: "पूर्ण", ta: "முடிந்தது" },
  back: { en: "Back", hi: "वापस", mr: "मागे", ta: "பின்" },
  submit: { en: "Submit", hi: "जमा करें", mr: "सबमिट", ta: "சமர்ப்பிக்கவும்" },
  report_issue: { en: "Report an Issue", hi: "समस्या दर्ज करें", mr: "समस्या नोंदवा", ta: "சிக்கலை பதிவு செய்யவும்" },
  select_category: { en: "Select Category", hi: "श्रेणी चुनें", mr: "वर्ग निवडा", ta: "வகையை தேர்ந்தெடுக்கவும்" },
  issue_question: { en: "What type of issue are you facing?", hi: "आप किस प्रकार की समस्या का सामना कर रहे हैं?", mr: "तुम्हाला कोणती समस्या येत आहे?", ta: "நீங்கள் எந்த வகை சிக்கலை சந்திக்கிறீர்கள்?" },
  category_power_cut: { en: "Power Cut / Outage", hi: "बिजली कटौती / बाधा", mr: "वीज खंडित / आउटेज", ta: "மின்தடை / கோளாறு" },
  category_water_leakage: { en: "Water Leakage", hi: "जल रिसाव", mr: "पाणी गळती", ta: "நீர் கசிவு" },
  category_gas_issue: { en: "Gas Supply Issue", hi: "गैस आपूर्ति समस्या", mr: "गॅस पुरवठा समस्या", ta: "எரிவாயு விநியோக சிக்கல்" },
  category_waste_issue: { en: "Waste Collection", hi: "कचरा संग्रह", mr: "कचरा संकलन", ta: "கழிவு சேகரிப்பு" },
  describe_issue: { en: "Describe Issue", hi: "समस्या का विवरण दें", mr: "समस्येचे वर्णन करा", ta: "சிக்கலை விவரிக்கவும்" },
  category_label: { en: "Category:", hi: "श्रेणी:", mr: "वर्ग:", ta: "வகை:" },
  subject_placeholder: {
    en: "Subject (e.g., No power since morning)",
    hi: "विषय (जैसे: सुबह से बिजली नहीं)",
    mr: "विषय (उदा. सकाळपासून वीज नाही)",
    ta: "தலைப்பு (உதா: காலை முதல் மின்சாரம் இல்லை)",
  },
  issue_detail_placeholder: {
    en: "Describe the issue in detail...",
    hi: "समस्या का विस्तृत विवरण लिखें...",
    mr: "समस्येचे तपशीलवार वर्णन करा...",
    ta: "சிக்கலை விரிவாக எழுதவும்...",
  },
  fill_all_fields: { en: "Please fill in all fields", hi: "कृपया सभी फ़ील्ड भरें", mr: "कृपया सर्व फील्ड भरा", ta: "அனைத்து புலங்களையும் நிரப்பவும்" },
  registering_complaint: { en: "Registering Complaint", hi: "शिकायत दर्ज हो रही है", mr: "तक्रार नोंदणी सुरू आहे", ta: "புகார் பதிவு செய்யப்படுகிறது" },
  please_wait: { en: "Please wait...", hi: "कृपया प्रतीक्षा करें...", mr: "कृपया थांबा...", ta: "தயவுசெய்து காத்திருக்கவும்..." },
  complaint_registered: { en: "Complaint Registered!", hi: "शिकायत दर्ज हो गई!", mr: "तक्रार नोंदली गेली!", ta: "புகார் பதிவு செய்யப்பட்டது!" },
  reference_id: { en: "Reference ID:", hi: "संदर्भ आईडी:", mr: "संदर्भ आयडी:", ta: "குறிப்பு ஐடி:" },
  save_ref_to_track: { en: "Save this ID to track your complaint status", hi: "स्थिति ट्रैक करने के लिए इस आईडी को सुरक्षित रखें", mr: "स्थिती ट्रॅक करण्यासाठी हा आयडी जतन करा", ta: "நிலையை கண்காணிக்க இந்த ஐடியை சேமிக்கவும்" },
  complaint_success: { en: "Complaint registered successfully!", hi: "शिकायत सफलतापूर्वक दर्ज हुई!", mr: "तक्रार यशस्वी नोंदली!", ta: "புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!" },
  complaint_failed: { en: "Failed to register complaint", hi: "शिकायत दर्ज करने में विफल", mr: "तक्रार नोंदवण्यात अयशस्वी", ta: "புகார் பதிவு செய்ய முடியவில்லை" },
  request_new: { en: "New Request", hi: "नया अनुरोध", mr: "नवीन विनंती", ta: "புதிய கோரிக்கை" },
  select_request_type: { en: "Select Request Type", hi: "अनुरोध प्रकार चुनें", mr: "विनंती प्रकार निवडा", ta: "கோரிக்கை வகையைத் தேர்ந்தெடுக்கவும்" },
  service_need_question: { en: "What service do you need?", hi: "आपको कौन सी सेवा चाहिए?", mr: "तुम्हाला कोणती सेवा हवी?", ta: "உங்களுக்கு எந்த சேவை வேண்டும்?" },
  req_new_connection: { en: "New Connection", hi: "नया कनेक्शन", mr: "नवीन जोडणी", ta: "புதிய இணைப்பு" },
  req_address_change: { en: "Address Change", hi: "पता परिवर्तन", mr: "पत्ता बदल", ta: "முகவரி மாற்றம்" },
  req_meter_replace: { en: "Meter Replacement", hi: "मीटर बदलना", mr: "मीटर बदल", ta: "மீட்டர் மாற்றம்" },
  req_name_correction: { en: "Name Correction", hi: "नाम सुधार", mr: "नाव दुरुस्ती", ta: "பெயர் திருத்தம்" },
  request_details: { en: "Request Details", hi: "अनुरोध विवरण", mr: "विनंती तपशील", ta: "கோரிக்கை விவரங்கள்" },
  type_label: { en: "Type:", hi: "प्रकार:", mr: "प्रकार:", ta: "வகை:" },
  full_name_placeholder: { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव", ta: "முழு பெயர்" },
  request_detail_placeholder: { en: "Provide details about your request...", hi: "अपने अनुरोध का विवरण दें...", mr: "तुमच्या विनंतीबद्दल तपशील द्या...", ta: "உங்கள் கோரிக்கையின் விவரங்களை எழுதவும்..." },
  upload_docs_help: { en: "Upload up to 3 supporting documents (max 5MB each).", hi: "अधिकतम 3 दस्तावेज़ अपलोड करें (प्रत्येक 5MB तक)।", mr: "जास्तीत जास्त 3 कागदपत्रे अपलोड करा (प्रत्येकी 5MB).", ta: "அதிகபட்சம் 3 ஆவணங்கள் (ஒன்றுக்கு 5MB) பதிவேற்றலாம்." },
  submitting_request: { en: "Submitting Request", hi: "अनुरोध भेजा जा रहा है", mr: "विनंती सबमिट होत आहे", ta: "கோரிக்கை சமர்ப்பிக்கப்படுகிறது" },
  request_submitted: { en: "Request Submitted!", hi: "अनुरोध जमा हुआ!", mr: "विनंती सादर झाली!", ta: "கோரிக்கை சமர்ப்பிக்கப்பட்டது!" },
  use_ref_track_request: { en: "Use this ID to track your request status", hi: "स्थिति ट्रैक करने के लिए इस आईडी का उपयोग करें", mr: "स्थिती ट्रॅक करण्यासाठी हा आयडी वापरा", ta: "உங்கள் கோரிக்கை நிலையை பார்க்க இந்த ஐடியை பயன்படுத்தவும்" },
  request_success: { en: "Service request submitted!", hi: "सेवा अनुरोध जमा हुआ!", mr: "सेवा विनंती सादर झाली!", ta: "சேவை கோரிக்கை சமர்ப்பிக்கப்பட்டது!" },
  request_failed: { en: "Failed to submit request", hi: "अनुरोध जमा करने में विफल", mr: "विनंती सादर करण्यात अयशस्वी", ta: "கோரிக்கையை சமர்ப்பிக்க முடியவில்லை" },
  track_progress: { en: "Check Progress", hi: "प्रगति जांचें", mr: "प्रगती तपासा", ta: "முன்னேற்றத்தை பார்க்கவும்" },
  track_your_request: { en: "Track Your Request", hi: "अपना अनुरोध ट्रैक करें", mr: "तुमची विनंती ट्रॅक करा", ta: "உங்கள் கோரிக்கையை கண்காணிக்கவும்" },
  enter_reference_help: { en: "Enter your reference ID (CMP-xxx, SR-xxx, or TXN-xxx)", hi: "अपनी संदर्भ आईडी दर्ज करें (CMP-xxx, SR-xxx, या TXN-xxx)", mr: "तुमचा संदर्भ आयडी टाका (CMP-xxx, SR-xxx, किंवा TXN-xxx)", ta: "உங்கள் குறிப்பு ஐடியை உள்ளிடவும் (CMP-xxx, SR-xxx, அல்லது TXN-xxx)" },
  searching: { en: "Searching...", hi: "खोजा जा रहा है...", mr: "शोध चालू आहे...", ta: "தேடுகிறது..." },
  status_pending: { en: "Pending", hi: "लंबित", mr: "प्रलंबित", ta: "நிலுவை" },
  status_in_progress: { en: "In Progress", hi: "प्रगति में", mr: "प्रगतीत", ta: "செயல்பாட்டில்" },
  status_completed: { en: "Completed", hi: "पूर्ण", mr: "पूर्ण", ta: "நிறைவு" },
  status_rejected: { en: "Rejected", hi: "अस्वीकृत", mr: "नाकारले", ta: "நிராகரிக்கப்பட்டது" },
  type: { en: "Type", hi: "प्रकार", mr: "प्रकार", ta: "வகை" },
  date: { en: "Date", hi: "तिथि", mr: "तारीख", ta: "தேதி" },
  details: { en: "Details", hi: "विवरण", mr: "तपशील", ta: "விவரங்கள்" },
  timeline_submitted: { en: "Submitted", hi: "जमा", mr: "सादर", ta: "சமர்ப்பிக்கப்பட்டது" },
  timeline_in_progress: { en: "In Progress", hi: "प्रगति में", mr: "प्रगतीत", ta: "செயல்பாட்டில்" },
  timeline_completed: { en: "Completed", hi: "पूर्ण", mr: "पूर्ण", ta: "நிறைவு" },
  back_to_services: { en: "Back to Services", hi: "सेवाओं पर वापस", mr: "सेवांकडे परत", ta: "சேவைகளுக்கு திரும்பவும்" },
  no_records_found: { en: "No records found", hi: "कोई रिकॉर्ड नहीं मिला", mr: "रेकॉर्ड आढळला नाही", ta: "பதிவு எதுவும் இல்லை" },
  check_ref_try_again: { en: "Please check your reference ID and try again", hi: "कृपया संदर्भ आईडी जांचकर फिर प्रयास करें", mr: "कृपया संदर्भ आयडी तपासून पुन्हा प्रयत्न करा", ta: "குறிப்பு ஐடியை சரிபார்த்து மீண்டும் முயற்சிக்கவும்" },
  logout: { en: "Logout", hi: "लॉगआउट", mr: "लॉगआउट", ta: "வெளியேறு" },
  services_help_title: { en: "How to use this page", hi: "इस पेज का उपयोग कैसे करें", mr: "हे पेज कसे वापरावे", ta: "இந்தப் பக்கத்தை எப்படி பயன்படுத்துவது" },
  services_help_body: {
    en: "Choose a tile to continue. Payment tiles open bill lookup and payment flow, while Complaint, Service Request, and Track Status are for issue reporting, new requests, and status checking.",
    hi: "आगे बढ़ने के लिए एक विकल्प चुनें। पेमेंट विकल्प बिल खोज और भुगतान के लिए हैं, जबकि शिकायत, सेवा अनुरोध और स्थिति ट्रैकिंग अन्य सेवाओं के लिए हैं।",
    mr: "पुढे जाण्यासाठी एक पर्याय निवडा. पेमेंट पर्याय बिल शोध आणि पेमेंटसाठी आहेत, तर तक्रार, सेवा विनंती आणि स्थिती ट्रॅकिंग इतर सेवांसाठी आहेत.",
    ta: "தொடர ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும். கட்டண விருப்பங்கள் பில் தேடல் மற்றும் கட்டணத்திற்கு, புகார், சேவை கோரிக்கை மற்றும் நிலை கண்காணிப்பு மற்ற சேவைகளுக்கு பயன்படுத்தப்படுகின்றன.",
  },
  complaint_help_category: {
    en: "This feature is for unresolved civic utility issues. Select the closest category, then provide clear details on the next screen to help faster resolution.",
    hi: "यह सुविधा लंबित नागरिक सेवा समस्याओं के लिए है। सही श्रेणी चुनें और अगले चरण में स्पष्ट विवरण दें ताकि समाधान जल्दी हो सके।",
    mr: "ही सुविधा प्रलंबित नागरी सेवा समस्यांसाठी आहे. योग्य प्रकार निवडा आणि पुढील टप्प्यात स्पष्ट माहिती द्या, म्हणजे निराकरण लवकर होईल.",
    ta: "இந்த வசதி தீர்க்கப்படாத குடிமக்கள் சேவை பிரச்சினைகளுக்காகும். சரியான வகையைத் தேர்ந்தெடுத்து அடுத்த கட்டத்தில் தெளிவான விவரங்களை வழங்கவும்.",
  },
  complaint_help_details: {
    en: "Include location, time, and impact in your description. This improves triage accuracy and status updates.",
    hi: "विवरण में स्थान, समय और प्रभाव जरूर लिखें। इससे जांच और स्थिति अपडेट बेहतर होते हैं।",
    mr: "वर्णनात ठिकाण, वेळ आणि परिणाम नमूद करा. यामुळे तपासणी आणि स्थिती अपडेट अधिक अचूक होतात.",
    ta: "விவரத்தில் இடம், நேரம் மற்றும் தாக்கத்தை குறிப்பிடவும். இது செயலாக்க துல்லியத்தையும் நிலை புதுப்பிப்பையும் மேம்படுத்தும்.",
  },
  request_help_type: {
    en: "Use this for planned changes like new connection, address update, meter replacement, or name correction. Select the closest type to route your request correctly.",
    hi: "नई कनेक्शन, पता परिवर्तन, मीटर बदल या नाम सुधार जैसे अनुरोधों के लिए इसका उपयोग करें। सही प्रकार चुनने से अनुरोध सही विभाग में जाता है।",
    mr: "नवीन जोडणी, पत्ता बदल, मीटर बदल किंवा नाव दुरुस्ती अशा विनंत्यांसाठी हे वापरा. योग्य प्रकार निवडल्यास विनंती योग्य विभागाकडे जाते.",
    ta: "புதிய இணைப்பு, முகவரி மாற்றம், மீட்டர் மாற்றம் அல்லது பெயர் திருத்தம் போன்ற கோரிக்கைகளுக்கு இதைப் பயன்படுத்தவும். சரியான வகையைத் தேர்ந்தெடுத்தால் கோரிக்கை சரியான பிரிவிற்கு செல்கிறது.",
  },
  request_help_details: {
    en: "Add complete information and supporting files to reduce verification delays.",
    hi: "सत्यापन में देरी कम करने के लिए पूरी जानकारी और सहायक दस्तावेज़ जोड़ें।",
    mr: "पडताळणीतील विलंब कमी करण्यासाठी पूर्ण माहिती आणि पूरक कागदपत्रे जोडा.",
    ta: "சரிபார்ப்பு தாமதத்தை குறைக்க முழுமையான தகவலும் ஆதார கோப்புகளும் சேர்க்கவும்.",
  },
  tracking_help_input: {
    en: "Use the reference ID received after complaint, service request, or payment. Keep the exact prefix (CMP, SR, TXN) for accurate lookup.",
    hi: "शिकायत, सेवा अनुरोध या भुगतान के बाद मिला रेफरेंस आईडी उपयोग करें। सही खोज के लिए प्रीफिक्स (CMP, SR, TXN) जैसा है वैसा ही रखें।",
    mr: "तक्रार, सेवा विनंती किंवा पेमेंटनंतर मिळालेला संदर्भ आयडी वापरा. अचूक शोधासाठी प्रीफिक्स (CMP, SR, TXN) जसेच्या तसे ठेवा.",
    ta: "புகார், சேவை கோரிக்கை அல்லது கட்டணத்திற்குப் பின் கிடைத்த குறிப்பு ஐடியை பயன்படுத்தவும். துல்லியமான தேடலுக்கு முன்னொட்டு (CMP, SR, TXN) அதேபடி இருக்க வேண்டும்.",
  },
  session_timeout: { en: "Session Timeout", hi: "सत्र समाप्ति", mr: "सत्र कालबाह्य", ta: "அமர்வு காலாவதி" },
  session_expires_in: { en: "Your session will expire in", hi: "आपका सत्र समाप्त होगा", mr: "तुमचे सत्र संपेल", ta: "உங்கள் அமர்வு முடிவடையும்" },
  continue_session: { en: "Continue Session", hi: "सत्र जारी रखें", mr: "सत्र सुरू ठेवा", ta: "அமர்வை தொடரவும்" },
  not_found_title: { en: "Oops! Page not found", hi: "ओह! पेज नहीं मिला", mr: "अरेरे! पृष्ठ सापडले नाही", ta: "அச்சச்சோ! பக்கம் கிடைக்கவில்லை" },
  return_home: { en: "Return to Home", hi: "होम पर लौटें", mr: "मुखपृष्ठावर जा", ta: "முகப்புக்கு திரும்பவும்" },
};

interface LanguageContextType {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<LangCode>(() => {
    const persisted = localStorage.getItem("kiosk_lang") as LangCode | null;
    return persisted || "en";
  });

  const setLang = (code: LangCode) => {
    localStorage.setItem("kiosk_lang", code);
    setLangState(code);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => translations[key]?.[lang] || translations[key]?.en || key;

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};


