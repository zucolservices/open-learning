/** Real envelope encryption with the browser's WebCrypto API (AES-256-GCM), standing in for a cloud KMS. */

const hex = (b: ArrayBuffer) =>
  [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

export interface Envelope {
  dek: string;
  ciphertext: string;
  wrappedDek: string;
  decrypted: string;
}

async function gcm(key: CryptoKey, data: BufferSource) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const out = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { iv, out };
}

/** The "KMS": a master key that never leaves this function's closure in usable form. */
export async function envelope(message: string): Promise<Envelope> {
  const aes = { name: "AES-GCM", length: 256 } as const;
  const kek = await crypto.subtle.generateKey(aes, false, ["encrypt", "decrypt"]);
  const dekKey = await crypto.subtle.generateKey(aes, true, ["encrypt", "decrypt"]);
  const dekRaw = await crypto.subtle.exportKey("raw", dekKey);

  const data = await gcm(dekKey, new TextEncoder().encode(message));
  const wrapped = await gcm(kek, dekRaw);

  // Reading it back: unwrap the data key with the master key, then decrypt the data.
  const unwrapped = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: wrapped.iv },
    kek,
    wrapped.out,
  );
  const dek2 = await crypto.subtle.importKey("raw", unwrapped, aes, false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: data.iv }, dek2, data.out);

  return {
    dek: hex(dekRaw),
    ciphertext: hex(data.out),
    wrappedDek: hex(wrapped.out),
    decrypted: new TextDecoder().decode(plain),
  };
}
