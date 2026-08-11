"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

function getTextContent(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (React.isValidElement(node) && node.props && (node.props as Record<string, unknown>).children) {
    return getTextContent((node.props as Record<string, unknown>).children);
  }
  return "";
}

function isElementType(element: React.ReactNode, typeName: string): boolean {
  if (!React.isValidElement(element)) return false;
  if (typeof element.type === "string") return element.type.toLowerCase() === typeName;
  if (typeof element.type === "function") return element.type.name.toLowerCase() === typeName;
  return false;
}

function SortableTable({ children, ...props }: React.ComponentPropsWithoutRef<"table">) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const childArray = React.Children.toArray(children);
  const thead = childArray.find((child) => isElementType(child, "thead"));
  const tbody = childArray.find((child) => isElementType(child, "tbody"));

  if (!thead || !tbody || !React.isValidElement(thead) || !React.isValidElement(tbody)) {
    return <table {...props}>{children}</table>;
  }

  const theadProps = thead.props as { children?: React.ReactNode };
  const headerRow = React.Children.toArray(theadProps.children).find((child) =>
    isElementType(child, "tr")
  );

  if (!headerRow || !React.isValidElement(headerRow)) {
    return <table {...props}>{children}</table>;
  }

  const headerRowProps = headerRow.props as { children?: React.ReactNode };
  const thList = React.Children.toArray(headerRowProps.children);

  const handleHeaderClick = (index: number) => {
    if (sortCol === index) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(index);
      setSortDir("asc");
    }
  };

  const newHeaderRow = React.cloneElement(
    headerRow,
    {},
    thList.map((th, index) => {
      if (!React.isValidElement(th)) return th;
      const isSorted = sortCol === index;
      const icon = isSorted ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕";
      const thProps = th.props as { style?: React.CSSProperties; children?: React.ReactNode };

      return React.cloneElement(th, {
        key: index,
        onClick: () => handleHeaderClick(index),
        style: {
          ...(thProps.style || {}),
          cursor: "pointer",
          userSelect: "none",
        },
        title: "Haz clic para ordenar",
        children: (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            {thProps.children}
            <span style={{ opacity: isSorted ? 1 : 0.35, fontSize: "0.8em" }}>
              {icon}
            </span>
          </span>
        ),
      } as React.HTMLAttributes<HTMLTableCellElement>);
    })
  );

  const newThead = React.cloneElement(thead, {}, newHeaderRow);

  const tbodyProps = tbody.props as { children?: React.ReactNode };
  let bodyRows = React.Children.toArray(tbodyProps.children).filter((child) =>
    isElementType(child, "tr")
  );

  if (sortCol !== null) {
    bodyRows = [...bodyRows].sort((a, b) => {
      if (!React.isValidElement(a) || !React.isValidElement(b)) return 0;
      const aProps = a.props as { children?: React.ReactNode };
      const bProps = b.props as { children?: React.ReactNode };
      const cellsA = React.Children.toArray(aProps.children);
      const cellsB = React.Children.toArray(bProps.children);
      const valA = getTextContent(cellsA[sortCol]).trim();
      const valB = getTextContent(cellsB[sortCol]).trim();

      const comparison = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? comparison : -comparison;
    });
  }

  const newTbody = React.cloneElement(tbody, {}, bodyRows);

  return (
    <table {...props}>
      {newThead}
      {newTbody}
    </table>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: SortableTable,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
