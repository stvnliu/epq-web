export const ENCRYPTION_TYPE = "SHA-256";

// Implemented according to https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
export const digestMessage = async (plaintext: string) => {
	const textEncoder = new TextEncoder();
	const digestArray = Array.from(
		new Uint8Array(
			await window.crypto.subtle.digest(
				ENCRYPTION_TYPE, 
				textEncoder.encode(plaintext)
			)
		)
	)
	return digestArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
export const encryptMessage = async (plaintext: string) => {
	// TODO Method stub
	return plaintext;
}
