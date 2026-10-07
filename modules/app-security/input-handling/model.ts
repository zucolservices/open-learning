/** An upload service and the checks that decide which (described) files get through. */

export type Check = "ext" | "magic" | "size" | "rename" | "outside" | "unzip";

export const CHECKS: { id: Check; name: string; detail: string }[] = [
  {
    id: "ext",
    name: "Allow only .jpg, .png, .pdf",
    detail: "An allow-list of extensions, checked on the last one.",
  },
  {
    id: "magic",
    name: "Check the real file type",
    detail: "Read the file's first bytes; ignore the type the browser claims.",
  },
  {
    id: "size",
    name: "Limit size to 10 MB",
    detail: "Refuse anything bigger, before reading it all.",
  },
  {
    id: "rename",
    name: "Server picks the file name",
    detail: "A random name; the user's name is only a label.",
  },
  {
    id: "outside",
    name: "Store outside the website",
    detail: "Uploads can't be opened as pages or run as code.",
  },
  {
    id: "unzip",
    name: "Limit decoded size",
    detail: "Stop decoding an image or archive past a set size.",
  },
];

export interface Upload {
  id: string;
  name: string;
  truth: string;
  harmful: boolean;
  blockedBy: Check[];
  harm: string;
}

export const UPLOADS: Upload[] = [
  {
    id: "photo",
    name: "holiday.jpg · 2 MB",
    truth: "A real photo",
    harmful: false,
    blockedBy: [],
    harm: "",
  },
  {
    id: "pdf",
    name: "invoice.pdf · 300 KB",
    truth: "A real PDF",
    harmful: false,
    blockedBy: [],
    harm: "",
  },
  {
    id: "double",
    name: "avatar.jpg.php · 5 KB",
    truth: "A server script with a double extension",
    harmful: true,
    blockedBy: ["ext", "magic", "outside"],
    harm: "Opened through the website, it runs on your server.",
  },
  {
    id: "liar",
    name: "cat.png · claims image/png",
    truth: "A program wearing an image's label",
    harmful: true,
    blockedBy: ["magic"],
    harm: "Other users download malware from your site.",
  },
  {
    id: "huge",
    name: "big.png · 4 GB",
    truth: "A real but enormous image",
    harmful: true,
    blockedBy: ["size"],
    harm: "Disk and memory fill up; the service falls over.",
  },
  {
    id: "climb",
    name: "a name that climbs up folders",
    truth: "A path like “up two folders, then config”",
    harmful: true,
    blockedBy: ["rename"],
    harm: "Overwrites a file outside the uploads folder (path traversal).",
  },
  {
    id: "bomb",
    name: "tiny.png · 40 KB",
    truth: "Decodes to a 50,000 × 50,000-pixel picture",
    harmful: true,
    blockedBy: ["unzip"],
    harm: "Decoding it exhausts the server's memory.",
  },
];

export const blocked = (u: Upload, on: Check[]) => u.blockedBy.some((c) => on.includes(c));

export type DateCase = "good" | "shape" | "meaning";

export const DATES: { id: DateCase; label: string; caught: string }[] = [
  {
    id: "good",
    label: "Check-in 20 Oct 2026, check-out 23 Oct 2026",
    caught: "Accepted: right shape, and it makes sense.",
  },
  {
    id: "shape",
    label: "Check-in “45/13/2026”",
    caught: "Rejected by the shape (syntax) check: there's no 13th month.",
  },
  {
    id: "meaning",
    label: "Check-in 23 Oct, check-out 20 Oct",
    caught:
      "Right shape, but rejected by the meaning (semantics) check: you can't leave before you arrive.",
  },
];
