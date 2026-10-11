/** A made-up café's photo-upload feature: six weaknesses and scenarios that test them. Attacks described in words. */

export const FIXES: { id: string; problem: string; fix: string }[] = [
  {
    id: "stream",
    problem: "Reads the whole upload into memory, then saves it",
    fix: "Client uploads straight to object storage with a short-lived pre-signed link",
  },
  {
    id: "name",
    problem: "Saves the file under the name the user gave",
    fix: "Server picks a random key; the original name is kept only as metadata",
  },
  {
    id: "type",
    problem: "Trusts the Content-Type the browser sends",
    fix: "Checks the file's first bytes and an allowlist of extensions",
  },
  { id: "size", problem: "No size limit", fix: "A size limit enforced by the upload policy" },
  {
    id: "serve",
    problem: "Serves uploads from the main site's domain as-is",
    fix: "Serves from a separate domain with Content-Disposition: attachment and nosniff",
  },
  {
    id: "scan",
    problem: "Files are live the moment they arrive",
    fix: "Files stay quarantined until a malware scan passes",
  },
];

export const SCENARIOS: {
  id: string;
  label: string;
  needs: string[];
  pass: string;
  fail: string;
}[] = [
  {
    id: "big",
    label: "Ten customers upload 4 GB videos at once",
    needs: ["stream", "size"],
    pass: "Rejected above the limit; app servers never carry the bytes.",
    fail: "Servers run out of memory and crash for everyone.",
  },
  {
    id: "path",
    label: "A file name crafted to climb out of the uploads folder (described)",
    needs: ["name"],
    pass: "Ignored: the server chose the storage key.",
    fail: "The file overwrites something outside the uploads folder.",
  },
  {
    id: "html",
    label: "A web page renamed to look like a photo (described)",
    needs: ["type", "serve"],
    pass: "Its first bytes aren't an image, and even if served it downloads rather than runs.",
    fail: "Opened on the main domain, it runs scripts as the café's site.",
  },
  {
    id: "malware",
    label: "A photo bundle carrying known malware (described)",
    needs: ["scan"],
    pass: "Caught by the scan and never made available.",
    fail: "Other customers download it.",
  },
];
