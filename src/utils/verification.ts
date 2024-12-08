import { Certificate } from '../types';

export function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function verifyCertificate(certificate: Certificate, verificationCode: string): boolean {
  return certificate.signatures.verificationCode === verificationCode;
}

export function signCertificate(
  certificate: Certificate,
  type: 'sender' | 'recipient',
  signature: string
): Certificate {
  const now = new Date().toISOString();
  
  return {
    ...certificate,
    signatures: {
      ...certificate.signatures,
      [type]: signature,
      timestamp: now,
      verificationCode: certificate.signatures.verificationCode || generateVerificationCode(),
    },
  };
}