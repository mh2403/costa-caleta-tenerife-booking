import type { Language } from '@/i18n';

export type SeoPageSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoPageCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: SeoPageSection[];
  ctaTitle: string;
  ctaLabel: string;
  secondaryLabel: string;
};

export const accommodationCopy: Record<Language, SeoPageCopy> = {
  nl: {
    eyebrow: 'HET APPARTEMENT',
    title: 'Vakantieappartement met zeezicht in La Caleta, Tenerife',
    intro:
      'Een gerenoveerd appartement voor een verblijf met tot 2 personen in Costa Caleta, La Caleta. Geniet van een slaapkamer met dubbel bed, een slaapzetel, een zonnig terras, zee- en bergzicht en een gemeenschappelijk zwembad.',
    sections: [
      {
        title: 'Comfortabel verblijf voor twee',
        paragraphs: [
          'Het appartement is ingericht voor koppels of twee reizigers die zelfstandig willen genieten van Tenerife. Er is één slaapkamer met een comfortabel dubbel bed en in de woonkamer staat een slaapzetel voor twee personen. De accommodatie is geschikt voor een verblijf met tot 2 personen.',
          'De woonkamer sluit aan op het zonnige terras. Daar kunt u rustig ontbijten, de zee bekijken of in de avond genieten van de zachte temperaturen van La Caleta.',
        ],
      },
      {
        title: 'Alles voor een ontspannen verblijf',
        paragraphs: ['De woning combineert de sfeer van een eigen vakantieappartement met praktische voorzieningen voor een zorgeloos verblijf.'],
        bullets: [
          'Zee- en bergzicht vanuit het appartement en terras.',
          'Volledig uitgeruste keuken met koelkast, oven, kookplaat en vaatwasser.',
          'Wifi, televisie, Nespresso, waterkoker, broodrooster en citruspers.',
          'Badkamer met inloopdouche, haardroger en praktische opbergruimte.',
          'Gedeeld zwembad met ligstoelen in de residentie.',
          'Beddengoed, handdoeken, wasmachine en droogrek inbegrepen.',
        ],
      },
      {
        title: 'Ligging in La Caleta, Adeje',
        paragraphs: [
          'Costa Caleta ligt in La Caleta, een rustige kustplaats in Adeje met restaurants, bars, winkels en de promenade in de buurt. De omgeving is geschikt voor rustige dagen aan zee, wandelingen langs de kust en uitstappen naar de stranden en natuur van Zuid-Tenerife.',
          'Ook Costa Adeje Golf, Playa del Duque, Playa de la Enramada en Playa Paraiso zijn vanuit La Caleta eenvoudig bereikbaar. In de accommodatie ontvangt u praktische informatie voor uw aankomst en verblijf.',
        ],
      },
      {
        title: 'Rechtstreeks boeken',
        paragraphs: [
          'Controleer uw gewenste data via de rechtstreekse boekingspagina. U ziet meteen de actuele beschikbaarheid en kunt een aanvraag versturen zonder tussenpersoon. Voor vragen over uw verblijf kunt u ook rechtstreeks contact opnemen via WhatsApp, telefoon of e-mail.',
        ],
      },
    ],
    ctaTitle: 'Klaar voor uw verblijf in La Caleta?',
    ctaLabel: 'Bekijk beschikbaarheid',
    secondaryLabel: 'Ontdek La Caleta',
  },
  en: {
    eyebrow: 'THE APARTMENT',
    title: 'Sea-view holiday apartment in La Caleta, Tenerife',
    intro:
      'A renovated apartment for up to 2 people in Costa Caleta, La Caleta. Enjoy one bedroom with a double bed, a sofa bed, a sunny terrace, sea and mountain views, and a shared pool.',
    sections: [
      {
        title: 'A comfortable stay for two',
        paragraphs: [
          'The apartment is designed for couples or two travellers who want to enjoy Tenerife independently. There is one bedroom with a comfortable double bed, plus a sofa bed for two in the living room. The accommodation is suitable for up to 2 people.',
          'The living room opens onto the sunny terrace. It is a relaxing place for breakfast, sea views and warm evenings in La Caleta.',
        ],
      },
      {
        title: 'Everything for an easy stay',
        paragraphs: ['The apartment combines the privacy of a holiday rental with practical facilities for a comfortable visit.'],
        bullets: [
          'Sea and mountain views from the apartment and terrace.',
          'Fully equipped kitchen with fridge, oven, hob and dishwasher.',
          'Wi-Fi, TV, Nespresso machine, kettle, toaster and juicer.',
          'Bathroom with walk-in shower, hairdryer and useful storage.',
          'Shared swimming pool and sun loungers in the residence.',
          'Bed linen, towels, washing machine and drying rack included.',
        ],
      },
      {
        title: 'Location in La Caleta, Adeje',
        paragraphs: [
          'Costa Caleta is located in La Caleta, a peaceful coastal village in Adeje with restaurants, bars, shops and the promenade nearby. The area is ideal for relaxed days by the ocean, coastal walks and exploring the beaches and landscapes of southern Tenerife.',
          'Costa Adeje Golf, Playa del Duque, Playa de la Enramada and Playa Paraiso are also easy to reach from La Caleta. Practical arrival information is shared before your stay.',
        ],
      },
      {
        title: 'Book directly',
        paragraphs: [
          'Check your dates on the direct booking page. You can see current availability and send a request without a middleman. For practical questions, contact us directly by WhatsApp, phone or email.',
        ],
      },
    ],
    ctaTitle: 'Ready for your La Caleta stay?',
    ctaLabel: 'Check availability',
    secondaryLabel: 'Explore La Caleta',
  },
  es: {
    eyebrow: 'EL APARTAMENTO',
    title: 'Apartamento vacacional con vistas al mar en La Caleta, Tenerife',
    intro:
      'Un apartamento renovado para hasta 2 personas en Costa Caleta, La Caleta. Disfruta de un dormitorio con cama doble, un sofá cama, terraza soleada, vistas al mar y a la montaña y piscina comunitaria.',
    sections: [
      {
        title: 'Una estancia cómoda para dos',
        paragraphs: [
          'El apartamento está pensado para parejas o dos viajeros que quieren disfrutar de Tenerife con independencia. Hay un dormitorio con una cama doble y un sofá cama para dos personas en el salón. La estancia está pensada para hasta 2 personas.',
          'El salón comunica con la terraza soleada, un espacio tranquilo para desayunar, contemplar el mar y disfrutar de las temperaturas agradables de La Caleta.',
        ],
      },
      {
        title: 'Todo lo necesario para tu estancia',
        paragraphs: ['El apartamento combina la privacidad de un alojamiento vacacional con servicios prácticos para una visita cómoda.'],
        bullets: [
          'Vistas al mar y a la montaña desde el apartamento y la terraza.',
          'Cocina equipada con frigorífico, horno, placa y lavavajillas.',
          'Wi-Fi, televisión, cafetera Nespresso, hervidor, tostadora y exprimidor.',
          'Baño con ducha a ras de suelo, secador y espacio de almacenamiento.',
          'Piscina comunitaria y hamacas en la residencia.',
          'Ropa de cama, toallas, lavadora y tendedero incluidos.',
        ],
      },
      {
        title: 'Ubicación en La Caleta, Adeje',
        paragraphs: [
          'Costa Caleta se encuentra en La Caleta, un tranquilo pueblo costero de Adeje con restaurantes, bares, tiendas y paseo marítimo cerca. Es una zona ideal para relajarse junto al océano, pasear por la costa y descubrir las playas y paisajes del sur de Tenerife.',
          'Desde La Caleta también puedes llegar fácilmente a Costa Adeje Golf, Playa del Duque, Playa de la Enramada y Playa Paraíso. Antes de tu llegada recibirás información práctica para tu estancia.',
        ],
      },
      {
        title: 'Reserva directa',
        paragraphs: [
          'Consulta tus fechas en la página de reserva directa. Verás la disponibilidad actual y podrás enviar una solicitud sin intermediarios. Para preguntas prácticas, contacta directamente por WhatsApp, teléfono o correo electrónico.',
        ],
      },
    ],
    ctaTitle: '¿Listo para tu estancia en La Caleta?',
    ctaLabel: 'Ver disponibilidad',
    secondaryLabel: 'Descubre La Caleta',
  },
};

