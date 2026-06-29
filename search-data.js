/*
  Global search database (static).
  Build once, then used by script.js + search.html.
*/

(function () {
  // Keep index deterministic and avoid duplicates.

  // Central normalized entries for searchable cards across the portal.
  // Each entry maps to a single card title on a single page.
  //
  // Fields:
  // - title: card title text
  // - page: html page containing the card
  // - category: section/category name (derived from page section)
  // - description: short description (if present in content/attributes)
  // - keywords: extra tokens for matching (title/category/keywords)

  const index = [];

  // =========================
  // index.html (homepage tiles)
  // =========================
  // Note: homepage tiles mostly don't have descriptions in markup.
  // We include keywords so matches like “ration” still work on correct page.
  index.push(
    { title: "Government Services Portal", page: "index.html", category: "Government Services Portal", description: "", keywords: "Government Services Portal" },
    { title: "Latest Updates", page: "index.html", category: "Government Services Portal", description: "", keywords: "Latest Updates" },
    { title: "TG EAPCET 2026", page: "index.html", category: "Latest Updates", description: "", keywords: "TG EAPCET 2026" },
    { title: "TG CPGET 2026", page: "index.html", category: "Latest Updates", description: "", keywords: "TG CPGET 2026" },
    { title: "DOST Admissions 2026", page: "index.html", category: "Latest Updates", description: "", keywords: "DOST Admissions 2026" },
    { title: "TG ITI Admissions 2026", page: "index.html", category: "Latest Updates", description: "", keywords: "TG ITI Admissions 2026" },

    { title: "Quick Access", page: "index.html", category: "Quick Access", description: "", keywords: "Quick Access" },

    { title: "Aadhaar", page: "index.html", category: "Quick Access", description: "", keywords: "Aadhaar" },
    { title: "PAN", page: "index.html", category: "Quick Access", description: "", keywords: "PAN" },
    { title: "Passport", page: "index.html", category: "Quick Access", description: "", keywords: "Passport" },
    { title: "Education", page: "index.html", category: "Quick Access", description: "", keywords: "Education" },
    { title: "Jobs", page: "index.html", category: "Quick Access", description: "", keywords: "Jobs" },
    { title: "Scholarships", page: "index.html", category: "Quick Access", description: "", keywords: "Scholarships" },

    { title: "Government Services", page: "index.html", category: "Government Services", description: "", keywords: "Government Services" },
    { title: "Aadhaar Services", page: "index.html", category: "Government Services", description: "", keywords: "Aadhaar Services Aadhaar" },
    { title: "PAN Services", page: "index.html", category: "Government Services", description: "", keywords: "PAN Services PAN" },
    { title: "Passport Services", page: "index.html", category: "Government Services", description: "", keywords: "Passport Services Passport" },
    { title: "MeeSeva Services", page: "index.html", category: "Government Services", description: "", keywords: "MeeSeva Services MeeSeva" },
    { title: "Bhubharati", page: "index.html", category: "Government Services", description: "", keywords: "Bhubharati" },
    { title: "Ration Card", page: "index.html", category: "Government Services", description: "", keywords: "Ration Card" },

    { title: "Education & Exams", page: "index.html", category: "Education & Exams", description: "", keywords: "Education & Exams" },
    { title: "TG EAPCET", page: "index.html", category: "Education & Exams", description: "", keywords: "TG EAPCET" },
    { title: "TG ECET", page: "index.html", category: "Education & Exams", description: "", keywords: "TG ECET" },
    { title: "TG ICET", page: "index.html", category: "Education & Exams", description: "", keywords: "TG ICET" },
    { title: "TG PGECET", page: "index.html", category: "Education & Exams", description: "", keywords: "TG PGECET" },
    { title: "TG CPGET", page: "index.html", category: "Education & Exams", description: "", keywords: "TG CPGET" },
    { title: "TG POLYCET", page: "index.html", category: "Education & Exams", description: "", keywords: "TG POLYCET" },

    { title: "Jobs & Recruitment", page: "index.html", category: "Jobs & Recruitment", description: "", keywords: "Jobs & Recruitment" },
    { title: "TSPSC", page: "index.html", category: "Jobs & Recruitment", description: "", keywords: "TSPSC" },
    { title: "TG DSC", page: "index.html", category: "Jobs & Recruitment", description: "", keywords: "TG DSC" },
    { title: "Police Jobs", page: "index.html", category: "Jobs & Recruitment", description: "", keywords: "Police Jobs" },
    { title: "SSC", page: "index.html", category: "Jobs & Recruitment", description: "", keywords: "SSC" },
    { title: "UPSC", page: "index.html", category: "Jobs & Recruitment", description: "", keywords: "UPSC" },
    { title: "Railways", page: "index.html", category: "Jobs & Recruitment", description: "", keywords: "Railways" },

    { title: "News Papers", page: "index.html", category: "News Papers", description: "", keywords: "News Papers" },
    { title: "Eenadu", page: "index.html", category: "News Papers", description: "", keywords: "Eenadu" },
    { title: "Sakshi", page: "index.html", category: "News Papers", description: "", keywords: "Sakshi" },
    { title: "Andhra Jyothy", page: "index.html", category: "News Papers", description: "", keywords: "Andhra Jyothy" },
    { title: "Namaste Telangana", page: "index.html", category: "News Papers", description: "", keywords: "Namaste Telangana" },
    { title: "The Hindu", page: "index.html", category: "News Papers", description: "", keywords: "The Hindu" },
    { title: "Times of India", page: "index.html", category: "News Papers", description: "", keywords: "Times of India" },

    { title: "Useful Tools", page: "index.html", category: "Useful Tools", description: "", keywords: "Useful Tools" },
    { title: "PDF Tools", page: "index.html", category: "Useful Tools", description: "", keywords: "PDF Tools" },
    { title: "Image Tools", page: "index.html", category: "Useful Tools", description: "", keywords: "Image Tools" },
    { title: "QR Generator", page: "index.html", category: "Useful Tools", description: "", keywords: "QR Generator" },
    { title: "Password Generator", page: "index.html", category: "Useful Tools", description: "", keywords: "Password Generator" },
    { title: "Age Calculator", page: "index.html", category: "Useful Tools", description: "", keywords: "Age Calculator" },
    { title: "Percentage Calculator", page: "index.html", category: "Useful Tools", description: "", keywords: "Percentage Calculator" }
  );

  // =========================
  // government.html (cards)
  // =========================
  // Aadhaar
  index.push(
    { title: "UIDAI", page: "government.html", category: "Aadhaar Services", description: "", keywords: "UIDAI Aadhaar" },
    { title: "My Aadhaar", page: "government.html", category: "Aadhaar Services", description: "", keywords: "My Aadhaar" },
    { title: "Aadhaar Update", page: "government.html", category: "Aadhaar Services", description: "", keywords: "Aadhaar Update" },
    { title: "Download Aadhaar", page: "government.html", category: "Aadhaar Services", description: "", keywords: "Download Aadhaar" },
    { title: "Order PVC Aadhaar", page: "government.html", category: "Aadhaar Services", description: "", keywords: "Order PVC Aadhaar" },
    { title: "Check Aadhaar Status", page: "government.html", category: "Aadhaar Services", description: "", keywords: "Check Aadhaar Status" },
    { title: "Aadhaar Validity", page: "government.html", category: "Aadhaar Services", description: "", keywords: "Aadhaar Validity" },
    { title: "Report Death", page: "government.html", category: "Aadhaar Services", description: "", keywords: "Report Death" }
  );

  // PAN
  index.push(
    { title: "PAN Apply", page: "government.html", category: "PAN Services", description: "", keywords: "PAN Apply" },
    { title: "Download e-PAN", page: "government.html", category: "PAN Services", description: "", keywords: "Download e-PAN ePAN" },
    { title: "Reprint PAN Card", page: "government.html", category: "PAN Services", description: "", keywords: "Reprint PAN Card" },
    { title: "PAN Status", page: "government.html", category: "PAN Services", description: "", keywords: "PAN Status" }
  );

  // Passport
  index.push(
    { title: "Passport Seva", page: "government.html", category: "Passport Services", description: "", keywords: "Passport Seva" },
    { title: "Passport Application", page: "government.html", category: "Passport Services", description: "", keywords: "Passport Application" },
    { title: "Tatkaal Passport", page: "government.html", category: "Passport Services", description: "", keywords: "Tatkaal Passport" },
    { title: "e-Passport", page: "government.html", category: "Passport Services", description: "", keywords: "e-Passport" },
    { title: "Identity Certificate", page: "government.html", category: "Passport Services", description: "", keywords: "Identity Certificate" },
    { title: "Track Application", page: "government.html", category: "Passport Services", description: "", keywords: "Track Application" },
    { title: "Book Appointment", page: "government.html", category: "Passport Services", description: "", keywords: "Book Appointment" }
  );

  // Food & Civil Supplies
  index.push(
    { title: "Ration Card Download", page: "government.html", category: "Food & Civil Supplies", description: "", keywords: "Ration Card Download ration card" },
    { title: "Food Security Card Search", page: "government.html", category: "Food & Civil Supplies", description: "", keywords: "Food Security Card Search fsc" },
    { title: "Deepam Card Search", page: "government.html", category: "Food & Civil Supplies", description: "", keywords: "Deepam Card Search deepam" },
    { title: "NFSA List", page: "government.html", category: "Food & Civil Supplies", description: "", keywords: "NFSA List" },
    { title: "New Ration Card Apply", page: "government.html", category: "Food & Civil Supplies", description: "", keywords: "New Ration Card Apply ration apply" },
    { title: "Card Corrections", page: "government.html", category: "Food & Civil Supplies", description: "", keywords: "Card Corrections" },
    { title: "Download FSC Card", page: "government.html", category: "Food & Civil Supplies", description: "", keywords: "Download FSC Card FSC" }
  );

  // Transport Services (partial set required for better matches)
  index.push(
    { title: "Driving Licence", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "Driving Licence" },
    { title: "Learner Licence", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "Learner Licence" },
    { title: "LL Slot Booking", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "LL Slot Booking" },
    { title: "LL Receipt Reprint", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "LL Receipt Reprint" },
    { title: "DL Slot Booking", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "DL Slot Booking" },
    { title: "Application Status", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "Application Status" },
    { title: "Licence Search", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "Licence Search" },
    { title: "PUCC Certificate", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "PUCC Certificate" },
    { title: "Vehicle Search", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "Vehicle Search" },
    { title: "Vehicle Registration", page: "government.html", category: "Telangana Transport Services", description: "", keywords: "Vehicle Registration" }
  );

  // Emergency (important for “police/fire/ambulance”) - maps to government.html cards
  index.push(
    { title: "Police - 100", page: "government.html", category: "Emergency Services", description: "Police 100", keywords: "police 100 emergency 100 police 100" },
    { title: "Fire - 101", page: "government.html", category: "Emergency Services", description: "Fire 101", keywords: "fire 101 emergency 101 fire 101" },
    { title: "Ambulance - 102", page: "government.html", category: "Emergency Services", description: "Ambulance 102 / 108", keywords: "ambulance 102 108 emergency ambulance 102" },
    { title: "Emergency - 108", page: "government.html", category: "Emergency Services", description: "Emergency 108", keywords: "emergency 108 emergency 108" },
    { title: "Child Help - 1098", page: "government.html", category: "Emergency Services", description: "Child Helpline 1098", keywords: "child help 1098 1098 child helpline 1098" },
    { title: "Cyber Crime - 1930", page: "government.html", category: "Emergency Services", description: "Cyber Crime 1930", keywords: "cyber crime 1930 report fraud 1930" }
  );


  // =========================
  // educational.html (partial set)
  // =========================
  index.push(
    { title: "TG EAPCET", page: "educational.html", category: "Telangana State Entrance Exams", description: "", keywords: "TG EAPCET eapcet" },
    { title: "TG CPGET", page: "educational.html", category: "Post Graduate Admissions", description: "", keywords: "TG CPGET" },
    { title: "NEET UG", page: "educational.html", category: "Medical & Health Sciences", description: "", keywords: "NEET UG" },
    { title: "NEET PG", page: "educational.html", category: "Medical & Health Sciences", description: "", keywords: "NEET PG" },
    { title: "UGC NET", page: "educational.html", category: "Research & PhD", description: "", keywords: "UGC NET" }
  );

  // =========================
  // jobs.html (partial set)
  // =========================
  index.push(
    { title: "TSPSC Group 1", page: "jobs.html", category: "Telangana Government Jobs", description: "", keywords: "TSPSC Group 1" },
    { title: "SSC CGL", page: "jobs.html", category: "Central Government Jobs", description: "", keywords: "SSC CGL" },
    { title: "UPSC Civil Services", page: "jobs.html", category: "Central Government Jobs", description: "", keywords: "UPSC" }
  );

  // =========================
  // newspapers.html (partial set)
  // =========================
  index.push(
    { title: "Eenadu Paper", page: "newspapers.html", category: "Telugu E-Papers", description: "", keywords: "Eenadu" },
    { title: "Sakshi Paper", page: "newspapers.html", category: "Telugu E-Papers", description: "", keywords: "Sakshi" },
    { title: "Andhra Jyothy Paper", page: "newspapers.html", category: "Telugu E-Papers", description: "", keywords: "Andhra Jyothy" },
    { title: "Namaste Telangana Paper", page: "newspapers.html", category: "Telugu E-Papers", description: "", keywords: "Namaste Telangana" },
    { title: "The Hindu", page: "newspapers.html", category: "English News Websites", description: "", keywords: "The Hindu" }
  );

  // =========================
  // tools.html (partial set)
  // =========================
  index.push(
    { title: "PDF Tools", page: "tools.html", category: "Useful Tools", description: "", keywords: "PDF Tools" },
    { title: "Image Tools", page: "tools.html", category: "Useful Tools", description: "", keywords: "Image Tools" },
    { title: "Password Generator", page: "tools.html", category: "Utility Tools", description: "", keywords: "Password Generator" },
    { title: "QR Code Generator", page: "tools.html", category: "Utility Tools", description: "", keywords: "QR Code Generator QR" },
    { title: "Age Calculator", page: "tools.html", category: "Calculators", description: "", keywords: "Age Calculator" }
  );

  // Expose.
  window.SITE_SEARCH_INDEX = index;
})();

