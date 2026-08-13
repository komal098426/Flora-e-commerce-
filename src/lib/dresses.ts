export type Availability = "Made to order" | "Limited availability";

export type Dress = {
  id: string;
  name: string;
  descriptor: string;
  detail: string;
  price: string;
  image: string;
  tone: [string, string];
  productReference: string;
  availability: Availability;
  availabilityNote?: string;
  leadTime: string;
  fabric: string;
  construction: string;
  fit: string;
  careNote: string;
  sizes: string[];
};

export const STANDARD_SIZES = [
  "UK 6",
  "UK 8",
  "UK 10",
  "UK 12",
  "UK 14",
  "UK 16",
  "Made to measure",
];

export const CARE_INSTRUCTIONS = [
  "Professional dry clean only — do not machine or hand wash.",
  "Store on a padded hanger inside a breathable garment bag, away from direct light.",
  "Steam on the reverse side only; never press directly over beading or appliqué.",
  "Keep away from perfume, hairspray, and deodorant during dressing.",
  "For travel, lay flat in tissue paper inside a hard garment case where possible.",
];

export const DELIVERY_INFO = {
  regions: "United Kingdom and EU as standard; international delivery arranged individually.",
  method:
    "Insured, tracked courier for all made-to-order pieces. A signature is required on delivery.",
  cost: "Included within the UK. International costs are confirmed at enquiry.",
  returns:
    "Made-to-order and altered pieces are final sale. Your first fitting is included in the price; further alterations are quoted separately.",
};

export const CUSTOMISATION_NOTE =
  "Hem length, sleeve length, and strap placement can be adjusted at your first fitting. Colourway and embellishment changes may be possible on request — ask us when you enquire.";

