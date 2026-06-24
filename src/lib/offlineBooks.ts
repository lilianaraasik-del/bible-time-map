// Offline-raamatute hoidla (IndexedDB).
// Salvestab ostetud raamatu/peatüki failid (PDF/EPUB) lokaalselt,
// et neid saaks lugeda ilma internetiühenduseta.

import { useCallback, useEffect, useState } from "react";
import type { BookFormat } from "./eraamatud";

const DB_NAME = "piibel-offline-books";
const DB_VERSION = 1;
const STORE = "books";

export interface OfflineBookRecord {
  key: string; // `${bookId}:${episodeId}` või `${bookId}:_main`
  bookId: string;
  episodeId: string;
  title: string;
  episodeName?: string;
  format: BookFormat;
  blob: Blob;
  size: number;
  savedAt: number;
}

export type OfflineBookMeta = Omit<OfflineBookRecord, "blob">;

export function offlineKey(bookId: string | number, episodeId?: string | number | null): string {
  return `${String(bookId)}:${episodeId != null && episodeId !== "" ? String(episodeId) : "_main"}`;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "key" });
        store.createIndex("bookId", "bookId", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T> | Promise<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const store = transaction.objectStore(STORE);
    let result: T;
    const ret = fn(store);
    if (ret instanceof Promise) {
      ret.then((v) => (result = v)).catch(reject);
    } else {
      ret.onsuccess = () => (result = ret.result);
      ret.onerror = () => reject(ret.error);
    }
    transaction.oncomplete = () => resolve(result!);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export async function saveOfflineBook(record: Omit<OfflineBookRecord, "savedAt" | "size">): Promise<void> {
  const full: OfflineBookRecord = {
    ...record,
    size: record.blob.size,
    savedAt: Date.now(),
  };
  await tx("readwrite", (store) => store.put(full));
}

export async function getOfflineBook(key: string): Promise<OfflineBookRecord | null> {
  const res = await tx<OfflineBookRecord | undefined>("readonly", (store) => store.get(key) as IDBRequest<OfflineBookRecord | undefined>);
  return res ?? null;
}

export async function deleteOfflineBook(key: string): Promise<void> {
  await tx("readwrite", (store) => store.delete(key));
}

export async function deleteOfflineBookAll(bookId: string): Promise<void> {
  const all = await listOfflineBooks();
  await Promise.all(all.filter((r) => r.bookId === String(bookId)).map((r) => deleteOfflineBook(r.key)));
}

export async function listOfflineBooks(): Promise<OfflineBookMeta[]> {
  const db = await openDb();
  return new Promise<OfflineBookMeta[]>((resolve, reject) => {
    const transaction = db.transaction(STORE, "readonly");
    const store = transaction.objectStore(STORE);
    const req = store.openCursor();
    const out: OfflineBookMeta[] = [];
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const v = cursor.value as OfflineBookRecord;
        // jätame blob'i välja, et mitte mälu kulutada
        const { blob: _blob, ...meta } = v;
        void _blob;
        out.push(meta);
        cursor.continue();
      } else {
        resolve(out);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

/** Lae fail blob-iks koos progressiga (0..1). */
export async function fetchAsBlob(
  url: string,
  onProgress?: (loaded: number, total: number | null) => void
): Promise<Blob> {
  const { proxiedFetch } = await import("./proxiedFetch");
  const res = await proxiedFetch(url);
  if (!res.ok) throw new Error(`Allalaadimine ebaõnnestus: HTTP ${res.status}`);
  const totalHeader = res.headers.get("content-length");
  const total = totalHeader ? Number(totalHeader) : null;

  if (!res.body || !onProgress) {
    return await res.blob();
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      loaded += value.length;
      onProgress(loaded, total);
    }
  }
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  return new Blob(chunks as BlobPart[], { type: contentType });
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

/** React-hook, mis hoiab kõigi salvestatud raamatute meta-andmeid. */
export function useOfflineBooks() {
  const [items, setItems] = useState<OfflineBookMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const list = await listOfflineBooks();
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const bookIds = new Set(items.map((i) => i.bookId));
  const keys = new Set(items.map((i) => i.key));
  const totalSize = items.reduce((acc, i) => acc + i.size, 0);

  return { items, loading, refresh, bookIds, keys, totalSize };
}
