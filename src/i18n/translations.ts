export type Language = 'en' | 'nl' | 'es' | 'fr';

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
    description: string;
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
    facilities: {
      title: 'Amenities & Facilities',
      subtitle: 'Everything you need for a comfortable stay',
      wifi: 'High-Speed WiFi',
      kitchen: 'Fully Equipped Kitchen',
      aircon: 'Air Conditioning',
      washing: 'Washing Machine',
      tv: 'Smart TV',
      balcony: 'Private Balcony',
      parking: 'Free Parking',
      pool: 'Swimming Pool',
      beach: 'Beach Access',
      towels: 'Fresh Towels',
    },
    location: {
      title: 'Perfect Location',
      subtitle: 'Discover the beauty of Tenerife',
      description: 'Nestled in a peaceful area with stunning ocean views, our apartment offers the perfect base for exploring Tenerife. Just minutes from beautiful beaches, local restaurants, and hiking trails.',
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
      disclaimer: 'This is a booking request. Availability will be confirmed within 24 hours.',
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
    facilities: {
      title: 'Voorzieningen & Faciliteiten',
      subtitle: 'Alles wat u nodig heeft voor een comfortabel verblijf',
      wifi: 'Snelle WiFi',
      kitchen: 'Volledig Uitgeruste Keuken',
      aircon: 'Airconditioning',
      washing: 'Wasmachine',
      tv: 'Smart TV',
      balcony: 'Privé Balkon',
      parking: 'Gratis Parkeren',
      pool: 'Zwembad',
      beach: 'Strand Toegang',
      towels: 'Verse Handdoeken',
    },
    location: {
      title: 'Perfecte Locatie',
      subtitle: 'Ontdek de schoonheid van Tenerife',
      description: 'Gelegen in een rustige omgeving met prachtig uitzicht op zee, biedt ons appartement de perfecte uitvalsbasis om Tenerife te verkennen. Op slechts enkele minuten van prachtige stranden, lokale restaurants en wandelpaden.',
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
      disclaimer: 'Dit is een boekingsverzoek. Beschikbaarheid wordt binnen 24 uur bevestigd.',
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
    facilities: {
      title: 'Servicios e Instalaciones',
      subtitle: 'Todo lo que necesitas para una estancia cómoda',
      wifi: 'WiFi de Alta Velocidad',
      kitchen: 'Cocina Totalmente Equipada',
      aircon: 'Aire Acondicionado',
      washing: 'Lavadora',
      tv: 'Smart TV',
      balcony: 'Balcón Privado',
      parking: 'Aparcamiento Gratuito',
      pool: 'Piscina',
      beach: 'Acceso a la Playa',
      towels: 'Toallas Limpias',
    },
    location: {
      title: 'Ubicación Perfecta',
      subtitle: 'Descubre la belleza de Tenerife',
      description: 'Situado en una zona tranquila con impresionantes vistas al mar, nuestro apartamento ofrece la base perfecta para explorar Tenerife. A pocos minutos de hermosas playas, restaurantes locales y rutas de senderismo.',
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
      disclaimer: 'Esta es una solicitud de reserva. La disponibilidad se confirmará en 24 horas.',
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
      terms: 'Términos de Servicio',
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
  fr: {
    nav: {
      home: 'Accueil',
      booking: 'Réserver',
      contact: 'Contact',
      admin: 'Admin',
    },
    hero: {
      title: 'Votre Séjour Privé à Tenerife',
      subtitle: 'Réservez directement — sans plateformes, sans frais supplémentaires. Vivez la chaleur des îles Canaries.',
      checkAvailability: 'Voir Photos',
      bookNow: 'Réserver Maintenant',
      fromPrice: 'À partir de',
      perNight: '/ nuit',
    },
    facilities: {
      title: 'Équipements & Installations',
      subtitle: 'Tout ce dont vous avez besoin pour un séjour confortable',
      wifi: 'WiFi Haut Débit',
      kitchen: 'Cuisine Entièrement Équipée',
      aircon: 'Climatisation',
      washing: 'Machine à Laver',
      tv: 'Smart TV',
      balcony: 'Balcon Privé',
      parking: 'Parking Gratuit',
      pool: 'Piscine',
      beach: 'Accès Plage',
      towels: 'Serviettes Fraîches',
    },
    location: {
      title: 'Emplacement Parfait',
      subtitle: 'Découvrez la beauté de Tenerife',
      description: 'Niché dans un quartier paisible avec une vue imprenable sur l\'océan, notre appartement offre la base idéale pour explorer Tenerife. À quelques minutes de belles plages, restaurants locaux et sentiers de randonnée.',
    },
    testimonials: {
      title: 'Expériences des Clients',
      subtitle: 'Ce que nos clients disent de leur séjour',
    },
    booking: {
      title: 'Réservez Votre Séjour',
      subtitle: 'Réservation simple, pas de compte requis',
      step1: 'Sélectionner les Dates',
      step2: 'Vos Coordonnées',
      step3: 'Confirmer',
      checkIn: 'Arrivée',
      checkOut: 'Départ',
      guests: 'Voyageurs',
      guestsCount: 'voyageur(s)',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      message: 'Message (optionnel)',
      messagePlaceholder: 'Des demandes spéciales ou questions?',
      next: 'Suivant',
      back: 'Retour',
      submit: 'Envoyer la Demande de Réservation',
      priceBreakdown: 'Détail des Prix',
      nights: 'nuits',
      cleaningFee: 'Frais de Ménage',
      total: 'Total',
      selectDates: 'Veuillez sélectionner vos dates',
      unavailable: 'Indisponible',
      available: 'Disponible',
      confirmationTitle: 'Demande de Réservation Envoyée!',
      confirmationMessage: 'Merci pour votre demande de réservation. Nous confirmerons votre réservation sous peu.',
      disclaimer: 'Ceci est une demande de réservation. La disponibilité sera confirmée sous 24 heures.',
      whatsappNote: 'Besoin de modifier votre réservation? Contactez-nous via WhatsApp.',
      minStayNote: 'Séjour minimum : {n} nuit(s)',
      minStayError: 'Le séjour minimum est de {n} nuit(s) pour les dates sélectionnées.',
      invalidDates: 'Veuillez sélectionner au moins une nuit.',
      unavailableRange: 'Les dates sélectionnées incluent des jours indisponibles. Choisissez une autre période.',
      requiredFields: 'Veuillez remplir tous les champs obligatoires.',
      submitError: 'Échec de l’envoi de la réservation. Veuillez réessayer.',
      paymentTitle: 'Paiement par virement bancaire',
      paymentIntro: 'Nous acceptons uniquement le virement bancaire. Vous recevrez les détails de paiement après confirmation de la disponibilité.',
      paymentDetailAccount: 'Titulaire du compte : [à ajouter]',
      paymentDetailIban: 'IBAN : [à ajouter]',
      paymentDetailBic: 'BIC/SWIFT : [à ajouter]',
      paymentDetailReference: 'Référence : votre nom + dates',
      paymentNote: 'La réservation est confirmée dès réception du paiement.',
      checkInTime: 'Heure d’arrivée',
      checkOutTime: 'Heure de départ',
    },
    contact: {
      title: 'Contactez-Nous',
      subtitle: 'Nous sommes là pour répondre à vos questions',
      phone: 'Téléphone',
      email: 'Email',
      responseTime: 'Nous répondons sous 24 heures',
      sendMessage: 'Envoyez-nous un message',
      yourName: 'Votre Nom',
      yourEmail: 'Votre Email',
      yourMessage: 'Votre Message',
      send: 'Envoyer le Message',
      whatsapp: 'Discuter sur WhatsApp',
    },
    footer: {
      rights: 'Tous droits réservés',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
    },
    admin: {
      dashboard: 'Tableau de Bord',
      bookings: 'Réservations',
      pricing: 'Tarifs',
      availability: 'Disponibilité',
      content: 'Contenu',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      pending: 'En Attente',
      confirmed: 'Confirmé',
      declined: 'Refusé',
      cancelled: 'Annulé',
      confirmBooking: 'Confirmer Réservation',
      declineBooking: 'Refuser Réservation',
      guestDetails: 'Détails du Client',
      seasonalPricing: 'Tarification Saisonnière',
      addSeason: 'Ajouter une Saison',
      basePriceLabel: 'Prix de Base (par nuit)',
      seasonName: 'Nom de la Saison',
      startDate: 'Date de Début',
      endDate: 'Date de Fin',
      pricePerNight: 'Prix par Nuit',
      save: 'Enregistrer',
      cancel: 'Annuler',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ceci?',
      blockDates: 'Bloquer les Dates',
      unblockDates: 'Débloquer les Dates',
      login: 'Connexion Admin',
      password: 'Mot de Passe',
      invalidCredentials: 'Identifiants invalides',
    },
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      success: 'Succès!',
      close: 'Fermer',
      viewDetails: 'Voir les Détails',
      noResults: 'Aucun résultat trouvé',
    },
  },
};
