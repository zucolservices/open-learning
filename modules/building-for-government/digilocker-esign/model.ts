/** A scholarship application, step by step: the paper way versus documents from the issuer and eSign. */

export interface Step {
  title: string;
  paper: string;
  paperCost: string;
  digital: string;
  digitalCost: string;
}

export const STEPS: Step[] = [
  {
    title: "Prove marks in Class 12",
    paper: "Photocopy the marksheet and get it attested by a gazetted officer.",
    paperCost: "A day off school, a queue, a fee.",
    digital: "Click “Fetch from DigiLocker”: the board's own copy arrives, digitally signed.",
    digitalCost: "Seconds.",
  },
  {
    title: "Prove family income",
    paper: "Upload a scan of the income certificate.",
    paperCost: "Scans can be edited; the department can't tell.",
    digital: "The certificate is pulled from the revenue department that issued it.",
    digitalCost: "Genuine by construction.",
  },
  {
    title: "Department checks the documents",
    paper: "A clerk compares scans with registers, or writes to the issuer.",
    paperCost: "Slow, and a common source of delay.",
    digital:
      "No need to check authenticity: issued documents are at par with physical originals under the IT rules.",
    digitalCost: "Staff check eligibility, not forgeries.",
  },
  {
    title: "Sign the declaration",
    paper: "Print, sign in ink, scan and upload.",
    paperCost: "Needs a printer and a scanner.",
    digital: "eSign: confirm with an OTP; a one-time certificate signs the document.",
    digitalCost: "Legally valid under the IT Act.",
  },
  {
    title: "Keep the record",
    paper: "Files in a cupboard, copies of copies.",
    paperCost: "Hard to search, easy to lose.",
    digital: "A signed electronic record that shows who issued and who signed it.",
    digitalCost: "Searchable and verifiable for years.",
  },
];