export const laCaletaGuideCopy: Record<Language, SeoPageCopy> = {
  nl: {
    eyebrow: 'LA CALETA, TENERIFE',
    title: 'Ontdek La Caleta en Costa Adeje',
    intro:
      'La Caleta is een rustige kustplaats in het zuiden van Tenerife. Vanuit Costa Caleta ontdekt u de oceaan, lokale restaurants, wandelroutes, stranden en de bekende omgeving van Costa Adeje.',
    sections: [
      {
        title: 'Een kustplaats met karakter',
        paragraphs: [
          'La Caleta staat bekend om de ontspannen sfeer, de kustlijn en de combinatie van lokale Canarische restaurants met het landschap van Zuid-Tenerife. U kunt er rustig wandelen, een tafel aan zee zoeken of de zonsondergang bewonderen.',
          'De promenade en de kleine baaien maken de omgeving geschikt voor reizigers die strand, natuur en gastronomie willen combineren zonder in een druk uitgaansgebied te verblijven.',
        ],
      },
      {
        title: 'Restaurants, winkels en dagelijkse voorzieningen',
        paragraphs: [
          'In en rond La Caleta vindt u restaurants, bars, winkels en een supermarkt voor de dagelijkse boodschappen. Daardoor kunt u veel praktische zaken te voet regelen en hoeft u niet voor elke maaltijd of boodschap de auto te nemen.',
          'De accommodatie is een handige uitvalsbasis voor een rustige vakantie met twee personen: begin de dag op het terras en plan daarna een wandeling, stranddag of uitstap in Adeje.',
        ],
      },
      {
        title: 'Wandelen, stranden en golf',
        paragraphs: [
          'Langs de kust kunt u richting Costa Adeje wandelen en onderweg verschillende baaien en stranden ontdekken. Playa del Duque, Playa de la Enramada en Playa Paraiso behoren tot de bekende opties in de omgeving.',
          'Wie graag golft, kan Costa Adeje Golf bezoeken. Voor een langere daguitstap zijn ook natuurgebieden, uitzichtpunten en andere kustplaatsen in het zuiden van Tenerife bereikbaar.',
        ],
      },
      {
        title: 'Praktisch voor uw verblijf',
        paragraphs: [
          'Costa Caleta ligt in Adeje, in het zuiden van Tenerife. Voor uw aankomst ontvangt u informatie over de sleuteloverdracht, check-in, check-out en de praktische werking van het appartement. De woning heeft één slaapkamer en is geschikt voor een verblijf met tot 2 personen.',
          'Wilt u vooral rust, zeezicht, een zonnig terras en restaurants in de buurt? Dan is La Caleta een sterke uitvalsbasis om Tenerife op eigen tempo te ontdekken.',
        ],
      },
    ],
    ctaTitle: 'Verblijf in La Caleta',
    ctaLabel: 'Bekijk het appartement',
    secondaryLabel: 'Controleer beschikbaarheid',
  },
  en: {
    eyebrow: 'LA CALETA, TENERIFE',
    title: 'Discover La Caleta and Costa Adeje',
    intro:
      'La Caleta is a peaceful coastal village in southern Tenerife. From Costa Caleta you can enjoy the ocean, local restaurants, coastal walks, beaches and the wider Costa Adeje area.',
    sections: [
      {
        title: 'A coastal village with character',
        paragraphs: [
          'La Caleta is known for its relaxed atmosphere, coastline and mix of local Canarian restaurants and southern Tenerife landscapes. Take a quiet walk, find a table by the ocean or watch the sunset nearby.',
          'The promenade and small coastal bays make the area ideal for travellers who want to combine beaches, nature and food without staying in a busy nightlife resort.',
        ],
      },
      {
        title: 'Restaurants, shops and everyday essentials',
        paragraphs: [
          'La Caleta and its surroundings offer restaurants, bars, shops and a supermarket for everyday supplies. Many practical needs can be handled nearby, so you do not need to drive for every meal or small purchase.',
          'The apartment is a convenient base for a two-person holiday: start the day on the terrace and then choose a coastal walk, beach day or excursion in Adeje.',
        ],
      },
      {
        title: 'Walks, beaches and golf',
        paragraphs: [
          'Follow the coast towards Costa Adeje and discover different bays and beaches along the way. Playa del Duque, Playa de la Enramada and Playa Paraiso are well-known options in the area.',
          'Golfers can visit Costa Adeje Golf, while longer day trips can take you to viewpoints, natural areas and other coastal towns in southern Tenerife.',
        ],
      },
      {
        title: 'Practical information for your stay',
        paragraphs: [
          'Costa Caleta is in Adeje in the south of Tenerife. Before arrival, guests receive information about key handover, check-in, check-out and using the apartment. The property has one bedroom and is suitable for up to 2 people.',
          'If you are looking for sea views, a sunny terrace, nearby restaurants and a relaxed base for exploring Tenerife, La Caleta is an excellent choice.',
        ],
      },
    ],
    ctaTitle: 'Stay in La Caleta',
    ctaLabel: 'View the apartment',
    secondaryLabel: 'Check availability',
  },
  es: {
    eyebrow: 'LA CALETA, TENERIFE',
    title: 'Descubre La Caleta y Costa Adeje',
    intro:
      'La Caleta es un tranquilo pueblo costero del sur de Tenerife. Desde Costa Caleta puedes disfrutar del océano, restaurantes locales, paseos junto a la costa, playas y toda la zona de Costa Adeje.',
    sections: [
      {
        title: 'Un pueblo costero con personalidad',
        paragraphs: [
          'La Caleta destaca por su ambiente relajado, su costa y la combinación de restaurantes canarios con el paisaje del sur de Tenerife. Puedes pasear tranquilamente, buscar una mesa junto al mar o contemplar la puesta de sol.',
          'El paseo marítimo y las pequeñas calas hacen que la zona sea ideal para combinar playa, naturaleza y gastronomía sin alojarse en una zona de ocio nocturno más concurrida.',
        ],
      },
      {
        title: 'Restaurantes, tiendas y servicios diarios',
        paragraphs: [
          'En La Caleta y sus alrededores encontrarás restaurantes, bares, tiendas y un supermercado para las compras diarias. Puedes resolver muchas necesidades cerca del apartamento y no tendrás que utilizar el coche para cada comida o compra.',
          'El apartamento es una base cómoda para unas vacaciones de dos personas: empieza el día en la terraza y después elige un paseo costero, una playa o una excursión por Adeje.',
        ],
      },
      {
        title: 'Paseos, playas y golf',
        paragraphs: [
          'Sigue la costa hacia Costa Adeje y descubre diferentes calas y playas por el camino. Playa del Duque, Playa de la Enramada y Playa Paraíso son algunas opciones conocidas de la zona.',
          'Los aficionados al golf pueden visitar Costa Adeje Golf y, para excursiones más largas, también hay miradores, espacios naturales y otros pueblos costeros en el sur de Tenerife.',
        ],
      },
      {
        title: 'Información práctica para tu estancia',
        paragraphs: [
          'Costa Caleta se encuentra en Adeje, en el sur de Tenerife. Antes de tu llegada recibirás información sobre la entrega de llaves, el check-in, el check-out y el funcionamiento del apartamento. La vivienda tiene un dormitorio y es adecuada para hasta 2 personas.',
          'Si buscas vistas al mar, una terraza soleada, restaurantes cerca y una base tranquila para descubrir Tenerife, La Caleta es una excelente opción.',
        ],
      },
    ],
    ctaTitle: 'Alójate en La Caleta',
    ctaLabel: 'Ver el apartamento',
    secondaryLabel: 'Consultar disponibilidad',
  },
};
