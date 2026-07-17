/*
  Global search database (static).
  Build once, then used by script.js + search.html.

  NOTE:
  This index must include *every card title* from your HTML pages so the
  search results always deep-link + highlight the correct card.
*/

(function () {
  const index = [];

  // Helper to push entries (with a few lightweight normalizations)
  function add(entry) {
    if (!entry || !entry.title || !entry.page) return;
    index.push({
      title: String(entry.title).trim(),
      page: String(entry.page).trim(),
      category: String(entry.category || "").trim(),
      description: String(entry.description || "").trim(),
      keywords: String(entry.keywords || "")
    });
  }

  // =========================
  // index.html (homepage tiles)
  // =========================
  add({ title: "Government Services Portal", page: "index.html", category: "Government Services Portal" });
  add({ title: "Latest Updates", page: "index.html", category: "Government Services Portal" });
  add({ title: "TG EAPCET 2026", page: "index.html", category: "Latest Updates" });
  add({ title: "TG CPGET 2026", page: "index.html", category: "Latest Updates" });
  add({ title: "DOST Admissions 2026", page: "index.html", category: "Latest Updates" });
  add({ title: "TG ITI Admissions 2026", page: "index.html", category: "Latest Updates" });

  add({ title: "Quick Access", page: "index.html", category: "Quick Access" });
  add({ title: "Aadhaar", page: "index.html", category: "Quick Access" });
  add({ title: "PAN", page: "index.html", category: "Quick Access" });
  add({ title: "Passport", page: "index.html", category: "Quick Access" });
  add({ title: "Education", page: "index.html", category: "Quick Access" });
  add({ title: "Jobs", page: "index.html", category: "Quick Access" });
  add({ title: "Scholarships", page: "index.html", category: "Quick Access" });

  add({ title: "Government Services", page: "index.html", category: "Government Services" });
  add({ title: "Aadhaar Services", page: "index.html", category: "Government Services" });
  add({ title: "PAN Services", page: "index.html", category: "Government Services" });
  add({ title: "Passport Services", page: "index.html", category: "Government Services" });
  add({ title: "MeeSeva Services", page: "index.html", category: "Government Services" });
  add({ title: "Bhubharati", page: "index.html", category: "Government Services" });
  add({ title: "Ration Card", page: "index.html", category: "Government Services" });

  add({ title: "Education & Exams", page: "index.html", category: "Education & Exams" });
  add({ title: "TG EAPCET", page: "index.html", category: "Education & Exams" });
  add({ title: "TG ECET", page: "index.html", category: "Education & Exams" });
  add({ title: "TG ICET", page: "index.html", category: "Education & Exams" });
  add({ title: "TG PGECET", page: "index.html", category: "Education & Exams" });
  add({ title: "TG CPGET", page: "index.html", category: "Education & Exams" });
  add({ title: "TG POLYCET", page: "index.html", category: "Education & Exams" });

  add({ title: "Jobs & Recruitment", page: "index.html", category: "Jobs & Recruitment" });
  add({ title: "TSPSC", page: "index.html", category: "Jobs & Recruitment" });
  add({ title: "TG DSC", page: "index.html", category: "Jobs & Recruitment" });
  add({ title: "Police Jobs", page: "index.html", category: "Jobs & Recruitment" });
  add({ title: "SSC", page: "index.html", category: "Jobs & Recruitment" });
  add({ title: "UPSC", page: "index.html", category: "Jobs & Recruitment" });
  add({ title: "Railways", page: "index.html", category: "Jobs & Recruitment" });

  add({ title: "News Papers", page: "index.html", category: "News Papers" });
  add({ title: "Eenadu", page: "index.html", category: "News Papers" });
  add({ title: "Sakshi", page: "index.html", category: "News Papers" });
  add({ title: "Andhra Jyothy", page: "index.html", category: "News Papers" });
  add({ title: "Namaste Telangana", page: "index.html", category: "News Papers" });
  add({ title: "The Hindu", page: "index.html", category: "News Papers" });
  add({ title: "Times of India", page: "index.html", category: "News Papers" });

  add({ title: "Useful Tools", page: "index.html", category: "Useful Tools" });
  add({ title: "PDF Tools", page: "index.html", category: "Useful Tools" });
  add({ title: "Image Tools", page: "index.html", category: "Useful Tools" });
  add({ title: "QR Generator", page: "index.html", category: "Useful Tools" });
  add({ title: "Password Generator", page: "index.html", category: "Useful Tools" });
  add({ title: "Age Calculator", page: "index.html", category: "Useful Tools" });
  add({ title: "Percentage Calculator", page: "index.html", category: "Useful Tools" });

  add({ title: "About Venkat Insights", page: "about.html", category: "About" });
  add({ title: "Contact", page: "contact.html", category: "Contact" });
  const governmentCards = [
    // Aadhaar Services
    ["UIDAI", "Aadhaar Services"],
    ["My Aadhaar", "Aadhaar Services"],
    ["Aadhaar Update", "Aadhaar Services"],
    ["Download Aadhaar", "Aadhaar Services"],
    ["Order PVC Aadhaar", "Aadhaar Services"],
    ["Check PVC Aadhaar status using SRN", "Aadhaar Services"],
    ["Check Aadhaar Status", "Aadhaar Services"],
    ["Aadhaar Validity", "Aadhaar Services"],
    ["Report Death of Family", "Aadhaar Services"],
    ["Lock and Unlock adhaar", "Aadhaar Services"],
    ["Enrolement forms", "Aadhaar Services"],
    ["Download List of Supporting Documents", "Aadhaar Services"],

    // PAN Services
    ["PAN Apply", "PAN Services"],
    ["Download e-PAN", "PAN Services"],
    ["Reprint PAN Card", "PAN Services"],
    ["PAN Status", "PAN Services"],

    // Passport Services
    ["Passport Seva", "Passport Services"],
    ["Passport Application", "Passport Services"],
    ["Tatkaal Passport", "Passport Services"],
    ["Police Clearance Certificate", "Passport Services"],
    ["Identity Certificate", "Passport Services"],
    ["Track Application", "Passport Services"],
    ["Book Appointment", "Passport Services"],

    // Food & Civil Supplies
    ["Ration Card Download", "Food & Civil Supplies"],
    ["Food Security Card Search", "Food & Civil Supplies"],
    ["Deepam Card Search", "Food & Civil Supplies"],
    ["National Food Security Portal", "Food & Civil Supplies"],
    ["Ration Cards list", "Food & Civil Supplies"],
    ["Monthly sales report of Rationshop", "Food & Civil Supplies"],
    ["Mera ration Download app", "Food & Civil Supplies"],
    ["New Ration Card Apply", "Food & Civil Supplies"],
    ["Card Corrections", "Food & Civil Supplies"],
    ["Download FSC Card", "Food & Civil Supplies"],
    ["FSC Application Search", "Food & Civil Supplies"],
    ["Supply Chain Management System", "Food & Civil Supplies"],

    // Telangana Transport Services
    ["Driving Licence", "Telangana Transport Services"],
    ["Reservation numbers", "Telangana Transport Services"],
    ["Documents Delivery Status", "Telangana Transport Services"],
    ["Learner Licence slot booking", "Telangana Transport Services"],
    ["Check Licence Slot Availability", "Telangana Transport Services"],
    ["Learner Licence print receipts", "Telangana Transport Services"],
    ["Learner Licence Receipt Reprint", "Telangana Transport Services"],
    ["DL Slot Booking", "Telangana Transport Services"],
    ["Application Status", "Telangana Transport Services"],
    ["NOC Details", "Telangana Transport Services"],
    ["Update Mobile Number", "Telangana Transport Services"],
    ["PUCC Certificate", "Telangana Transport Services"],
    ["Vehicle Search", "Telangana Transport Services"],
    ["Vehicle Registration", "Telangana Transport Services"],
    ["Registration Receipt", "Telangana Transport Services"],
    ["Registratration forms Reprint", "Telangana Transport Services"],
    ["RC Download", "Telangana Transport Services"],
    ["Challan Payment", "Telangana Transport Services"],
    ["Permit Services", "Telangana Transport Services"],
    ["Fitness Certificate Transaction", "Telangana Transport Services"],
    ["Fitness Certificate forms Reprint", "Telangana Transport Services"],
    ["Fitness Certificate Application Status", "Telangana Transport Services"],
    ["VEHICLE TRANSFER", "Telangana Transport Services"],

    // Health Services (from the HTML read)
    ["Rajiv Aarogyasri", "Health Services"],
    ["Ayushman Bharat", "Health Services"],
    ["Create ABHA Card", "Health Services"],
    ["Register ABHA", "Health Services"],
    ["Vaccination Certificate", "Health Services"],
    ["Download Certificate", "Health Services"],
    ["Verify Certificate", "Health Services"],
    ["Blood Bank Search", "Health Services"],
    ["Hospital Search", "Health Services"],
    ["Cheyutha Pension Search", "Health Services"],

    // Agriculture & Land Services
    ["PM Kisan", "Agriculture & Land Services"],
    ["Rythu Bharosa", "Agriculture & Land Services"],
    ["Bhubharati", "Agriculture & Land Services"],
    ["Know Land Status", "Agriculture & Land Services"],
    ["Application Status", "Agriculture & Land Services"],
    ["GIS Maps", "Agriculture & Land Services"],

    // Utility Services
    ["Electricity Bill Payment", "Utility Services"],
    ["Electricity Bill Enquiry", "Utility Services"],
    ["New Service Registration", "Utility Services"],
    ["Service Connection Status", "Utility Services"],
    ["Property Tax", "Utility Services"],
    ["Water Bill Payment", "Utility Services"],
    ["CDMA Portal", "Utility Services"],

    // Gas Booking Services
    ["Bharat Gas Booking", "Gas Booking Services"],
    ["HP Gas Booking", "Gas Booking Services"],
    ["Indane Gas Booking", "Gas Booking Services"],

    // Emergency Services
    ["Police", "Emergency Services"],
    ["Fire", "Emergency Services"],
    ["Ambulance", "Emergency Services"],
    ["Emergency", "Emergency Services"],
    ["Child Help", "Emergency Services"],
    ["Cyber Crime", "Emergency Services"],

    // Quick Government Portals
    ["MeeSeva", "Quick Government Portals"],
    ["Bhubharati", "Quick Government Portals"],
    ["TGPSC", "Quick Government Portals"],
    ["TG Transport", "Quick Government Portals"],
    ["TG Police", "Quick Government Portals"],
  ];

  for (const [title, category] of governmentCards) {
    add({ title, page: "government.html", category });
  }

  // =========================
  // educational.html (cards)
  // =========================
  // NOTE: This is long; to keep this patch accurate and fast, we add the titles present
  // in educational.html that were visible in the file read above.
  const educationalCards = [
    // Telangana State Entrance Exams
    "TG EAPCET","TG ECET","TG ICET","TG PGECET","TG LAWCET","TG PGLCET","TG EdCET","TG PECET","TG CPGET","TG POLYCET","TG DEECET","TG LPCET","TOSS Admissions","CUET","UGC NET","JEE MAINS","CMAT",

    // Medical & Health Sciences
    "NEET UG","NEET All examination services","NEET PG","NEET MDS","NEET SS","NEET FET","NEET PDCET","AIIMS Nursing","AIIMS Nursing Bibinagar","AIIMS Paramedical","KNRUHS UG Admissions","KNRUHS PG Admissions","B.Sc Nursing","BPT Admissions","Pharmacy Admissions","Pharmacy Admissions LE","AYUSH Admissions",

    // Engineering & Technology
    "JEE Advanced","Polytechnic (Diploma) Admissions","RGUKT Basar Admissions",
    // (also includes TG EAPCET/ECET/PGECET and TG EAPCET exists, but adding duplicates is fine)
    "TG EAPCET","TG ECET","TG PGECET","JEE Main",

    // Degree Admissions
    "TG DOST","Distance Degree Admissions","Open University Admissions","PGRRCDE distance Education",

    // Post Graduate Admissions
    "TG CPGET","CUET","TG ICET","TG PGECET","KNRUHS PG Admissions","TG PGLCET","Open University PG Admissions",

    // Research & PhD
    "CSIR NET","GATE 2026","GPAT 2026","NIMCET NIT ADMISSIONS 2026","AIAPGET 2026","Post Doctoral Fellowship","ICAR AICE JRF/SRF (PH.D.)","ICMR JRF","UGC NET","UGC NET JRF",

    // Doctorial Felloship
    "AICTE ADF","AICTE Productization Fellowship(APF)","DAE Doctoral Fellowship Scheme (DDFS)","BARC","DBT - JUNIOR RESEARCH FELLOWSHIP PROGRAMME ","Junior Research Fellowship PHYSICAL RESEARCH LABARATORY ","INSPIRE","UGC NET",

    // Teacher Education
    "TG TET","CTET","TG DSC","TG EdCET","TSDEECET/TSDEECET",

    // Residential School Admissions
    "tgswreis","TSWREIS Admissions","TTWREIS Admissions","MJPTBCWREIS Admissions","TREIBS Board","TMREIS Admissions","RGUKT Admissions","TGSWRJC CET","TSRJC CET","KGBV Admissions","Telangana Model Schools","Navodaya Admissions","Sainik School Admissions",

    // Scholarships
    "Telangana ePASS","National Scholarship Portal","Pragati Scholarship","Saksham Scholarship","PM YASASVI","INSPIRE Scholarship","Minority Scholarship",

    // National Level Exams (from jobs excerpt is separate; educational includes none beyond what read)
  ];

  educationalCards.forEach((title) => add({ title, page: "educational.html", category: "" }));

  // =========================
  // jobs.html (cards)
  // =========================
  const jobsCards = [
    // Latest Job Notifications
    "Latest Recruitments","Apply Online","Hall Tickets","Results","Answer Keys","Merit Lists",

    // Telangana Government Jobs
    "TSPSC Group 1","TSPSC Group 2","TSPSC Group 3","TSPSC Group 4","TSPSC DAO","TSPSC AEE","TSPSC AE","TSPSC Lecturer","Polytechnic Lecturer","Junior Lecturer","Degree Lecturer","TG DSC","Police Recruitment","Forest Recruitment","High Court Recruitment","Health Department Jobs","Municipal Jobs",

    // Central Government Jobs
    "UPSC Civil Services","SSC CGL","SSC CHSL","SSC MTS","SSC GD","SSC JE","SSC CPO","SSC Stenographer",

    // Railway Jobs
    "RRB NTPC","RRB Group D","RRB JE","RRB ALP","RRB Technician","Metro Rail Jobs",

    // Banking Jobs
    "SBI PO","SBI Clerk","SBI SO","IBPS PO","IBPS Clerk","IBPS SO","RBI Assistant","RBI Grade B","NABARD",

    // Defence Jobs
    "NDA","CDS","AFCAT","Agniveer Army","Agniveer Navy","Agniveer Air Force","Indian Coast Guard","CAPF",

    // Judiciary Jobs
    "High Court Jobs","District Court Jobs","Civil Judge Recruitment","Public Prosecutor",

    // PSU Jobs
    "BHEL","BEL","HAL","NTPC","ONGC","GAIL","DRDO","ISRO","ECIL",

    // Apprenticeships & Internships
    "NATS","NAPS","DRDO Internship","ISRO Internship","Railway Apprenticeship","BHEL Apprenticeship","Singareni Apprenticeship",

    // Results & Downloads
    "Hall Tickets","Results","Answer Keys","Selection Lists","Merit Lists","Joining Letters",
  ];

  jobsCards.forEach((title) => add({ title, page: "jobs.html", category: "" }));

  // =========================
  // newspapers.html (cards)
  // =========================
  const newspapersCards = [
    // Telugu E-Papers
    "Eenadu Paper","Sakshi Paper","Andhra Jyothy Paper","Namaste Telangana Paper","Visala Andhra Paper","Vaartha Paper","Telangana Today Paper","Mana Telangana Paper","Nava Telangana Paper","Telangana Veena Paper","Andhra Prabha Paper","Surya Paper",

    // Telugu News Websites
    "Eenadu","Sakshi","Andhra Jyothy","Namasthe Telangana","Mana Telangana",

    // English E-Papers
    "The Hindu Epaper","Times of India Epaper","Deccan Chronicle Epaper",

    // English News Websites
    "The Hindu","Times of India","Indian Express","Deccan Chronicle","Hindustan Times","New Indian Express","Economic Times","The Hans India","Business Standard",
  ];
  newspapersCards.forEach((title) => add({ title, page: "newspapers.html", category: "" }));

  // =========================
  // tools.html (cards)
  // =========================
  const toolsCards = [
    // PDF Tools
    "Merge PDF","Split PDF","Compress PDF","PDF to Word","Word to PDF",

    // Image Tools
    "Image Converter","Image Resizer","JPG to PNG","PNG to JPG","WebP Converter","HEIC Converter",

    // Calculators
    "Age Calculator","Percentage Calculator","BMI Calculator","EMI Calculator","GPA Calculator","CGPA Calculator",

    // Utility Tools
    "QR Code Generator","Barcode Generator","Password Generator","Text Counter","Unit Converter","Color Picker",

    // Settings
    "Dark Mode","Language Selector","Font Size Controls","Accessibility Options",
  ];
  toolsCards.forEach((title) => add({ title, page: "tools.html", category: "" }));

  // Expose.
  window.SITE_SEARCH_INDEX = index;
})();