export const dresses: Dress[] = [
  {
    id: "emerald-bloom",
    name: "Emerald Bloom Gown",
    descriptor: "Structured crepe, emerald florals, sheer cape sleeves",
    detail:
      "A sculpted high-neck column falls into dramatic sheer cape sleeves, with hand-set emerald and black rose appliqué tracing the body from collar to hem.",
    price: "£3,800",
    image: "/dresses/emerald-bloom-gown.jpg",
    tone: ["#0d1f16", "#1c4a34"],
    productReference: "FD-EMB-01",
    availability: "Made to order",
    leadTime: "8–10 weeks",
    fabric: "Silk-blend crepe body with sheer silk tulle cape sleeves and hand-appliquéd rose and foliate motifs.",
    construction: "Boned bodice lining, concealed back zip, fully lined skirt with a light sweep train.",
    fit: "Fitted through the bodice and hip, floor length, high mandarin collar.",
    careNote: "Handle the sculpted appliqué and sheer sleeves with particular care when dressing and storing.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "noir-vine",
    name: "Noir Vine Gown",
    descriptor: "Sheer bishop sleeves, gilt florals, black chiffon",
    detail:
      "Sheer bishop sleeves and a gathered high neckline open into a full black chiffon skirt, traced top to hem in gold vine embroidery and sculpted florals.",
    price: "£3,200",
    image: "/dresses/noir-vine-gown.jpg",
    tone: ["#15130f", "#3a2f14"],
    productReference: "FD-NVN-02",
    availability: "Made to order",
    leadTime: "8–10 weeks",
    fabric: "Silk chiffon skirt and sleeves over a matte crepe bodice, with metallic gilt-thread embroidery.",
    construction: "Gathered high neckline, sheer cuffed bishop sleeves, concealed back zip, fully lined bodice.",
    fit: "Semi-fitted bodice with a full A-line skirt, floor length.",
    careNote: "Metallic embroidery should never be ironed directly; steam only, on the reverse.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "meridian",
    name: "Meridian Gown",
    descriptor: "Duchesse satin, sage & ivory colour-block, pearl button",
    detail:
      "A diagonal colour-block seam in sage and ivory satin wraps the body, closed with a single row of hand-sewn pearl buttons at the collar.",
    price: "£2,600",
    image: "/dresses/meridian-colourblock-gown.jpg",
    tone: ["#aab89a", "#e8e2d3"],
    productReference: "FD-MER-03",
    availability: "Made to order",
    leadTime: "6–8 weeks",
    fabric: "Duchesse satin, colour-blocked, with hand-sewn pearl button trim at the collar.",
    construction: "Fitted princess seams, sweep train, concealed back zip.",
    fit: "Body-skimming through the waist, high funnel neck, long fitted sleeves, floor length.",
    careNote: "Satin shows marks easily — avoid contact with jewellery and rough surfaces while dressing.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "gilded-rosette",
    name: "Gilded Rosette Gown",
    descriptor: "Champagne duchesse satin, sweetheart neckline, emerald bows",
    detail:
      "An off-shoulder sweetheart bodice in pearl-strewn champagne satin opens into a princess-cut ball skirt, finished with emerald grosgrain bows and hand-beaded leaf embroidery.",
    price: "£6,900",
    image: "/dresses/gilded-rosette-gown.jpg",
    tone: ["#e9d9ae", "#3d4a2e"],
    productReference: "FD-GRT-04",
    availability: "Limited availability",
    availabilityNote: "One sample piece remaining at this size — enquire for made-to-order timing.",
    leadTime: "10–12 weeks",
    fabric: "Champagne duchesse satin with hand-beaded pearl and gilt embroidery and grosgrain ribbon bows.",
    construction: "Structured off-shoulder bodice with internal boning, full princess-cut skirt with underlay support.",
    fit: "Fitted bodice with a dramatic full ball skirt, floor length.",
    careNote: "The boned bodice should be stored upright on a padded hanger, never folded.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "crimson-bloom",
    name: "Crimson Bloom Gown",
    descriptor: "Structured crepe, crimson florals, sheer cape sleeves",
    detail:
      "The sister silhouette to our Emerald Bloom, cut from the same sculpted column with sheer cape sleeves — here traced in deep crimson roses and black foliate appliqué.",
    price: "£3,800",
    image: "/dresses/crimson-bloom-gown.jpg",
    tone: ["#f4efe6", "#7a1620"],
    productReference: "FD-CRB-05",
    availability: "Made to order",
    leadTime: "8–10 weeks",
    fabric: "Silk-blend crepe body with sheer silk tulle cape sleeves and hand-appliquéd rose and foliate motifs.",
    construction: "Boned bodice lining, concealed back zip, fully lined skirt with a light sweep train.",
    fit: "Fitted through the bodice and hip, floor length, high mandarin collar.",
    careNote: "Handle the sculpted appliqué and sheer sleeves with particular care when dressing and storing.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "cardinal-ribbon",
    name: "Cardinal Ribbon Gown",
    descriptor: "Ivory satin, oxblood underskirt, hand-tied ribbons",
    detail:
      "An off-shoulder sweetheart ball gown in ivory satin, its bodice laced with beaded branches and finished in a cascade of oxblood grosgrain bows over a wine-dark underskirt.",
    price: "£4,400",
    image: "/dresses/cardinal-ribbon-gown.jpg",
    tone: ["#f4efe6", "#6e1423"],
    productReference: "FD-CDR-06",
    availability: "Made to order",
    leadTime: "8–10 weeks",
    fabric: "Ivory satin with an oxblood silk underskirt, hand-tied grosgrain ribbon bows and beaded branch embroidery.",
    construction: "Off-shoulder sweetheart bodice, structured underskirt, concealed back zip.",
    fit: "Fitted bodice with a full ball skirt, floor length.",
    careNote: "Ribbon bows are hand-tied and detachable for travel — ask your fitter to show you how.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "ivory-garden",
    name: "Ivory Garden Gown",
    descriptor: "Ivory satin, cathedral train, hand-set florals",
    detail:
      "A high-neck, long-sleeve ball gown finished with a cathedral train, scattered top to hem with hand-set crimson and ivory florals and fine gold embroidery.",
    price: "£7,200",
    image: "/dresses/ivory-garden-gown.jpg",
    tone: ["#f4efe6", "#8a2430"],
    productReference: "FD-IVG-07",
    availability: "Made to order",
    leadTime: "10–12 weeks",
    fabric: "Ivory duchesse satin with hand-set floral appliqué and fine gold-thread embroidery.",
    construction: "Fitted long-sleeve bodice, full ball skirt, detachable cathedral train, concealed back zip.",
    fit: "High neck, fitted through the bodice, floor length with an extended train.",
    careNote: "The cathedral train should be steamed flat and carried, never dragged, between fittings.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "midnight-sapphire",
    name: "Midnight Sapphire Gown",
    descriptor: "Draped satin, one shoulder, thigh-high slit",
    detail:
      "A one-shoulder gown in draped navy satin meets a fluid silver underlay through a thigh-high slit, anchored by a crystal shoulder brooch and hand-beaded branch embroidery.",
    price: "£2,900",
    image: "/dresses/midnight-sapphire-gown.jpg",
    tone: ["#141b33", "#8a93a8"],
    productReference: "FD-MDS-08",
    availability: "Made to order",
    leadTime: "6–8 weeks",
    fabric: "Draped silk satin with metallic thread embroidery and a crystal shoulder brooch.",
    construction: "Ruched one-shoulder bodice, thigh-high slit, concealed side zip, light sweep train.",
    fit: "Fitted through the hip, one shoulder, floor length.",
    careNote: "The crystal brooch is removable — take it off before storing or travelling with the gown.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "camellia-tulle",
    name: "Camellia Tulle Gown",
    descriptor: "Layered tulle, fuchsia florals, asymmetric shoulder",
    detail:
      "Layers of ivory tulle scattered with heart-shaped crystals fall from an asymmetric one-shoulder bodice, gathered with oversized fuchsia and ivory blooms at the waist.",
    price: "£3,600",
    image: "/dresses/camellia-tulle-gown.jpg",
    tone: ["#f4efe6", "#c23a72"],
    productReference: "FD-CAM-09",
    availability: "Made to order",
    leadTime: "8–10 weeks",
    fabric: "Layered silk tulle with hand-set floral appliqué and scattered crystal detailing.",
    construction: "Asymmetric one-shoulder bodice, gathered waist florals, fully lined tulle skirt.",
    fit: "Fitted bodice, full tulle skirt, floor length.",
    careNote: "Tulle catches easily on jewellery and rough hands — dress with care and store unfolded.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "noir-blush",
    name: "Noir Blush Gown",
    descriptor: "Layered organza, noir & blush ruffles, sculpted roses",
    detail:
      "A strapless silhouette built entirely from layered black and blush organza ruffles, gathered with oversized sculpted roses at the bodice and hip.",
    price: "£5,400",
    image: "/dresses/noir-blush-gown.jpg",
    tone: ["#1a1414", "#e7b9c0"],
    productReference: "FD-NRB-10",
    availability: "Limited availability",
    availabilityNote: "One sample piece remaining at this size — enquire for made-to-order timing.",
    leadTime: "10–12 weeks",
    fabric: "Layered silk organza with hand-sculpted rose appliqué.",
    construction: "Strapless structured bodice, tiered ruffle skirt, concealed back zip and hook closures.",
    fit: "Strapless, voluminous through the skirt, floor length.",
    careNote: "The layered ruffles need room to breathe — store on a wide hanger, never folded.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "lilac-crystal",
    name: "Lilac Crystal Gown",
    descriptor: "Draped satin, lilac, crystal shoulder bloom",
    detail:
      "A single crystal-embroidered shoulder anchors this draped lilac satin gown, its high slit and fluid ruffled train built for movement on the dance floor.",
    price: "£2,800",
    image: "/dresses/lilac-crystal-gown.jpg",
    tone: ["#b7b3dc", "#e4defa"],
    productReference: "FD-LIL-11",
    availability: "Made to order",
    leadTime: "6–8 weeks",
    fabric: "Draped silk satin with hand-embroidered crystal shoulder detail.",
    construction: "Ruched one-shoulder bodice, high slit, ruffled train, concealed side zip.",
    fit: "Fitted through the body, one shoulder, floor length.",
    careNote: "Crystal embroidery is hand-set — avoid snagging on fastenings when dressing.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "oxblood-lace",
    name: "Oxblood Lace Gown",
    descriptor: "Beaded lace, sheer illusion sleeves, cathedral train",
    detail:
      "A high-neck illusion bodice in hand-beaded oxblood lace opens into a full ball skirt scattered with floral appliqué and a sweeping cathedral train.",
    price: "£6,500",
    image: "/dresses/321f2988-ba4b-4bc1-9dc7-1e0aebd4d19c.jpg",
    tone: ["#4a1420", "#7a1f2b"],
    productReference: "FD-OXB-12",
    availability: "Made to order",
    leadTime: "10–12 weeks",
    fabric: "Hand-beaded corded lace with silk tulle illusion sleeves and bodice panel, fully silk-lined skirt.",
    construction: "High-neck illusion bodice, full ball skirt, detachable cathedral train, concealed back zip.",
    fit: "Fitted bodice, high neck, floor length with an extended train.",
    careNote: "Beaded lace should never be steamed directly — press only from the lining side.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "winter-rose",
    name: "Winter Rose Gown",
    descriptor: "Beaded bodice, navy rose corsage, tiered train",
    detail:
      "A strapless hand-beaded bodice is finished with a sculpted navy and ivory rose corsage at the hip, falling into a tiered, jewel-draped organza train.",
    price: "£4,200",
    image: "/dresses/winter-rose-gown.jpg",
    tone: ["#e7e6ee", "#1c2340"],
    productReference: "FD-WTR-13",
    availability: "Made to order",
    leadTime: "8–10 weeks",
    fabric: "Hand-beaded bodice with a sculpted rose corsage and layered silk organza train.",
    construction: "Strapless structured bodice, tiered draped train, concealed back zip.",
    fit: "Strapless, fitted through the bodice, floor length with a tiered train.",
    careNote: "The rose corsage is hand-sewn in place — avoid pulling on it when dressing.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "sovereign-cape",
    name: "Sovereign Cape Gown",
    descriptor: "Gilt embroidery, burgundy cape, floral appliqué",
    detail:
      "A fitted champagne bodice in fine gilt embroidery is finished with a dramatic burgundy cape and matching floral appliqué, cut for a grand entrance.",
    price: "£4,800",
    image: "/dresses/sovereign-cape-gown.jpg",
    tone: ["#e9d9ae", "#5c1420"],
    productReference: "FD-SVC-14",
    availability: "Made to order",
    leadTime: "10–12 weeks",
    fabric: "Champagne satin with fine gilt embroidery and a detachable burgundy silk cape.",
    construction: "Fitted bodice, detachable cape with hook closure, full skirt, concealed back zip.",
    fit: "Fitted through the bodice with a dramatic attached cape, floor length.",
    careNote: "Detach the cape before sitting or travelling to protect the embroidery.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "aurelia-slip",
    name: "Aurelia Gown",
    descriptor: "Liquid satin, gold beading, thigh-high slit",
    detail:
      "A single beaded diagonal line traces this fluid champagne satin gown from shoulder to hip, opening into a thigh-high slit and soft train.",
    price: "£2,400",
    image: "/dresses/aurelia-slip-gown.jpg",
    tone: ["#efe8de", "#c9a86a"],
    productReference: "FD-AUR-15",
    availability: "Made to order",
    leadTime: "6–8 weeks",
    fabric: "Liquid satin with hand-beaded diagonal embroidery.",
    construction: "Bias-cut fitted bodice, thigh-high slit, concealed side zip, soft sweep train.",
    fit: "Fitted through the body, floor length with a high slit.",
    careNote: "Bias-cut satin should be steamed hanging, never laid flat while damp.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "briar-rose",
    name: "Briar Rose Gown",
    descriptor: "Beaded tulle, crimson roses, cathedral sleeves",
    detail:
      "Fine pearl and crystal beading covers this ivory tulle ball gown top to train, punctuated with hand-set crimson roses down the bodice and sheer cathedral sleeves.",
    price: "£6,800",
    image: "/dresses/briar-rose-gown.jpg",
    tone: ["#f4efe6", "#8a2430"],
    productReference: "FD-BRR-16",
    availability: "Made to order",
    leadTime: "10–12 weeks",
    fabric: "Hand-beaded silk tulle with crimson rose appliqué throughout.",
    construction: "High-neck bodice, sheer cathedral sleeves, full ball skirt, detachable train.",
    fit: "Fitted bodice, high neck, floor length with an extended train.",
    careNote: "Fully beaded tulle is heavy — always support the skirt when lifting the gown.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "pearl-cascade",
    name: "Pearl Cascade Gown",
    descriptor: "Ivory satin, pearl & crystal embroidery, long sleeves",
    detail:
      "A long-sleeve ivory satin ball gown traced from collar to hem in cascading pearl and crystal embroidery, gathered at the waist with a sculptural satin bow.",
    price: "£5,800",
    image: "/dresses/29cbf934-9be2-4874-aaee-deca828dd50b.jpg",
    tone: ["#f5f0e8", "#d4c9a8"],
    productReference: "FD-PRC-18",
    availability: "Made to order",
    leadTime: "10–12 weeks",
    fabric: "Ivory duchesse satin with hand-set pearl and crystal embroidery throughout.",
    construction: "Boned bodice lining, long fitted sleeves, sculpted satin bow at waist, concealed back zip, full ball skirt.",
    fit: "Fitted through the bodice, floor length, long sleeves.",
    careNote: "Pearl embroidery is hand-set — never fold or compress the bodice during storage.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "silk-flora-skirt",
    name: "Silk Flora Skirt",
    descriptor: "Champagne satin, trailing floral embroidery, A-line",
    detail:
      "A fluid A-line skirt in luminous champagne satin, its surface traced with delicate trailing floral and pearl embroidery that catches the light with every step.",
    price: "£1,800",
    image: "/dresses/37c7158c-2e8a-41e1-8126-3373bff96cce.jpg",
    tone: ["#e8dfc8", "#c9b99a"],
    productReference: "FD-SFS-19",
    availability: "Made to order",
    leadTime: "6–8 weeks",
    fabric: "Liquid champagne satin with hand-embroidered floral and pearl motifs.",
    construction: "High-waisted A-line cut, concealed side zip, fully lined.",
    fit: "High waist, full A-line silhouette, floor length.",
    careNote: "Satin shows pressure marks — store hanging and steam from the reverse side only.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "azure-tulip",
    name: "Azure Tulip Gown",
    descriptor: "White & powder blue tulle, sculpted tulip bodice, mermaid",
    detail:
      "A fitted mermaid silhouette in ivory crepe, its bodice sculpted with oversized powder-blue tulip appliqué and sheer flowing sleeves that trail like petals in motion.",
    price: "£3,400",
    image: "/dresses/405c352a-baac-45c4-b39c-d5aa34dbde4a.jpg",
    tone: ["#ddeef7", "#f4f4f4"],
    productReference: "FD-AZT-20",
    availability: "Made to order",
    leadTime: "8–10 weeks",
    fabric: "Ivory crepe base with powder-blue silk tulle appliqué and sheer flowing sleeves.",
    construction: "Fitted mermaid bodice, sculpted floral appliqué, sheer bell sleeves, concealed back zip.",
    fit: "Fitted through the body and hip, mermaid silhouette, floor length.",
    careNote: "The tulle appliqué is structured — avoid hanging near other garments that could compress the petals.",
    sizes: STANDARD_SIZES,
  },
  {
    id: "scarlet-court",
    name: "Scarlet Court Gown",
    descriptor: "Off-shoulder, gilt vine embroidery, rose-lined train",
    detail:
      "An off-shoulder sweetheart ball gown in gilt vine-embroidered ivory, its voluminous skirt lined in deep red roses for a dramatic reveal with every step.",
    price: "£4,600",
    image: "/dresses/scarlet-court-gown.jpg",
    tone: ["#f4efe6", "#7a1620"],
    productReference: "FD-SCC-17",
    availability: "Made to order",
    leadTime: "10–12 weeks",
    fabric: "Gilt vine-embroidered satin with a rose-lined silk underskirt.",
    construction: "Off-shoulder sweetheart bodice, voluminous underskirt, concealed back zip.",
    fit: "Fitted bodice, off-shoulder neckline, floor length.",
    careNote: "The rose-lined underskirt should be steamed section by section to preserve its shape.",
    sizes: STANDARD_SIZES,
  },
];

