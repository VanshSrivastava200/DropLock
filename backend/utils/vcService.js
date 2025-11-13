const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class VCService {
  constructor() {
    this.initializeSigningKey();
  }

  // Initialize signing key (simplified approach)
  initializeSigningKey() {
    // Use environment variable or generate a deterministic key
    this.signingKey = process.env.VC_SIGNING_SECRET || 'digilocker-vc-signing-secret-2024';
    console.log('✅ VC Service initialized with signing key');
  }

  // Generate VC for verified document (simplified signing)
  async generateDocumentVC(document, authority, user) {
    try {
      const vcId = `vc:digilocker:${uuidv4()}`;
      const issuanceDate = new Date().toISOString();
      
      // Create credential subject
      const credentialSubject = {
        id: user.did || `did:web:digilocker:user:${user._id}`,
        documentId: document._id.toString(),
        documentHash: document.documentHash,
        documentType: document.documentType,
        fileName: document.fileName,
        fileSize: document.fileSize,
        verifiedBy: authority.fullName,
        authorityDepartment: authority.department,
        authorityId: authority.employerId,
        verificationDate: new Date().toISOString(),
        status: 'verified'
      };

      // Create the VC object
      const vc = {
        '@context': [
          'https://www.w3.org/2018/credentials/v1'
        ],
        type: ['VerifiableCredential', 'DocumentVerificationCredential'],
        id: vcId,
        issuer: authority.did || `did:web:digilocker:authority:${authority.employerId}`,
        issuanceDate: issuanceDate,
        credentialSubject: credentialSubject,
        credentialSchema: {
          id: 'https://digilocker.example/schemas/document-verification-v1.json',
          type: 'JsonSchemaValidator2018'
        }
      };

      // Generate simplified cryptographic signature
      const signatureData = await this.generateSignature(vc, authority);
      
      // Add proof section
      vc.proof = {
        type: 'RsaSignature2018',
        created: issuanceDate,
        verificationMethod: `${vc.issuer}#keys-1`,
        proofPurpose: 'assertionMethod',
        jws: signatureData.jws,
        signatureValue: signatureData.signature
      };

      console.log('✅ VC generated successfully:', vcId);
      return vc;
    } catch (error) {
      console.error('❌ VC generation failed:', error);
      throw error;
    }
  }

  // Generate simplified signature
  async generateSignature(vc, authority) {
    try {
      // Create signing payload
      const payload = {
        vcId: vc.id,
        documentHash: vc.credentialSubject.documentHash,
        issuer: vc.issuer,
        subject: vc.credentialSubject.id,
        issuanceDate: vc.issuanceDate,
        authorityId: authority._id.toString()
      };

      const payloadString = JSON.stringify(payload);
      
      // Create HMAC signature (simplified for now)
      const signature = crypto
        .createHmac('sha256', this.signingKey)
        .update(payloadString)
        .digest('hex');

      // Create JWS-like structure
      const header = Buffer.from(JSON.stringify({
        alg: 'HS256',
        typ: 'JWT'
      })).toString('base64');

      const payloadBase64 = Buffer.from(payloadString).toString('base64');
      const signatureBase64 = Buffer.from(signature).toString('base64');

      const jws = `${header}.${payloadBase64}.${signatureBase64}`;

      return {
        signature: signature,
        jws: jws,
        payload: payloadString
      };
    } catch (error) {
      console.error('❌ Signature generation failed:', error);
      throw new Error('Failed to generate signature: ' + error.message);
    }
  }

  // Verify VC signature
  async verifyVCSignature(vc) {
    try {
      if (!vc.proof || !vc.proof.jws) {
        return false;
      }

      const jwsParts = vc.proof.jws.split('.');
      if (jwsParts.length !== 3) {
        return false;
      }

      const payload = JSON.parse(Buffer.from(jwsParts[1], 'base64').toString());
      
      // Recreate expected signature
      const expectedSignature = crypto
        .createHmac('sha256', this.signingKey)
        .update(JSON.stringify(payload))
        .digest('hex');

      const receivedSignature = Buffer.from(jwsParts[2], 'base64').toString();

      return expectedSignature === receivedSignature;
    } catch (error) {
      console.error('❌ VC verification failed:', error);
      return false;
    }
  }

  // Alternative: Even simpler signature method
  generateSimpleSignature(vc, authority) {
    const dataToSign = `${vc.credentialSubject.documentHash}:${authority._id}:${vc.issuanceDate}`;
    
    const signature = crypto
      .createHmac('sha256', this.signingKey)
      .update(dataToSign)
      .digest('hex');

    return {
      type: 'SimpleSignature2024',
      created: new Date().toISOString(),
      verificationMethod: `${vc.issuer}#simple-key`,
      proofPurpose: 'assertionMethod',
      signature: signature,
      signedData: dataToSign
    };
  }

  // Generate QR code data for VC
  generateQRCodeData(vc) {
    const qrData = {
      vcId: vc.id,
      documentHash: vc.credentialSubject.documentHash,
      verificationUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${vc.id}`,
      issuer: vc.issuer,
      issuanceDate: vc.issuanceDate,
      documentType: vc.credentialSubject.documentType
    };

    return qrData;
  }
}

// Create and export singleton instance
const vcService = new VCService();
module.exports = vcService;