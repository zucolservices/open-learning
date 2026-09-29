/** Parsing tools, as checked in September 2026. Licences and names change; verify before choosing. */

export type ToolGroup = "library" | "managed" | "vision";

export interface Tool {
  name: string;
  by: string;
  group: ToolGroup;
  note: string;
}

export const TOOLS: Tool[] = [
  {
    name: "Docling",
    by: "IBM Research, now LF AI & Data · MIT",
    group: "library",
    note: "Converts PDFs, Office files and images into a structured document with layout, reading order and tables (its TableFormer model), and exports Markdown or JSON.",
  },
  {
    name: "Unstructured",
    by: "Unstructured · Apache-2.0, plus a paid platform",
    group: "library",
    note: "Splits many file types into typed elements (titles, paragraphs, tables), ready for chunking. The hosted platform adds connectors and scale.",
  },
  {
    name: "Marker",
    by: "Datalab · Apache-2.0 code, restricted model weights",
    group: "library",
    note: "PDF to Markdown with layout models. The code became Apache-2.0 in July 2026; the model weights are free only for research, personal use and small companies.",
  },
  {
    name: "MinerU",
    by: "OpenDataLab · Apache-2.0 with extra terms",
    group: "library",
    note: "Layout analysis, tables and formulas for complex PDFs. Its licence adds conditions for very large commercial users.",
  },
  {
    name: "pdfplumber",
    by: "MIT",
    group: "library",
    note: "Gives you every character with its position, plus table extraction. The table fix in this module used it.",
  },
  {
    name: "PyMuPDF",
    by: "Artifex · AGPL or commercial",
    group: "library",
    note: "Fast text and image extraction. Check the licence: AGPL obliges you to share source in many uses.",
  },
  {
    name: "Poppler (pdftotext)",
    by: "GPL",
    group: "library",
    note: "Command-line classic. Default mode outputs text in reading order; -layout keeps the visual layout. The two-column fix here used it.",
  },
  {
    name: "Tesseract",
    by: "Apache-2.0 · version 5.5",
    group: "library",
    note: "Open-source OCR with an LSTM engine and Hindi models; mix languages with -l hin+eng. Works best on scans of 300 DPI or more.",
  },
  {
    name: "Azure Document Intelligence",
    by: "Microsoft · in Foundry Tools",
    group: "managed",
    note: "Layout model returns text, tables and structure, including Markdown. Reads printed Hindi (not handwritten Hindi).",
  },
  {
    name: "Amazon Textract",
    by: "AWS",
    group: "managed",
    note: "Text, tables, forms and layout. It doesn't read Hindi: its supported languages are English, Spanish, Italian, Portuguese, French and German.",
  },
  {
    name: "Google Document AI",
    by: "Google Cloud",
    group: "managed",
    note: "OCR, Form Parser and Layout Parser (with Gemini-powered previews). Lists Hindi among its OCR languages.",
  },
  {
    name: "LlamaParse",
    by: "LlamaIndex · hosted, paid tiers",
    group: "managed",
    note: "Hosted parsing tuned for RAG, returning Markdown. LlamaIndex also offers a local open-source parser.",
  },
  {
    name: "Mistral OCR",
    by: "Mistral AI · hosted",
    group: "vision",
    note: "A model that reads page images into Markdown, including tables. Launched March 2025; version 3 in December 2025, priced per thousand pages.",
  },
  {
    name: "olmOCR",
    by: "Allen Institute for AI · open weights",
    group: "vision",
    note: "An open vision-language model fine-tuned to turn page images into clean text. Trained on English documents only.",
  },
];
