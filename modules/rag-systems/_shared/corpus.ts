/**
 * A small made-up document set used across the RAG Systems track: citizen help pages from
 * the fictional Kalpanagar Municipal Corporation (NMC). Every rule, date and fee is invented.
 */

export interface Doc {
  id: string;
  title: string;
  /** Paragraphs, in order. Modules chunk them in different ways. */
  paras: string[];
}

export const CORPUS: Doc[] = [
  {
    id: "property-tax",
    title: "Property tax 2026–27",
    paras: [
      "Property tax for 2026–27 is due by 31 July 2026. Owners who pay the full year's tax by 30 April 2026 receive a 5% rebate.",
      "Tax not paid by 31 July attracts a penalty of 2% of the unpaid amount for each month of delay.",
      "You can pay online on the NMC citizen portal with UPI, net banking or a card, or in person at any ward office. Keep the receipt: it is needed for many other NMC services.",
    ],
  },
  {
    id: "birth-death",
    title: "Birth and death certificates",
    paras: [
      "Births and deaths in Kalpanagar must be registered with the NMC within 21 days. Hospitals register births that happen in them; for a birth at home, a parent registers it at the ward office.",
      "Certificates can be downloaded from the NMC citizen portal once registration is complete. Printed copies cost ₹20 each and are ready in 7 working days.",
    ],
  },
  {
    id: "water",
    title: "New water connection",
    paras: [
      "To apply for a new water connection, bring the latest property tax receipt, proof of ownership or a rent agreement with the owner's consent, and an identity proof such as Aadhaar or a voter ID.",
      "The connection fee is ₹500, plus a refundable deposit of ₹3,000. A meter is fitted with every new connection.",
      "The NMC completes new connections within 15 working days of a complete application.",
    ],
  },
  {
    id: "waste",
    title: "Garbage collection",
    paras: [
      "Wet waste is collected every day between 7 and 10 am. Dry waste is collected on Wednesdays and Saturdays.",
      "Households must keep wet and dry waste separate. Handing over mixed waste can lead to a fine of ₹200.",
      "Garden waste and old furniture are collected on request: book a bulk pickup on the NMC citizen portal.",
    ],
  },
  {
    id: "trade",
    title: "Trade licence",
    paras: [
      "Every shop, restaurant or workshop in Kalpanagar needs a trade licence from the NMC.",
      "Licences must be renewed every year by 31 March. Late renewal costs ₹100 for each month of delay.",
    ],
  },
  {
    id: "grievance",
    title: "Complaints and grievances",
    paras: [
      "Complaints about roads, streetlights, water or garbage can be filed on the NMC citizen portal or at a ward office. Every complaint gets a tracking number.",
      "The NMC aims to respond to a complaint within 3 working days. If it is not resolved in 15 working days, it is escalated to the zonal commissioner.",
    ],
  },
];
