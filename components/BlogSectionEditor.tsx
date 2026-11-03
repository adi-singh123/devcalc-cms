"use client";

import RichTextEditor from "@/components/RichTextEditor";
import { Field } from "@/components/EditorFields";

export type Section = { heading: string; paragraphs: string[]; bodyHtml?: string; points?: string[]; image?: { src: string; alt: string; caption?: string }; table?: { headers: string[]; rows: string[][] }; code?: { language: string; content: string; caption?: string } };

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function initialHtml(section: Section) {
  if (section.bodyHtml) return section.bodyHtml;
  const paragraphs = section.paragraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
  const points = section.points?.length ? `<ul>${section.points.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
  const table = section.table?.headers.length ? `<table><thead><tr>${section.table.headers.map((item) => `<th>${escapeHtml(item)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>` : "";
  const image = section.image?.src ? `<img src="${escapeHtml(section.image.src)}" alt="${escapeHtml(section.image.alt)}">${section.image.caption ? `<p><em>${escapeHtml(section.image.caption)}</em></p>` : ""}` : "";
  const code = section.code?.content ? `<pre><code>${escapeHtml(section.code.content)}</code></pre>${section.code.caption ? `<p><em>${escapeHtml(section.code.caption)}</em></p>` : ""}` : "";
  return paragraphs + points + table + image + code;
}

export default function BlogSectionEditor({ item, index, onChange, onRemove }: { item: Section; index: number; onChange: (patch: Partial<Section>) => void; onRemove: () => void }) {
  return <div className="section stack"><div className="row between"><strong>Section {index + 1}</strong><button className="danger" type="button" onClick={onRemove}>Remove</button></div>
    <Field label="Heading" value={item.heading} onChange={(heading) => onChange({ heading })} required />
    <RichTextEditor label="Section content" value={initialHtml(item)} onChange={(bodyHtml) => onChange({ bodyHtml, points: undefined, table: undefined, image: undefined, code: undefined })} hint="Existing paragraphs, lists, tables, images and code are loaded here. The public article keeps this formatting after saving." />
  </div>;
}
