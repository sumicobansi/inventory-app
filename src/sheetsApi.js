const API_URL = import.meta.env.VITE_SHEETS_API_URL;
const TOKEN = import.meta.env.VITE_SHEETS_API_TOKEN;

export async function loadAllData() {
  const res = await fetch(`${API_URL}?token=${TOKEN}`);
  return res.json();
}

async function post(body) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ token: TOKEN, ...body }),
  });
}

export const appendRows = (sheet, rows) => post({ action: "append", sheet, rows });
export const updateRows = (sheet, match, patch) => post({ action: "update", sheet, match, patch });
export const deleteRows = (sheet, match) => post({ action: "delete", sheet, match });