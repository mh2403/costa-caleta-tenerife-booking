export type Language = 'en' | 'nl' | 'es';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    booking: string;
    contact: string;
    admin: string;
  };
  // Hero section
  hero: {
    title: string;
    subtitle: string;
    checkAvailability: string;
    bookNow: string;
    fromPrice: string;
    perNight: string;
    trustItems: string[];
    imageAlt: string;
  };
  // CTA section
  cta: {
    title: string;
    subtitle: string;
    eyebrow: string;
    trustItems: string[];
  };
  journey: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: {
      title: string;
      description: string;
    }[];
    primaryCta: string;
    secondaryCta: string;
  };
  // Gallery
  gallery: {
    filterAll: string;
    filterApartment: string;
    filterTenerife: string;
    loadMore: string;
    imageAlts: string[];
  };
  // Facilities
  facilities: {
    title: string;
    subtitle: string;
    wifi: string;
    kitchen: string;
    aircon: string;
    washing: string;
    tv: string;
    balcony: string;
    parking: string;
    pool: string;
    beach: string;
    towels: string;
  };
  // Location
  location: {
    title: string;
    subtitle: string;
    region: string;
    description: string;
    highlights: { label: string; desc: string }[];
  };
  // Testimonials
  testimonials: {
    title: string;
    subtitle: string;
  };
  // Booking
  booking: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    guestsCount: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    messagePlaceholder: string;
    next: string;
    back: string;
    submit: string;
    priceBreakdown: string;
    nights: string;
    cleaningFee: string;
    total: string;
    selectDates: string;
    unavailable: string;
    available: string;
    confirmationTitle: string;
    confirmationMessage: string;
    disclaimer: string;
    whatsappNote: string;
    helpWhatsapp: string;
    minStayNote: string;
    minStayError: string;
    invalidDates: string;
    unavailableRange: string;
    requiredFields: string;
    submitError: string;
    paymentTitle: string;
    paymentIntro: string;
    paymentDepositLabel: string;
    paymentDepositHelp: string;
    remainingBalanceLabel: string;
    paymentLabelAccount: string;
    paymentLabelIban: string;
    paymentLabelBic: string;
    paymentLabelReference: string;
    paymentFlowTitle: string;
    paymentFlowSteps: string[];
    paymentDetailAccount: string;
    paymentDetailIban: string;
    paymentDetailBic: string;
    paymentDetailReference: string;
    paymentNote: string;
    whatsappBookingCta: string;
    whatsappBookingHint: string;
    whatsappBookingMessage: string;
    checkInTime: string;
    checkOutTime: string;
  };
  // Contact
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    responseTime: string;
    sendMessage: string;
    yourName: string;
    yourEmail: string;
    yourPhone: string;
    yourMessage: string;
    send: string;
    whatsapp: string;
    successTitle: string;
    successBody: string;
    requiredFields: string;
    helperText: string;
    trustItems: string[];
    locationLabel: string;
    mapCardTitle: string;
    mapCardDescription: string;
    mapLoadButton: string;
    mapOpenExternal: string;
    mapEmbedTitle: string;
    address: string;
  };
  // Footer
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    instructions: string;
    quickLinks: string;
    directBooking: string;
    whatsappLabel: string;
  };
  // Privacy policy
  privacy: {
    title: string;
    updated: string;
    intro: string;
    sections: { title: string; body?: string; list?: string[] }[];
  };
  // Terms
  terms: {
    title: string;
    updated: string;
    intro: string;
    sections: { title: string; body?: string; list?: string[] }[];
  };
  // Instructions
  instructions: {
    title: string;
    subtitle: string;
    videoLabel: string;
  };
  // Admin
  admin: {
    dashboard: string;
    bookings: string;
    pricing: string;
    availability: string;
    messages: string;
    content: string;
    settings: string;
    logout: string;
    pending: string;
    confirmed: string;
    declined: string;
    cancelled: string;
    confirmBooking: string;
    declineBooking: string;
    guestDetails: string;
    seasonalPricing: string;
    addSeason: string;
    basePriceLabel: string;
    seasonName: string;
    startDate: string;
    endDate: string;
    pricePerNight: string;
    save: string;
    cancel: string;
    deleteConfirm: string;
    blockDates: string;
    unblockDates: string;
    login: string;
    password: string;
    invalidCredentials: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    close: string;
    viewDetails: string;
    noResults: string;
  };
  notFound: {
    title: string;
    backHome: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      booking: 'Book Now',
      contact: 'Contact',
      admin: 'Admin',
    },
    hero: {
      title: 'Escape to the sun of Tenerife',
      subtitle: 'Book directly — no platforms, no extra fees. Experience the warmth of the Canary Islands.',
      checkAvailability: 'View Gallery',
      bookNow: 'Book Now',
      fromPrice: 'From',
      perNight: '/ night',
      trustItems: [
        'Direct booking, no platform fees',
        'Prime La Caleta location',
        'Fast host response',
      ],
      imageAlt: 'Breakfast table with ocean view in La Caleta',
    },
    cta: {
      title: 'Ready for Your Tenerife Escape?',
      subtitle: 'Book directly with us for the best rates. No hidden fees, no middlemen — just your perfect vacation home.',
      eyebrow: 'Costa Caleta Tenerife',
      trustItems: [
        'Prime La Caleta location',
        'Direct booking, no hidden fees',
        'Fast host response',
      ],
    },
    journey: {
      eyebrow: 'How It Works',
      title: 'From first click to check-in in three clear steps',
      subtitle: 'A cleaner flow with less friction, so guests can decide and book faster.',
      steps: [
        {
          title: 'Choose your dates',
          description: 'Check availability and send your booking request in just a few clicks.',
        },
        {
          title: 'Receive confirmation',
          description: 'We confirm quickly and share the practical details for your stay.',
        },
        {
          title: 'Arrive and enjoy',
          description: 'Meet & greet on site, then start your Tenerife stay stress-free.',
        },
      ],
      primaryCta: 'Start booking',
      secondaryCta: 'Ask a question',
    },
    gallery: {
      filterAll: 'All',
      filterApartment: 'Apartment',
      filterTenerife: 'Tenerife',
      loadMore: 'Load more photos',
      imageAlts: [
        'Balcony breakfast setup',
        'Breakfast with mountain view',
        'Bedroom',
        'Living room and kitchen',
        'Living room view from the terrace',
        'Bathroom with vanity',
        'Bathroom with shower',
        'Dining area',
        'Pool',
        'Pool view',
        'Poolside at the residence',
        'Pool terrace at sunset',
        'Sunset at the beach',
        'Coastline view of Tenerife',
        'Scenic road in Tenerife',
      ],
    },
    facilities: {
      title: 'Amenities & Facilities',
      subtitle: 'Everything you need for a comfortable stay',
      wifi: 'Wi-Fi',
      kitchen: 'Fully equipped kitchen',
      aircon: 'Nespresso, kettle, toaster & juicer',
      washing: 'Washing machine + drying rack',
      tv: 'TV',
      balcony: 'Sunny terrace with sea & mountain views',
      parking: 'Street parking / plaza (50 m)',
      pool: 'Shared pool + sun loungers',
      beach: 'La Caleta bay',
      towels: 'Linens & towels included',
    },
    location: {
      title: 'Prime Location in La Caleta',
      subtitle: 'In the bay of La Caleta, Adeje',
      region: 'La Caleta • Adeje',
      description: `Located in the Costa Caleta residence in La Caleta (Adeje), on the 4th floor. There are 2 lifts and a shared pool with sun loungers. Beautifully renovated 1-bedroom apartment with a sunny terrace, sea views and mountain views.
Very well located, close to supermarket, restaurants, bars, shops, nature and Adeje Golf. From the apartment you can take the promenade to Los Cristianos, or through nature towards El Puertito or Playa Paraiso.

Apartment includes:
- Living room with sunny terrace and sea view, TV and Wi-Fi.
- Kitchen with fridge, freezer, induction hob, microwave, oven and dishwasher.
- Nespresso machine, kettle, toaster, juicer.
- Iron, ironing board and vacuum cleaner.
- Bathroom with walk-in shower, toilet, hairdryer, styler and window.
- Bedroom with king bed (1.80 x 2m), built-in wardrobe and terrace.
- Terrace with drying rack and washing machine.

Practical:
- Bed linen and towels included.
- Utilities (electricity and internet) included.
- Meet & greet, key handover on site.
- Check-in after 15:00, check-out before 12:00.
- Parking on the street or a square 50 m away.`,
      highlights: [
        { label: 'Nearby', desc: 'Supermarket & shops' },
        { label: 'Nearby', desc: 'Restaurants & bars' },
        { label: 'Promenade', desc: 'Los Cristianos' },
        { label: 'Nature', desc: 'El Puertito / Playa Paraiso' },
      ],
    },
    testimonials: {
      title: 'Guest Experiences',
      subtitle: 'What our guests say about their stay',
    },
    booking: {
      title: 'Book Your Stay',
      subtitle: 'Simple booking, no account required',
      step1: 'Select Dates',
      step2: 'Your Details',
      step3: 'Confirm',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      guestsCount: 'guest(s)',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      message: 'Message (optional)',
      messagePlaceholder: 'Any special requests or questions?',
      next: 'Next',
      back: 'Back',
      submit: 'Submit Booking Request',
      priceBreakdown: 'Price Breakdown',
      nights: 'nights',
      cleaningFee: 'Cleaning Fee',
      total: 'Total',
      selectDates: 'Please select your dates',
      unavailable: 'Unavailable',
      available: 'Available',
      confirmationTitle: 'Booking Request Sent!',
      confirmationMessage: 'Thank you for your booking request. We will confirm your reservation shortly.',
      disclaimer: 'This is a booking request. Availability will be confirmed within 24 hours. Meet & greet on arrival; keys handed over on site. Check-in from 15:00, check-out before 12:00.',
      whatsappNote: 'Need to modify your booking?\nContact us via WhatsApp.',
      helpWhatsapp: 'Questions? Feel free to contact us via WhatsApp.',
      minStayNote: 'Minimum stay: {n} night(s)',
      minStayError: 'Minimum stay is {n} night(s) for the selected dates.',
      invalidDates: 'Please select at least one night.',
      unavailableRange: 'Selected dates include unavailable days. Please choose another range.',
      requiredFields: 'Please fill in all required fields.',
      submitError: 'Failed to submit booking. Please try again.',
      paymentTitle: 'Payment by bank transfer',
      paymentIntro: 'To secure your dates, we ask for a €100 deposit after your booking request.',
      paymentDepositLabel: 'Deposit to secure booking',
      paymentDepositHelp: 'Please transfer this amount right after submitting your booking request.',
      remainingBalanceLabel: 'Remaining balance after deposit',
      paymentLabelAccount: 'Account holder',
      paymentLabelIban: 'IBAN',
      paymentLabelBic: 'BIC/SWIFT',
      paymentLabelReference: 'Reference',
      paymentFlowTitle: 'How your booking is finalized',
      paymentFlowSteps: [
        'Submit your booking request through this form.',
        'Transfer the €100 deposit to the bank account below.',
        'Send a WhatsApp message once your booking request and deposit are sent.',
        'The owner replies on WhatsApp and prepares the official contract.',
        'Both parties review and sign the contract.',
        'After signing, transfer the remaining balance by bank transfer.',
      ],
      paymentDetailAccount: 'Account name: [add later]',
      paymentDetailIban: 'IBAN: [add later]',
      paymentDetailBic: 'BIC/SWIFT: [add later]',
      paymentDetailReference: 'Reference: Your name + dates',
      paymentNote: 'Your booking is only final after the contract is signed and the full amount is received.',
      whatsappBookingCta: 'I placed a booking and paid the deposit — continue via WhatsApp',
      whatsappBookingHint: 'Send this message after your transfer so we can finalize your file quickly.',
      whatsappBookingMessage: 'Hi, I just placed a booking request for Costa Caleta.\nName: {name}\nDates: {checkIn} - {checkOut}\nDeposit paid: {deposit}\nTotal booking amount: {total}\nPlease send the contract. Thank you!',
      checkInTime: 'Check-in time',
      checkOutTime: 'Check-out time',
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'We\'re here to help with any questions',
      phone: 'Phone',
      email: 'Email',
      responseTime: 'We respond within 24 hours',
      sendMessage: 'Send us a message',
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      yourPhone: 'Your Phone (optional)',
      yourMessage: 'Your Message',
      send: 'Send Message',
      whatsapp: 'Chat on WhatsApp',
      successTitle: 'Message sent!',
      successBody: 'We will get back to you within 24 hours.',
      requiredFields: 'Please fill in all required fields.',
      helperText: 'Choose your preferred way to get in touch.',
      trustItems: ['Direct contact', 'No platform fees', 'Top-rated area'],
      locationLabel: 'Location',
      mapCardTitle: 'Interactive map',
      mapCardDescription: 'Google Maps content is only loaded after you choose to display it.',
      mapLoadButton: 'Load map',
      mapOpenExternal: 'Open in Google Maps',
      mapEmbedTitle: 'Costa Caleta map',
      address: 'Costa Adeje, Tenerife, Canary Islands',
    },
    footer: {
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      instructions: 'Instructions',
      quickLinks: 'Quick links',
      directBooking: 'Direct booking in La Caleta',
      whatsappLabel: 'WhatsApp',
    },
    privacy: {
      title: 'Privacy Policy',
      updated: 'Last updated: February 14, 2026',
      intro: 'This policy explains how we process personal data when you visit the Costa Caleta website, submit a booking request, or contact us.',
      sections: [
        {
          title: 'Who we are',
          body: 'Costa Caleta is a private holiday rental in La Caleta, Tenerife. We act as the data controller. Contact: {email}, {phone}.',
        },
        {
          title: 'What data we collect',
          list: [
            'Identification and contact details you provide (name, email, phone).',
            'Booking details (dates, number of guests, messages).',
            'Payment follow-up data related to your booking (deposit status, remaining balance status, reference and internal notes).',
            'Contract progress data related to your booking (contract sent/signed status).',
            'Communications and inquiries you send us, including WhatsApp messages if you contact us there.',
            'Technical data needed to operate the site (IP address, browser/device, log data).',
          ],
        },
        {
          title: 'Why we use your data (legal basis)',
          list: [
            'To respond to inquiries, process booking requests, and manage deposit/contract steps (contract/steps prior to contract).',
            'To send booking-related communications, including via WhatsApp when chosen by you (contract/legitimate interest).',
            'To comply with legal obligations (accounting, tax, security).',
            'To protect and improve our services (legitimate interests).',
          ],
        },
        {
          title: 'Sharing',
          body: 'We do not sell your data. We share it only with service providers that help operate the website and booking communications (hosting, email, messaging tools), and with parties needed for legal/accounting administration when required, or when required by law.',
        },
        {
          title: 'Retention',
          body: 'We keep data only as long as necessary for the purposes above. Booking, contract, and payment records may be retained to meet legal and accounting obligations.',
        },
        {
          title: 'Your rights',
          list: [
            'Access, rectification, erasure, restriction.',
            'Objection and data portability.',
            'Withdraw consent where applicable.',
            'Lodge a complaint with your local supervisory authority.',
          ],
        },
        {
          title: 'Cookies & local storage',
          body: 'We use essential cookies and local storage to remember your language preference and ensure the site works.',
        },
        {
          title: 'International transfers',
          body: 'If data is processed outside the EEA, we rely on appropriate safeguards such as standard contractual clauses.',
        },
        {
          title: 'Security',
          body: 'We take reasonable technical and organizational measures to protect your data, but no system is 100% secure.',
        },
        {
          title: 'Contact',
          body: 'For privacy questions or requests, contact us at {email} or {phone}.',
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      updated: 'Last updated: February 14, 2026',
      intro: 'By using this website and submitting a booking request, you agree to these terms.',
      sections: [
        {
          title: 'Booking requests & confirmation',
          body: 'Submitting the booking form is a request. To reserve dates, a €100 deposit is required after the request. A reservation becomes final only after the contract is signed by both parties and the full amount is received.',
        },
        {
          title: 'Pricing & payment',
          list: [
            'Prices are shown in EUR and may include a cleaning fee as displayed.',
            'Payment is by bank transfer.',
            'A €100 deposit is required to block your requested dates.',
            'After paying the deposit, the guest sends a WhatsApp message to confirm payment.',
            'After contract signing, the remaining balance is paid by bank transfer under the terms stated in the contract.',
          ],
        },
        {
          title: 'Contract & communication',
          body: 'After the deposit and WhatsApp notification, the owner sends the official contract. Both parties must review and sign the contract. Booking follow-up can take place by WhatsApp and email.',
        },
        {
          title: 'Check-in / check-out',
          body: 'Check-in is after 15:00 and check-out is before 12:00, unless agreed otherwise.',
        },
        {
          title: 'Use of the property',
          body: 'Guests must use the apartment with care, respect neighbors and building rules, and follow the occupancy stated in the booking.',
        },
        {
          title: 'Damages',
          body: 'Guests are responsible for damage caused during their stay. Costs may be charged after assessment.',
        },
        {
          title: 'Cancellations',
          body: 'Cancellation and refund terms are defined in the official contract. If you cancel before deposit payment and before contract processing starts, no final reservation has been completed.',
        },
        {
          title: 'Liability',
          body: 'We are not liable for loss of personal belongings or disruptions outside our control (e.g. utilities or force majeure), except where liability cannot be excluded by law.',
        },
        {
          title: 'Contact',
          body: 'Questions about these terms? Contact us at {email} or {phone}.',
        },
      ],
    },
    instructions: {
      title: 'Instructions',
      subtitle: 'Video guide for using the TV in the apartment.',
      videoLabel: 'TV Instruction Video',
    },
    admin: {
      dashboard: 'Dashboard',
      bookings: 'Bookings',
      pricing: 'Pricing',
      availability: 'Availability',
      messages: 'Messages',
      content: 'Content',
      settings: 'Settings',
      logout: 'Logout',
      pending: 'Pending',
      confirmed: 'Confirmed',
      declined: 'Declined',
      cancelled: 'Cancelled',
      confirmBooking: 'Confirm Booking',
      declineBooking: 'Decline Booking',
      guestDetails: 'Guest Details',
      seasonalPricing: 'Seasonal Pricing',
      addSeason: 'Add Season',
      basePriceLabel: 'Base Price (per night)',
      seasonName: 'Season Name',
      startDate: 'Start Date',
      endDate: 'End Date',
      pricePerNight: 'Price per Night',
      save: 'Save',
      cancel: 'Cancel',
      deleteConfirm: 'Are you sure you want to delete this?',
      blockDates: 'Block Dates',
      unblockDates: 'Unblock Dates',
      login: 'Admin Login',
      password: 'Password',
      invalidCredentials: 'Invalid credentials',
    },
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      success: 'Success!',
      close: 'Close',
      viewDetails: 'View Details',
      noResults: 'No results found',
    },
    notFound: {
      title: 'Oops! Page not found',
      backHome: 'Return to Home',
    },
  },
  nl: {
    nav: {
      home: 'Home',
      booking: 'Boeken',
      contact: 'Contact',
      admin: 'Beheer',
    },
    hero: {
      title: 'Ontsnap naar de zon van Tenerife',
      subtitle: 'Boek direct — geen platforms, geen extra kosten. Ervaar de warmte van de Canarische Eilanden.',
      checkAvailability: "Bekijk foto's",
      bookNow: 'Nu Boeken',
      fromPrice: 'Vanaf',
      perNight: '/ nacht',
      trustItems: [
        'Direct boeken, geen platformkosten',
        'Toplocatie in La Caleta',
        'Snelle reactie van host',
      ],
      imageAlt: 'Ontbijttafel met oceaanzicht in La Caleta',
    },
    cta: {
      title: 'Klaar voor uw Tenerife-escape?',
      subtitle: 'Boek direct bij ons voor de beste tarieven. Geen verborgen kosten, geen tussenpersonen — gewoon uw perfecte vakantieverblijf.',
      eyebrow: 'Costa Caleta Tenerife',
      trustItems: [
        'Toplocatie in La Caleta',
        'Direct boeken, geen verborgen kosten',
        'Snelle reactie van host',
      ],
    },
    journey: {
      eyebrow: 'Hoe Het Werkt',
      title: 'Van eerste klik tot check-in in drie heldere stappen',
      subtitle: 'Een duidelijke flow met minder frictie, zodat gasten sneller beslissen en boeken.',
      steps: [
        {
          title: 'Kies uw data',
          description: 'Controleer de beschikbaarheid en stuur uw boekingsaanvraag in enkele klikken.',
        },
        {
          title: 'Ontvang bevestiging',
          description: 'Wij bevestigen snel en delen alle praktische informatie voor uw verblijf.',
        },
        {
          title: 'Aankomen en genieten',
          description: 'Meet & greet ter plaatse en daarna zorgeloos genieten van Tenerife.',
        },
      ],
      primaryCta: 'Start met boeken',
      secondaryCta: 'Stel een vraag',
    },
    gallery: {
      filterAll: 'Alles',
      filterApartment: 'Appartement',
      filterTenerife: 'Tenerife',
      loadMore: "Meer foto's laden",
      imageAlts: [
        'Balkon met ontbijt',
        'Ontbijt met bergzicht',
        'Slaapkamer',
        'Woonkamer en keuken',
        'Woonkamerzicht vanaf het terras',
        'Badkamer met wastafel',
        'Badkamer met douche',
        'Eethoek',
        'Zwembad',
        'Zicht op het zwembad',
        'Zwembadgedeelte van de residentie',
        'Zwembadterras bij zonsondergang',
        'Zonsondergang op het strand',
        'Kustzicht op Tenerife',
        'Scenische weg op Tenerife',
      ],
    },
    facilities: {
      title: 'Voorzieningen & Faciliteiten',
      subtitle: 'Alles wat u nodig heeft voor een comfortabel verblijf',
      wifi: 'WiFi',
      kitchen: 'Volledig uitgeruste keuken',
      aircon: 'Nespresso, waterkoker, broodrooster & fruitpers',
      washing: 'Wasmachine + droogrek',
      tv: 'TV',
      balcony: 'Zonnig terras met zee- en bergzicht',
      parking: 'Parkeren op straat/plein (50 m)',
      pool: 'Gemeenschappelijk zwembad + ligstoelen',
      beach: 'In de baai van La Caleta',
      towels: 'Linnen & handdoeken inbegrepen',
    },
    location: {
      title: 'Toplocatie in La Caleta',
      subtitle: 'In de baai van La Caleta, Adeje',
      region: 'La Caleta • Adeje',
      description: `Gelegen in residentie Costa Caleta in La Caleta (Adeje), op de 4de verdieping. Er zijn 2 liften en een gemeenschappelijk zwembad met ligstoelen. Prachtig nieuw gerenoveerd 1 slaapkamer appartement met zonnig terras, zeezicht en zicht op de bergen.
Zeer goed gelegen, dichtbij supermarkt, restaurants, bars, winkels, de natuur en Adeje Golf. Vanaf het appartement kan u de promenade nemen tot aan Los Cristianos, of door de natuur richting El Puertito of Playa Paraiso.

Appartement bevat:
- Woonkamer met zonnig terras en zeezicht, tv en wifi.
- Keuken met frigo, vriezer, inductie kookplaat, microgolf, oven en afwasmachine.
- Nespresso machine, waterkoker, broodrooster, fruitpers.
- Strijkijzer, strijkplank en stofzuiger.
- Badkamer met inloopdouche, wc, haardroger, styletang en raam.
- Slaapkamer met groot bed (1.80 x 2m), ingemaakte kast en terras.
- Terras met droogrek en wasmachine.

Praktisch:
- Lakens en badhanddoeken inbegrepen.
- Nutsvoorzieningen (elektriciteit en internet) inbegrepen.
- Meet & greet, sleuteloverhandiging ter plaatse.
- Aankomst na 15u, vertrek voor 12u.
- Parkeren op straat of op een plein op 50m afstand.`,
      highlights: [
        { label: 'Dichtbij', desc: 'Supermarkt & winkels' },
        { label: 'Dichtbij', desc: 'Restaurants & bars' },
        { label: 'Promenade', desc: 'Los Cristianos' },
        { label: 'Natuur', desc: 'El Puertito / Playa Paraiso' },
      ],
    },
    testimonials: {
      title: 'Gastervaringen',
      subtitle: 'Wat onze gasten zeggen over hun verblijf',
    },
    booking: {
      title: 'Boek Uw Verblijf',
      subtitle: 'Eenvoudig boeken, geen account nodig',
      step1: 'Selecteer Data',
      step2: 'Uw Gegevens',
      step3: 'Bevestigen',
      checkIn: 'Inchecken',
      checkOut: 'Uitchecken',
      guests: 'Gasten',
      guestsCount: 'gast(en)',
      fullName: 'Volledige Naam',
      email: 'E-mailadres',
      phone: 'Telefoonnummer',
      message: 'Bericht (optioneel)',
      messagePlaceholder: 'Speciale verzoeken of vragen?',
      next: 'Volgende',
      back: 'Terug',
      submit: 'Boekingsverzoek Indienen',
      priceBreakdown: 'Prijsoverzicht',
      nights: 'nachten',
      cleaningFee: 'Schoonmaakkosten',
      total: 'Totaal',
      selectDates: 'Selecteer uw data',
      unavailable: 'Niet beschikbaar',
      available: 'Beschikbaar',
      confirmationTitle: 'Boekingsverzoek Verzonden!',
      confirmationMessage: 'Bedankt voor uw boekingsverzoek. Wij bevestigen uw reservering zo spoedig mogelijk.',
      disclaimer: 'Dit is een boekingsverzoek. Beschikbaarheid wordt binnen 24 uur bevestigd. Meet & greet ter plaatse; sleuteloverhandiging bij aankomst. Aankomst vanaf 15u, vertrek voor 12u.',
      whatsappNote: 'Wilt u uw boeking wijzigen?\nNeem contact op via WhatsApp.',
      helpWhatsapp: 'Vragen? Aarzel niet contact op te nemen via WhatsApp.',
      minStayNote: 'Minimum verblijf: {n} nacht(en)',
      minStayError: 'Minimum verblijf is {n} nacht(en) voor de geselecteerde data.',
      invalidDates: 'Selecteer minstens één nacht.',
      unavailableRange: 'De geselecteerde data bevatten niet-beschikbare dagen. Kies een andere periode.',
      requiredFields: 'Vul alle verplichte velden in.',
      submitError: 'Boeking versturen mislukt. Probeer het opnieuw.',
      paymentTitle: 'Betaling via bankoverschrijving',
      paymentIntro: 'Om uw data vast te leggen, vragen we na uw boekingsaanvraag eerst een voorschot van €100.',
      paymentDepositLabel: 'Voorschot om boeking vast te leggen',
      paymentDepositHelp: 'Schrijf dit bedrag meteen over na het verzenden van uw boekingsaanvraag.',
      remainingBalanceLabel: 'Resterend saldo na voorschot',
      paymentLabelAccount: 'Rekeninghouder',
      paymentLabelIban: 'IBAN',
      paymentLabelBic: 'BIC/SWIFT',
      paymentLabelReference: 'Referentie',
      paymentFlowTitle: 'Hoe uw boeking officieel wordt afgerond',
      paymentFlowSteps: [
        'Plaats uw boekingsaanvraag via dit formulier.',
        'Schrijf het voorschot van €100 over op de rekening hieronder.',
        'Stuur daarna een WhatsApp-bericht dat uw boekingsaanvraag en voorschot verzonden zijn.',
        'De eigenaar reageert via WhatsApp en stelt het officiële contract op.',
        'Beide partijen bekijken en ondertekenen het contract.',
        'Na ondertekening maakt u het resterende bedrag over via bankoverschrijving.',
      ],
      paymentDetailAccount: 'Rekeninghouder: [later invullen]',
      paymentDetailIban: 'IBAN: [later invullen]',
      paymentDetailBic: 'BIC/SWIFT: [later invullen]',
      paymentDetailReference: 'Referentie: uw naam + data',
      paymentNote: 'Uw boeking is pas definitief na ondertekend contract en ontvangst van het volledige bedrag.',
      whatsappBookingCta: 'Ik heb geboekt en het voorschot betaald — ga verder via WhatsApp',
      whatsappBookingHint: 'Stuur dit bericht na uw overschrijving zodat we uw dossier meteen kunnen afwerken.',
      whatsappBookingMessage: 'Hallo, ik heb net een boekingsaanvraag geplaatst voor Costa Caleta.\nNaam: {name}\nData: {checkIn} - {checkOut}\nVoorschot betaald: {deposit}\nTotaal boekingsbedrag: {total}\nGraag het contract doorsturen. Bedankt!',
      checkInTime: 'Inchecktijd',
      checkOutTime: 'Uitchecktijd',
    },
    contact: {
      title: 'Neem Contact Op',
      subtitle: 'Wij helpen u graag met al uw vragen',
      phone: 'Telefoon',
      email: 'E-mail',
      responseTime: 'Wij reageren binnen 24 uur',
      sendMessage: 'Stuur ons een bericht',
      yourName: 'Uw Naam',
      yourEmail: 'Uw E-mail',
      yourPhone: 'Uw Telefoon (optioneel)',
      yourMessage: 'Uw Bericht',
      send: 'Verstuur Bericht',
      whatsapp: 'Chat via WhatsApp',
      successTitle: 'Bericht verzonden!',
      successBody: 'We nemen binnen 24 uur contact met u op.',
      requiredFields: 'Vul alle verplichte velden in.',
      helperText: 'Kies uw voorkeursmanier om contact op te nemen.',
      trustItems: ['Rechtstreeks contact', 'Geen platformkosten', 'Toplocatie'],
      locationLabel: 'Locatie',
      mapCardTitle: 'Interactieve kaart',
      mapCardDescription: 'Google Maps wordt pas geladen nadat u ervoor kiest om de kaart te tonen.',
      mapLoadButton: 'Kaart laden',
      mapOpenExternal: 'Openen in Google Maps',
      mapEmbedTitle: 'Kaart van Costa Caleta',
      address: 'Costa Adeje, Tenerife, Canarische Eilanden',
    },
    footer: {
      rights: 'Alle rechten voorbehouden',
      privacy: 'Privacybeleid',
      terms: 'Algemene Voorwaarden',
      instructions: 'Instructies',
      quickLinks: 'Snelle links',
      directBooking: 'Direct boeken in La Caleta',
      whatsappLabel: 'WhatsApp',
    },
    privacy: {
      title: 'Privacybeleid',
      updated: 'Laatst bijgewerkt: 14 februari 2026',
      intro: 'Dit beleid legt uit hoe wij persoonsgegevens verwerken wanneer u de website van Costa Caleta bezoekt, een boekingsaanvraag plaatst of contact met ons opneemt.',
      sections: [
        {
          title: 'Wie we zijn',
          body: 'Costa Caleta is een privé vakantieverblijf in La Caleta, Tenerife. Wij zijn de verwerkingsverantwoordelijke. Contact: {email}, {phone}.',
        },
        {
          title: 'Welke gegevens we verzamelen',
          list: [
            'Identificatie- en contactgegevens die u zelf verstrekt (naam, e-mail, telefoon).',
            'Boekingsgegevens (data, aantal gasten, berichten).',
            'Opvolggegevens rond betaling van uw boeking (status voorschot, status restsaldo, referentie en interne notities).',
            'Contractopvolging van uw boeking (status contract verzonden/ondertekend).',
            'Communicatie en vragen die u naar ons stuurt, inclusief WhatsApp-berichten wanneer u dat kanaal gebruikt.',
            'Technische gegevens die nodig zijn om de site te laten werken (IP-adres, browser/apparaat, loggegevens).',
          ],
        },
        {
          title: 'Waarom we uw gegevens gebruiken (rechtsgrond)',
          list: [
            'Om te reageren op vragen, boekingsaanvragen te verwerken en voorschot/contractstappen op te volgen (contract/voorafgaande stappen).',
            'Om boekingsgerelateerde communicatie te versturen, inclusief via WhatsApp wanneer u daarvoor kiest (contract/gerechtvaardigd belang).',
            'Om te voldoen aan wettelijke verplichtingen (boekhouding, belasting, veiligheid).',
            'Om onze diensten te beschermen en te verbeteren (gerechtvaardigd belang).',
          ],
        },
        {
          title: 'Delen van gegevens',
          body: 'Wij verkopen uw gegevens niet. We delen ze enkel met dienstverleners die helpen bij het runnen van de website en boekingscommunicatie (hosting, e-mail, berichtenplatformen), en met partijen die nodig zijn voor wettelijke/boekhoudkundige administratie wanneer nodig, of wanneer dit wettelijk verplicht is.',
        },
        {
          title: 'Bewaartermijn',
          body: 'We bewaren gegevens enkel zolang nodig voor de bovenstaande doeleinden. Boekings-, contract- en betalingsgegevens kunnen langer bewaard worden om aan wettelijke en boekhoudkundige verplichtingen te voldoen.',
        },
        {
          title: 'Uw rechten',
          list: [
            'Inzage, correctie, verwijdering, beperking.',
            'Bezwaar en gegevensoverdraagbaarheid.',
            'Intrekking van toestemming waar van toepassing.',
            'Een klacht indienen bij uw lokale toezichthoudende autoriteit.',
          ],
        },
        {
          title: 'Cookies & lokale opslag',
          body: 'We gebruiken essentiële cookies en lokale opslag om uw taalvoorkeur te onthouden en de site goed te laten werken.',
        },
        {
          title: 'Doorgifte buiten de EER',
          body: 'Als gegevens buiten de EER worden verwerkt, gebruiken we passende waarborgen zoals standaardcontractbepalingen.',
        },
        {
          title: 'Beveiliging',
          body: 'We nemen redelijke technische en organisatorische maatregelen om uw gegevens te beschermen, maar geen enkel systeem is 100% veilig.',
        },
        {
          title: 'Contact',
          body: 'Voor privacyvragen of -verzoeken: {email} of {phone}.',
        },
      ],
    },
    terms: {
      title: 'Algemene Voorwaarden',
      updated: 'Laatst bijgewerkt: 14 februari 2026',
      intro: 'Door deze website te gebruiken en een boekingsaanvraag te plaatsen, gaat u akkoord met deze voorwaarden.',
      sections: [
        {
          title: 'Boekingsaanvraag & bevestiging',
          body: 'Het verzenden van het boekingsformulier is een aanvraag. Om data te reserveren is na de aanvraag een voorschot van €100 vereist. Een reservatie is pas definitief nadat het contract door beide partijen is ondertekend en het volledige bedrag is ontvangen.',
        },
        {
          title: 'Prijs & betaling',
          list: [
            'Prijzen zijn in EUR en kunnen een schoonmaakkost bevatten zoals weergegeven.',
            'Betaling gebeurt via bankoverschrijving.',
            'Een voorschot van €100 is vereist om de gevraagde data te blokkeren.',
            'Na betaling van het voorschot stuurt de gast een WhatsApp-bericht als betalingsmelding.',
            'Na ondertekening van het contract wordt het restsaldo via bankoverschrijving betaald volgens de voorwaarden in het contract.',
          ],
        },
        {
          title: 'Contract & communicatie',
          body: 'Na voorschot en WhatsApp-melding stuurt de eigenaar het officiële contract. Beide partijen bekijken en ondertekenen dit contract. Opvolging van de boeking kan via WhatsApp en e-mail verlopen.',
        },
        {
          title: 'Inchecken / uitchecken',
          body: 'Inchecken is na 15:00 en uitchecken voor 12:00, tenzij anders overeengekomen.',
        },
        {
          title: 'Gebruik van het appartement',
          body: 'Gasten gebruiken het appartement met zorg, respecteren buren en huisregels van de residentie, en houden zich aan het aantal gasten uit de boeking.',
        },
        {
          title: 'Schade',
          body: 'Gasten zijn verantwoordelijk voor schade die tijdens het verblijf wordt veroorzaakt. Kosten kunnen na beoordeling worden aangerekend.',
        },
        {
          title: 'Annuleringen',
          body: 'Annulerings- en terugbetalingsvoorwaarden worden vastgelegd in het officiële contract. Bij annulering vóór betaling van het voorschot en vóór opstart van de contractprocedure is geen definitieve reservatie tot stand gekomen.',
        },
        {
          title: 'Aansprakelijkheid',
          body: 'Wij zijn niet aansprakelijk voor verlies van persoonlijke eigendommen of onderbrekingen buiten onze controle (bv. nutsvoorzieningen of overmacht), behalve waar aansprakelijkheid wettelijk niet kan worden uitgesloten.',
        },
        {
          title: 'Contact',
          body: 'Vragen over deze voorwaarden? Contacteer ons via {email} of {phone}.',
        },
      ],
    },
    instructions: {
      title: 'Instructies',
      subtitle: 'Videogids voor het gebruik van de tv in het appartement.',
      videoLabel: 'TV-instructievideo',
    },
    admin: {
      dashboard: 'Dashboard',
      bookings: 'Boekingen',
      pricing: 'Prijzen',
      availability: 'Beschikbaarheid',
      messages: 'Vragen',
      content: 'Inhoud',
      settings: 'Instellingen',
      logout: 'Uitloggen',
      pending: 'In Afwachting',
      confirmed: 'Bevestigd',
      declined: 'Afgewezen',
      cancelled: 'Geannuleerd',
      confirmBooking: 'Boeking Bevestigen',
      declineBooking: 'Boeking Afwijzen',
      guestDetails: 'Gastgegevens',
      seasonalPricing: 'Seizoensprijzen',
      addSeason: 'Seizoen Toevoegen',
      basePriceLabel: 'Basisprijs (per nacht)',
      seasonName: 'Seizoensnaam',
      startDate: 'Startdatum',
      endDate: 'Einddatum',
      pricePerNight: 'Prijs per Nacht',
      save: 'Opslaan',
      cancel: 'Annuleren',
      deleteConfirm: 'Weet u zeker dat u dit wilt verwijderen?',
      blockDates: 'Data Blokkeren',
      unblockDates: 'Data Deblokkeren',
      login: 'Beheerder Inloggen',
      password: 'Wachtwoord',
      invalidCredentials: 'Ongeldige inloggegevens',
    },
    common: {
      loading: 'Laden...',
      error: 'Er is iets misgegaan',
      success: 'Gelukt!',
      close: 'Sluiten',
      viewDetails: 'Details Bekijken',
      noResults: 'Geen resultaten gevonden',
    },
    notFound: {
      title: "Oeps! Pagina niet gevonden",
      backHome: 'Terug naar Home',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      booking: 'Reservar',
      contact: 'Contacto',
      admin: 'Admin',
    },
    hero: {
      title: 'Escápate al sol de Tenerife',
      subtitle: 'Reserva directamente — sin plataformas, sin costes adicionales. Experimenta el calor de las Islas Canarias.',
      checkAvailability: 'Ver Fotos',
      bookNow: 'Reservar Ahora',
      fromPrice: 'Desde',
      perNight: '/ noche',
      trustItems: [
        'Reserva directa, sin comisiones de plataforma',
        'Ubicación ideal en La Caleta',
        'Respuesta rápida del anfitrión',
      ],
      imageAlt: 'Mesa de desayuno con vista al océano en La Caleta',
    },
    cta: {
      title: '¿Listo para tu escapada en Tenerife?',
      subtitle: 'Reserva directamente con nosotros para las mejores tarifas. Sin cargos ocultos, sin intermediarios — solo tu hogar vacacional perfecto.',
      eyebrow: 'Costa Caleta Tenerife',
      trustItems: [
        'Ubicación ideal en La Caleta',
        'Reserva directa, sin costes ocultos',
        'Respuesta rápida del anfitrión',
      ],
    },
    journey: {
      eyebrow: 'Cómo Funciona',
      title: 'De tu primer clic al check-in en tres pasos claros',
      subtitle: 'Un flujo más claro y con menos fricción para decidir y reservar más rápido.',
      steps: [
        {
          title: 'Elige tus fechas',
          description: 'Consulta disponibilidad y envía tu solicitud de reserva en pocos clics.',
        },
        {
          title: 'Recibe confirmación',
          description: 'Confirmamos rápidamente y compartimos los detalles prácticos de tu estancia.',
        },
        {
          title: 'Llega y disfruta',
          description: 'Meet & greet en el lugar y empieza tu estancia en Tenerife sin estrés.',
        },
      ],
      primaryCta: 'Empezar reserva',
      secondaryCta: 'Hacer una consulta',
    },
    gallery: {
      filterAll: 'Todo',
      filterApartment: 'Apartamento',
      filterTenerife: 'Tenerife',
      loadMore: 'Cargar más fotos',
      imageAlts: [
        'Balcón con desayuno',
        'Desayuno con vista a la montaña',
        'Dormitorio',
        'Sala de estar y cocina',
        'Vista de la sala desde la terraza',
        'Baño con lavabo',
        'Baño con ducha',
        'Comedor',
        'Piscina',
        'Vista de la piscina',
        'Zona de piscina de la residencia',
        'Terraza de la piscina al atardecer',
        'Atardecer en la playa',
        'Vista de la costa de Tenerife',
        'Carretera panorámica en Tenerife',
      ],
    },
    facilities: {
      title: 'Servicios e Instalaciones',
      subtitle: 'Todo lo que necesitas para una estancia cómoda',
      wifi: 'Wi-Fi',
      kitchen: 'Cocina totalmente equipada',
      aircon: 'Nespresso, hervidor, tostadora y exprimidor',
      washing: 'Lavadora + tendedero',
      tv: 'TV',
      balcony: 'Terraza soleada con vistas al mar y a la montaña',
      parking: 'Aparcamiento en la calle / plaza (50 m)',
      pool: 'Piscina comunitaria + tumbonas',
      beach: 'Bahía de La Caleta',
      towels: 'Sábanas y toallas incluidas',
    },
    location: {
      title: 'Ubicación ideal en La Caleta',
      subtitle: 'En la bahía de La Caleta, Adeje',
      region: 'La Caleta • Adeje',
      description: `Ubicado en la residencia Costa Caleta en La Caleta (Adeje), en la 4a planta. Hay 2 ascensores y una piscina comunitaria con tumbonas. Apartamento de 1 dormitorio, recientemente renovado, con terraza soleada, vistas al mar y a la montaña.
Muy bien situado, cerca de supermercado, restaurantes, bares, tiendas, naturaleza y Adeje Golf. Desde el apartamento puede tomar el paseo hasta Los Cristianos, o por la naturaleza hacia El Puertito o Playa Paraiso.

El apartamento incluye:
- Sala de estar con terraza soleada y vistas al mar, TV y Wi-Fi.
- Cocina con nevera, congelador, placa de inducción, microondas, horno y lavavajillas.
- Cafetera Nespresso, hervidor, tostadora, exprimidor.
- Plancha, tabla de planchar y aspiradora.
- Baño con ducha a ras de suelo, WC, secador, plancha de pelo y ventana.
- Dormitorio con cama grande (1.80 x 2m), armario empotrado y terraza.
- Terraza con tendedero y lavadora.

Práctico:
- Ropa de cama y toallas incluidas.
- Servicios (electricidad e internet) incluidos.
- Meet & greet, entrega de llaves en el lugar.
- Llegada después de las 15:00, salida antes de las 12:00.
- Aparcamiento en la calle o en una plaza a 50 m.`,
      highlights: [
        { label: 'Cerca', desc: 'Supermercado y tiendas' },
        { label: 'Cerca', desc: 'Restaurantes y bares' },
        { label: 'Paseo', desc: 'Los Cristianos' },
        { label: 'Naturaleza', desc: 'El Puertito / Playa Paraiso' },
      ],
    },
    testimonials: {
      title: 'Experiencias de Huéspedes',
      subtitle: 'Lo que dicen nuestros huéspedes sobre su estancia',
    },
    booking: {
      title: 'Reserva Tu Estancia',
      subtitle: 'Reserva sencilla, sin necesidad de cuenta',
      step1: 'Seleccionar Fechas',
      step2: 'Tus Datos',
      step3: 'Confirmar',
      checkIn: 'Entrada',
      checkOut: 'Salida',
      guests: 'Huéspedes',
      guestsCount: 'huésped(es)',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      message: 'Mensaje (opcional)',
      messagePlaceholder: '¿Alguna solicitud especial o pregunta?',
      next: 'Siguiente',
      back: 'Atrás',
      submit: 'Enviar Solicitud de Reserva',
      priceBreakdown: 'Desglose de Precios',
      nights: 'noches',
      cleaningFee: 'Tarifa de Limpieza',
      total: 'Total',
      selectDates: 'Por favor selecciona tus fechas',
      unavailable: 'No Disponible',
      available: 'Disponible',
      confirmationTitle: '¡Solicitud de Reserva Enviada!',
      confirmationMessage: 'Gracias por tu solicitud de reserva. Confirmaremos tu reserva en breve.',
      disclaimer: 'Esta es una solicitud de reserva. La disponibilidad se confirmará en 24 horas. Meet & greet a la llegada; entrega de llaves en el lugar. Llegada desde las 15:00, salida antes de las 12:00.',
      whatsappNote: '¿Necesitas modificar tu reserva?\nContáctanos por WhatsApp.',
      helpWhatsapp: '¿Preguntas? No dudes en contactarnos por WhatsApp.',
      minStayNote: 'Estancia mínima: {n} noche(s)',
      minStayError: 'La estancia mínima es de {n} noche(s) para las fechas seleccionadas.',
      invalidDates: 'Selecciona al menos una noche.',
      unavailableRange: 'Las fechas seleccionadas incluyen días no disponibles. Elige otro rango.',
      requiredFields: 'Completa todos los campos obligatorios.',
      submitError: 'No se pudo enviar la reserva. Inténtalo de nuevo.',
      paymentTitle: 'Pago por transferencia bancaria',
      paymentIntro: 'Para asegurar tus fechas, pedimos primero un anticipo de €100 tras tu solicitud de reserva.',
      paymentDepositLabel: 'Anticipo para bloquear la reserva',
      paymentDepositHelp: 'Realiza esta transferencia justo después de enviar tu solicitud.',
      remainingBalanceLabel: 'Saldo restante después del anticipo',
      paymentLabelAccount: 'Titular de la cuenta',
      paymentLabelIban: 'IBAN',
      paymentLabelBic: 'BIC/SWIFT',
      paymentLabelReference: 'Referencia',
      paymentFlowTitle: 'Cómo se completa oficialmente tu reserva',
      paymentFlowSteps: [
        'Envía tu solicitud de reserva mediante este formulario.',
        'Transfiere el anticipo de €100 a la cuenta bancaria indicada abajo.',
        'Después, envía un mensaje por WhatsApp indicando que ya enviaste la solicitud y el anticipo.',
        'La propietaria responde por WhatsApp y prepara el contrato oficial.',
        'Ambas partes revisan y firman el contrato.',
        'Tras la firma, transfieres el importe restante por transferencia bancaria.',
      ],
      paymentDetailAccount: 'Titular de la cuenta: [añadir después]',
      paymentDetailIban: 'IBAN: [añadir después]',
      paymentDetailBic: 'BIC/SWIFT: [añadir después]',
      paymentDetailReference: 'Referencia: tu nombre + fechas',
      paymentNote: 'La reserva queda cerrada solo tras la firma del contrato y el pago completo.',
      whatsappBookingCta: 'Ya reservé y pagué el anticipo — continuar por WhatsApp',
      whatsappBookingHint: 'Envía este mensaje tras tu transferencia para cerrar el proceso más rápido.',
      whatsappBookingMessage: 'Hola, acabo de enviar una solicitud de reserva para Costa Caleta.\nNombre: {name}\nFechas: {checkIn} - {checkOut}\nAnticipo pagado: {deposit}\nImporte total de la reserva: {total}\nPor favor, enviadme el contrato. ¡Gracias!',
      checkInTime: 'Hora de entrada',
      checkOutTime: 'Hora de salida',
    },
    contact: {
      title: 'Ponte en Contacto',
      subtitle: 'Estamos aquí para ayudarte con cualquier pregunta',
      phone: 'Teléfono',
      email: 'Correo',
      responseTime: 'Respondemos en 24 horas',
      sendMessage: 'Envíanos un mensaje',
      yourName: 'Tu Nombre',
      yourEmail: 'Tu Correo',
      yourPhone: 'Tu Teléfono (opcional)',
      yourMessage: 'Tu Mensaje',
      send: 'Enviar Mensaje',
      whatsapp: 'Chatear por WhatsApp',
      successTitle: '¡Mensaje enviado!',
      successBody: 'Te responderemos en un plazo de 24 horas.',
      requiredFields: 'Completa todos los campos obligatorios.',
      helperText: 'Elige tu forma preferida de contacto.',
      trustItems: ['Contacto directo', 'Sin comisiones', 'Zona destacada'],
      locationLabel: 'Ubicación',
      mapCardTitle: 'Mapa interactivo',
      mapCardDescription: 'Google Maps solo se carga después de que decidas mostrarlo.',
      mapLoadButton: 'Cargar mapa',
      mapOpenExternal: 'Abrir en Google Maps',
      mapEmbedTitle: 'Mapa de Costa Caleta',
      address: 'Costa Adeje, Tenerife, Islas Canarias',
    },
    footer: {
      rights: 'Todos los derechos reservados',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones',
      instructions: 'Instrucciones',
      quickLinks: 'Enlaces rápidos',
      directBooking: 'Reserva directa en La Caleta',
      whatsappLabel: 'WhatsApp',
    },
    privacy: {
      title: 'Política de Privacidad',
      updated: 'Última actualización: 14 de febrero de 2026',
      intro: 'Esta política explica cómo tratamos los datos personales cuando visitas la web de Costa Caleta, envías una solicitud de reserva o te pones en contacto con nosotros.',
      sections: [
        {
          title: 'Quiénes somos',
          body: 'Costa Caleta es un alquiler vacacional privado en La Caleta, Tenerife. Actuamos como responsable del tratamiento. Contacto: {email}, {phone}.',
        },
        {
          title: 'Qué datos recopilamos',
          list: [
            'Datos de identificación y contacto que proporcionas (nombre, email, teléfono).',
            'Datos de reserva (fechas, número de huéspedes, mensajes).',
            'Datos de seguimiento de pago de tu reserva (estado del anticipo, estado del saldo restante, referencia y notas internas).',
            'Datos de seguimiento contractual de tu reserva (estado de contrato enviado/firmado).',
            'Comunicaciones y consultas que nos envías, incluidos mensajes de WhatsApp cuando usas ese canal.',
            'Datos técnicos necesarios para operar la web (dirección IP, navegador/dispositivo, registros).',
          ],
        },
        {
          title: 'Por qué usamos tus datos (base legal)',
          list: [
            'Responder consultas, procesar solicitudes de reserva y gestionar pasos de anticipo/contrato (contrato/pasos previos).',
            'Enviar comunicaciones relacionadas con la reserva, también por WhatsApp cuando tú eliges ese canal (contrato/interés legítimo).',
            'Cumplir obligaciones legales (contabilidad, impuestos, seguridad).',
            'Proteger y mejorar nuestros servicios (interés legítimo).',
          ],
        },
        {
          title: 'Compartición de datos',
          body: 'No vendemos tus datos. Solo los compartimos con proveedores que ayudan a operar la web y la comunicación de reservas (hosting, email, herramientas de mensajería), y con partes necesarias para gestión legal/contable cuando corresponda, o cuando la ley lo exige.',
        },
        {
          title: 'Conservación',
          body: 'Conservamos los datos solo el tiempo necesario para los fines anteriores. Los datos de reserva, contrato y pagos pueden conservarse para cumplir obligaciones legales y contables.',
        },
        {
          title: 'Tus derechos',
          list: [
            'Acceso, rectificación, supresión, limitación.',
            'Oposición y portabilidad de datos.',
            'Retirar el consentimiento cuando corresponda.',
            'Presentar una reclamación ante tu autoridad de control local.',
          ],
        },
        {
          title: 'Cookies y almacenamiento local',
          body: 'Usamos cookies esenciales y almacenamiento local para recordar tu idioma y asegurar el funcionamiento del sitio.',
        },
        {
          title: 'Transferencias internacionales',
          body: 'Si los datos se procesan fuera del EEE, aplicamos salvaguardas adecuadas como cláusulas contractuales tipo.',
        },
        {
          title: 'Seguridad',
          body: 'Aplicamos medidas técnicas y organizativas razonables para proteger tus datos, pero ningún sistema es 100% seguro.',
        },
        {
          title: 'Contacto',
          body: 'Para cuestiones de privacidad: {email} o {phone}.',
        },
      ],
    },
    terms: {
      title: 'Términos y Condiciones',
      updated: 'Última actualización: 14 de febrero de 2026',
      intro: 'Al usar este sitio y enviar una solicitud de reserva, aceptas estos términos.',
      sections: [
        {
          title: 'Solicitud y confirmación de reserva',
          body: 'Enviar el formulario es una solicitud. Para bloquear fechas, se requiere un anticipo de €100 tras la solicitud. La reserva queda cerrada solo después de que ambas partes firmen el contrato y se reciba el importe total.',
        },
        {
          title: 'Precio y pago',
          list: [
            'Los precios se muestran en EUR y pueden incluir la tarifa de limpieza mostrada.',
            'El pago se realiza por transferencia bancaria.',
            'Se requiere un anticipo de €100 para bloquear las fechas solicitadas.',
            'Después de pagar el anticipo, el huésped envía un mensaje de WhatsApp para avisar del pago.',
            'Después de firmar el contrato, el saldo restante se paga por transferencia según las condiciones indicadas en el contrato.',
          ],
        },
        {
          title: 'Contrato y comunicación',
          body: 'Tras el anticipo y el aviso por WhatsApp, el propietario envía el contrato oficial. Ambas partes deben revisarlo y firmarlo. El seguimiento de la reserva puede realizarse por WhatsApp y email.',
        },
        {
          title: 'Entrada / salida',
          body: 'La entrada es después de las 15:00 y la salida antes de las 12:00, salvo acuerdo diferente.',
        },
        {
          title: 'Uso del alojamiento',
          body: 'Los huéspedes deben cuidar el apartamento, respetar a los vecinos y las normas de la residencia, y cumplir la ocupación indicada en la reserva.',
        },
        {
          title: 'Daños',
          body: 'Los huéspedes son responsables de los daños causados durante la estancia. Los costes podrán cobrarse tras evaluación.',
        },
        {
          title: 'Cancelaciones',
          body: 'Las condiciones de cancelación y reembolso se definen en el contrato oficial. Si cancelas antes de pagar el anticipo y antes de iniciar el proceso contractual, no existe una reserva finalizada.',
        },
        {
          title: 'Responsabilidad',
          body: 'No somos responsables por la pérdida de pertenencias personales ni por interrupciones fuera de nuestro control (p. ej., servicios o fuerza mayor), salvo que la ley establezca lo contrario.',
        },
        {
          title: 'Contacto',
          body: '¿Preguntas sobre estos términos? Contáctanos en {email} o {phone}.',
        },
      ],
    },
    instructions: {
      title: 'Instrucciones',
      subtitle: 'Guía en video para usar el televisor en el apartamento.',
      videoLabel: 'Video de instrucciones de TV',
    },
    admin: {
      dashboard: 'Panel',
      bookings: 'Reservas',
      pricing: 'Precios',
      availability: 'Disponibilidad',
      messages: 'Mensajes',
      content: 'Contenido',
      settings: 'Ajustes',
      logout: 'Cerrar Sesión',
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      declined: 'Rechazado',
      cancelled: 'Cancelado',
      confirmBooking: 'Confirmar Reserva',
      declineBooking: 'Rechazar Reserva',
      guestDetails: 'Datos del Huésped',
      seasonalPricing: 'Precios por Temporada',
      addSeason: 'Añadir Temporada',
      basePriceLabel: 'Precio Base (por noche)',
      seasonName: 'Nombre de Temporada',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin',
      pricePerNight: 'Precio por Noche',
      save: 'Guardar',
      cancel: 'Cancelar',
      deleteConfirm: '¿Estás seguro de que quieres eliminar esto?',
      blockDates: 'Bloquear Fechas',
      unblockDates: 'Desbloquear Fechas',
      login: 'Acceso Admin',
      password: 'Contraseña',
      invalidCredentials: 'Credenciales inválidas',
    },
    common: {
      loading: 'Cargando...',
      error: 'Algo salió mal',
      success: '¡Éxito!',
      close: 'Cerrar',
      viewDetails: 'Ver Detalles',
      noResults: 'No se encontraron resultados',
    },
    notFound: {
      title: 'Ups, no se encontró la página',
      backHome: 'Volver al inicio',
    },
  },
};
