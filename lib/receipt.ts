import { ReceiptData, ReceiptItem } from "@/types/receipt";

function lineToHtml(item: ReceiptItem): string {
  const sizeMap: Record<string, string> = {
    small: "font-size:12px",
    normal: "font-size:14px",
    big: "font-size:18px",
  };
  const fontWeight = item.is_bold ? "font-weight:700" : "font-weight:400";
  const label = item["pre-text"] ?? "";
  const content = item.content ?? "";
  const end = item["end_1"] ?? ""; // includes line breaks
  const style = `${sizeMap[item.text_size] || sizeMap.normal}; ${fontWeight};`;
  // preserve spaces in labels for alignment (API sometimes prefixes label with spaces)
  return `<div style="${style}; white-space: pre-wrap;">${label}${content}${end}</div>`;
}

export function generateReceiptHtml(data: ReceiptData): string {
  const header = `
    <div style="text-align:left; font-weight:700; font-size:18px;">${data.receipt_number}</div>
  `;
  const lines = data.receipt.map(lineToHtml).join("");

  const css = `
    <style>
      @page { size: 80mm auto; margin: 6mm; }
      body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      .receipt { width: 72mm; }
      .divider { border-top: 1px dashed #999; margin: 8px 0; }
    </style>
  `;

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        ${css}
        <title>Receipt ${data.receipt_number}</title>
      </head>
      <body>
        <div class="receipt">
          ${lines}
        </div>
      </body>
    </html>
  `;
}

export function openPrintWindow(data: ReceiptData) {
  const html = generateReceiptHtml(data);
  const w = window.open("", "PRINT", "height=700,width=480");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
  // do not auto-close; let user decide
}