export type Look = {
  id: string;
  title: string;
  scene: string;
  dressId: string;
  tone: [string, string];
};

export const looks: Look[] = [
  {
    id: "entrance",
    title: "The Entrance",
    scene: "Full-length silhouette, low light, slow turn",
    dressId: "oxblood-lace",
    tone: ["#4a1420", "#7a1f2b"],
  },
  {
    id: "reception",
    title: "The Reception",
    scene: "Soft daylight, fluid drape, gentle motion",
    dressId: "meridian",
    tone: ["#aab89a", "#e8e2d3"],
  },
  {
    id: "afterhours",
    title: "After Hours",
    scene: "Sculpted column, directional light, still pose",
    dressId: "midnight-sapphire",
    tone: ["#141b33", "#8a93a8"],
  },
  {
    id: "processional",
    title: "The Processional",
    scene: "Cathedral train, close pleats, bridal light",
    dressId: "briar-rose",
    tone: ["#f4efe6", "#8a2430"],
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  attribution: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Every fitting felt like a conversation, not a transaction. The finished piece moved exactly as they said it would.",
    attribution: "R. Ahmadi",
    role: "Private client",
  },
  {
    id: "t2",
    quote:
      "We've styled three editorial features with this collection. The construction holds up under studio light in a way few labels manage.",
    attribution: "L. Voss",
    role: "Stylist, independent",
  },
  {
    id: "t3",
    quote:
      "A distinctive point of view, worn by real women at real events — not just on a runway. Worth the appointment.",
    attribution: "Featured in",
    role: "Field Notes Journal",
  },
];
