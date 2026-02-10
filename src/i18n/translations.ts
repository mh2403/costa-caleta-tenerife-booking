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
  };
  // CTA section
  cta: {
    title: string;
    subtitle: string;
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
    minStayNote: string;
    minStayError: string;
    invalidDates: string;
    unavailableRange: string;
    requiredFields: string;
    submitError: string;
    paymentTitle: string;
    paymentIntro: string;
    paymentDetailAccount: string;
    paymentDetailIban: string;
    paymentDetailBic: string;
    paymentDetailReference: string;
    paymentNote: string;
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
    yourMessage: string;
    send: string;
    whatsapp: string;
  };
  // Footer
  footer: {
    rights: string;
    privacy: string;
    terms: string;
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
  // Admin
  admin: {
    dashboard: string;
    bookings: string;
    pricing: string;
    availability: string;
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
      title: 'Your Private Holiday Stay in Tenerife',
      subtitle: 'Book directly — no platforms, no extra fees. Experience the warmth of the Canary Islands.',
      checkAvailability: 'View Gallery',
      bookNow: 'Book Now',
      fromPrice: 'From',
      perNight: '/ night',
    },
    cta: {
      title: 'Ready for Your Tenerife Escape?',
      subtitle: 'Book directly with us for the best rates. No hidden fees, no middlemen — just your perfect vacation home.',
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
      disclaimer: 'This is a booking request. Availability will be confirmed within 24 hours. Meet & greet on arrival; keys handed over on site. Check-in after 15:00, check-out before 12:00.',
      whatsappNote: 'Need to modify your booking? Contact us via WhatsApp.',
      minStayNote: 'Minimum stay: {n} night(s)',
      minStayError: 'Minimum stay is {n} night(s) for the selected dates.',
      invalidDates: 'Please select at least one night.',
      unavailableRange: 'Selected dates include unavailable days. Please choose another range.',
      requiredFields: 'Please fill in all required fields.',
      submitError: 'Failed to submit booking. Please try again.',
      paymentTitle: 'Payment by bank transfer',
      paymentIntro: 'We only accept bank transfer. You will receive the payment details after we confirm availability.',
      paymentDetailAccount: 'Account name: [add later]',
      paymentDetailIban: 'IBAN: [add later]',
      paymentDetailBic: 'BIC/SWIFT: [add later]',
      paymentDetailReference: 'Reference: Your name + dates',
      paymentNote: 'Your reservation is secured once payment is received.',
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
      yourMessage: 'Your Message',
      send: 'Send Message',
      whatsapp: 'Chat on WhatsApp',
    },
    footer: {
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    privacy: {
      title: 'Privacy Policy',
      updated: 'Last updated: February 10, 2026',
      intro: 'This policy explains how we process personal data when you visit the Costa Caleta website or contact us.',
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
            'Communications and inquiries you send us.',
            'Technical data needed to operate the site (IP address, browser/device, log data).',
          ],
        },
        {
          title: 'Why we use your data (legal basis)',
          list: [
            'To respond to inquiries and manage bookings (contract/steps prior to contract).',
            'To send booking-related communications (contract/legitimate interest).',
            'To comply with legal obligations (accounting, tax, security).',
            'To protect and improve our services (legitimate interests).',
          ],
        },
        {
          title: 'Sharing',
          body: 'We do not sell your data. We share it only with service providers that help operate the website and booking communications (hosting, email), or when required by law.',
        },
        {
          title: 'Retention',
          body: 'We keep data only as long as necessary for the purposes above. Booking records may be retained to meet legal and accounting obligations.',
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
      updated: 'Last updated: February 10, 2026',
      intro: 'By using this website and submitting a booking request, you agree to these terms.',
      sections: [
        {
          title: 'Booking requests & confirmation',
          body: 'Submitting the booking form is a request. A reservation is confirmed only after we confirm availability and send a confirmation.',
        },
        {
          title: 'Pricing & payment',
          list: [
            'Prices are shown in EUR and may include a cleaning fee as displayed.',
            'Payment is by bank transfer.',
            'Your reservation is confirmed once payment is received.',
          ],
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
          body: 'Cancellation terms will be communicated in your booking confirmation. If you cancel before confirmation, no charges apply.',
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
    admin: {
      dashboard: 'Dashboard',
      bookings: 'Bookings',
      pricing: 'Pricing',
      availability: 'Availability',
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
  },
  nl: {
    nav: {
      home: 'Home',
      booking: 'Boeken',
      contact: 'Contact',
      admin: 'Beheer',
    },
    hero: {
      title: 'Uw Privé Vakantieverblijf op Tenerife',
      subtitle: 'Boek direct — geen platforms, geen extra kosten. Ervaar de warmte van de Canarische Eilanden.',
      checkAvailability: "Bekijk foto's",
      bookNow: 'Nu Boeken',
      fromPrice: 'Vanaf',
      perNight: '/ nacht',
    },
    cta: {
      title: 'Klaar voor uw Tenerife-escape?',
      subtitle: 'Boek direct bij ons voor de beste tarieven. Geen verborgen kosten, geen tussenpersonen — gewoon uw perfecte vakantieverblijf.',
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
      disclaimer: 'Dit is een boekingsverzoek. Beschikbaarheid wordt binnen 24 uur bevestigd. Meet & greet ter plaatse; sleuteloverhandiging bij aankomst. Aankomst na 15u, vertrek voor 12u.',
      whatsappNote: 'Wilt u uw boeking wijzigen? Neem contact op via WhatsApp.',
      minStayNote: 'Minimum verblijf: {n} nacht(en)',
      minStayError: 'Minimum verblijf is {n} nacht(en) voor de geselecteerde data.',
      invalidDates: 'Selecteer minstens één nacht.',
      unavailableRange: 'De geselecteerde data bevatten niet-beschikbare dagen. Kies een andere periode.',
      requiredFields: 'Vul alle verplichte velden in.',
      submitError: 'Boeking versturen mislukt. Probeer het opnieuw.',
      paymentTitle: 'Betaling via bankoverschrijving',
      paymentIntro: 'We accepteren alleen bankoverschrijving. Na bevestiging sturen we de betaalgegevens.',
      paymentDetailAccount: 'Rekeninghouder: [later invullen]',
      paymentDetailIban: 'IBAN: [later invullen]',
      paymentDetailBic: 'BIC/SWIFT: [later invullen]',
      paymentDetailReference: 'Referentie: uw naam + data',
      paymentNote: 'Uw reservering is definitief zodra de betaling is ontvangen.',
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
      yourMessage: 'Uw Bericht',
      send: 'Verstuur Bericht',
      whatsapp: 'Chat via WhatsApp',
    },
    footer: {
      rights: 'Alle rechten voorbehouden',
      privacy: 'Privacybeleid',
      terms: 'Algemene Voorwaarden',
    },
    privacy: {
      title: 'Privacybeleid',
      updated: 'Laatst bijgewerkt: 10 februari 2026',
      intro: 'Dit beleid legt uit hoe wij persoonsgegevens verwerken wanneer u de website van Costa Caleta bezoekt of contact met ons opneemt.',
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
            'Communicatie en vragen die u naar ons stuurt.',
            'Technische gegevens die nodig zijn om de site te laten werken (IP-adres, browser/apparaat, loggegevens).',
          ],
        },
        {
          title: 'Waarom we uw gegevens gebruiken (rechtsgrond)',
          list: [
            'Om te reageren op vragen en boekingen te beheren (contract/voorafgaande stappen).',
            'Om boekingsgerelateerde communicatie te versturen (contract/gerechtvaardigd belang).',
            'Om te voldoen aan wettelijke verplichtingen (boekhouding, belasting, veiligheid).',
            'Om onze diensten te beschermen en te verbeteren (gerechtvaardigd belang).',
          ],
        },
        {
          title: 'Delen van gegevens',
          body: 'Wij verkopen uw gegevens niet. We delen ze enkel met dienstverleners die helpen bij het runnen van de website en boekingscommunicatie (hosting, e-mail), of wanneer dit wettelijk verplicht is.',
        },
        {
          title: 'Bewaartermijn',
          body: 'We bewaren gegevens enkel zolang nodig voor de bovenstaande doeleinden. Boekingsgegevens kunnen langer bewaard worden om aan wettelijke en boekhoudkundige verplichtingen te voldoen.',
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
      updated: 'Laatst bijgewerkt: 10 februari 2026',
      intro: 'Door deze website te gebruiken en een boekingsaanvraag te plaatsen, gaat u akkoord met deze voorwaarden.',
      sections: [
        {
          title: 'Boekingsaanvraag & bevestiging',
          body: 'Het verzenden van het boekingsformulier is een aanvraag. Een reservatie is pas bevestigd nadat wij de beschikbaarheid hebben bevestigd en u een bevestiging ontvangt.',
        },
        {
          title: 'Prijs & betaling',
          list: [
            'Prijzen zijn in EUR en kunnen een schoonmaakkost bevatten zoals weergegeven.',
            'Betaling gebeurt via bankoverschrijving.',
            'De reservatie is definitief zodra de betaling is ontvangen.',
          ],
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
          body: 'Annuleringsvoorwaarden worden gecommuniceerd in uw boekingsbevestiging. Bij annulering vóór bevestiging worden geen kosten aangerekend.',
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
    admin: {
      dashboard: 'Dashboard',
      bookings: 'Boekingen',
      pricing: 'Prijzen',
      availability: 'Beschikbaarheid',
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
  },
  es: {
    nav: {
      home: 'Inicio',
      booking: 'Reservar',
      contact: 'Contacto',
      admin: 'Admin',
    },
    hero: {
      title: 'Tu Estancia Privada en Tenerife',
      subtitle: 'Reserva directamente — sin plataformas, sin costes adicionales. Experimenta el calor de las Islas Canarias.',
      checkAvailability: 'Ver Fotos',
      bookNow: 'Reservar Ahora',
      fromPrice: 'Desde',
      perNight: '/ noche',
    },
    cta: {
      title: '¿Listo para tu escapada en Tenerife?',
      subtitle: 'Reserva directamente con nosotros para las mejores tarifas. Sin cargos ocultos, sin intermediarios — solo tu hogar vacacional perfecto.',
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
      disclaimer: 'Esta es una solicitud de reserva. La disponibilidad se confirmará en 24 horas. Meet & greet a la llegada; entrega de llaves en el lugar. Llegada después de las 15:00, salida antes de las 12:00.',
      whatsappNote: '¿Necesitas modificar tu reserva? Contáctanos por WhatsApp.',
      minStayNote: 'Estancia mínima: {n} noche(s)',
      minStayError: 'La estancia mínima es de {n} noche(s) para las fechas seleccionadas.',
      invalidDates: 'Selecciona al menos una noche.',
      unavailableRange: 'Las fechas seleccionadas incluyen días no disponibles. Elige otro rango.',
      requiredFields: 'Completa todos los campos obligatorios.',
      submitError: 'No se pudo enviar la reserva. Inténtalo de nuevo.',
      paymentTitle: 'Pago por transferencia bancaria',
      paymentIntro: 'Solo aceptamos transferencia bancaria. Recibirás los datos de pago después de confirmar la disponibilidad.',
      paymentDetailAccount: 'Titular de la cuenta: [añadir después]',
      paymentDetailIban: 'IBAN: [añadir después]',
      paymentDetailBic: 'BIC/SWIFT: [añadir después]',
      paymentDetailReference: 'Referencia: tu nombre + fechas',
      paymentNote: 'La reserva queda confirmada una vez recibido el pago.',
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
      yourMessage: 'Tu Mensaje',
      send: 'Enviar Mensaje',
      whatsapp: 'Chatear por WhatsApp',
    },
    footer: {
      rights: 'Todos los derechos reservados',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones',
    },
    privacy: {
      title: 'Política de Privacidad',
      updated: 'Última actualización: 10 de febrero de 2026',
      intro: 'Esta política explica cómo tratamos los datos personales cuando visitas la web de Costa Caleta o te pones en contacto con nosotros.',
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
            'Comunicaciones y consultas que nos envías.',
            'Datos técnicos necesarios para operar la web (dirección IP, navegador/dispositivo, registros).',
          ],
        },
        {
          title: 'Por qué usamos tus datos (base legal)',
          list: [
            'Responder consultas y gestionar reservas (contrato/pasos previos).',
            'Enviar comunicaciones relacionadas con la reserva (contrato/interés legítimo).',
            'Cumplir obligaciones legales (contabilidad, impuestos, seguridad).',
            'Proteger y mejorar nuestros servicios (interés legítimo).',
          ],
        },
        {
          title: 'Compartición de datos',
          body: 'No vendemos tus datos. Solo los compartimos con proveedores que ayudan a operar la web y la comunicación de reservas (hosting, email), o cuando la ley lo exige.',
        },
        {
          title: 'Conservación',
          body: 'Conservamos los datos solo el tiempo necesario para los fines anteriores. Los datos de reservas pueden conservarse para cumplir obligaciones legales y contables.',
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
      updated: 'Última actualización: 10 de febrero de 2026',
      intro: 'Al usar este sitio y enviar una solicitud de reserva, aceptas estos términos.',
      sections: [
        {
          title: 'Solicitud y confirmación de reserva',
          body: 'Enviar el formulario es una solicitud. La reserva se confirma solo cuando confirmamos disponibilidad y te enviamos la confirmación.',
        },
        {
          title: 'Precio y pago',
          list: [
            'Los precios se muestran en EUR y pueden incluir la tarifa de limpieza mostrada.',
            'El pago se realiza por transferencia bancaria.',
            'La reserva queda confirmada cuando se recibe el pago.',
          ],
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
          body: 'Las condiciones de cancelación se comunicarán en la confirmación de la reserva. Si cancelas antes de la confirmación, no se aplican cargos.',
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
    admin: {
      dashboard: 'Panel',
      bookings: 'Reservas',
      pricing: 'Precios',
      availability: 'Disponibilidad',
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
  },
};
