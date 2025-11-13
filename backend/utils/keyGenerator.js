const { JWK } = require('node-jose');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class KeyGenerator {
  // Generate new key pair for VC signing
  static async generateVCKeyPair() {
    try {
      const keystore = JWK.createKeyStore();
      
      // Generate ECDSA P-256 key (recommended for VCs)
      const key = await keystore.generate('EC', 'P-256', {
        use: 'sig',
        alg: 'ES256',
        kid: `vc-key-${Date.now()}`
      });

      const privateKeyJwk = key.toJSON(true);
      const publicKeyJwk = key.toJSON(false);

      return {
        privateKey: privateKeyJwk,
        publicKey: publicKeyJwk,
        kid: key.kid
      };
    } catch (error) {
      console.error('❌ Key generation failed:', error);
      throw error;
    }
  }

  // Generate Ethereum-style key pair
  static generateEthereumKeyPair() {
    const { ethers } = require('ethers');
    const wallet = ethers.Wallet.createRandom();
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    };
  }

  // Save keys to file (for backup)
  static saveKeysToFile(keys, filename = 'vc-keys.json') {
    const filePath = path.join(__dirname, '..', 'config', filename);
    const keyData = {
      generatedAt: new Date().toISOString(),
      ...keys
    };

    // Ensure config directory exists
    const configDir = path.dirname(filePath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(keyData, null, 2));
    console.log(`✅ Keys saved to: ${filePath}`);
    
    return filePath;
  }

  // Load keys from file
  static loadKeysFromFile(filename = 'vc-keys.json') {
    const filePath = path.join(__dirname, '..', 'config', filename);
    
    if (fs.existsSync(filePath)) {
      const keyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ Keys loaded from: ${filePath}`);
      return keyData;
    }
    
    return null;
  }

  // Generate and display keys (run this once)
  static async initializeVCKeys() {
    console.log('🔑 Generating VC signing keys...');
    
    const vcKeys = await this.generateVCKeyPair();
    const ethKeys = this.generateEthereumKeyPair();

    const allKeys = {
      vc: vcKeys,
      ethereum: ethKeys,
      environmentVariables: {
        VC_SIGNING_PRIVATE_KEY: JSON.stringify(vcKeys.privateKey),
        VC_SIGNING_PUBLIC_KEY: JSON.stringify(vcKeys.publicKey),
        ETH_SIGNING_PRIVATE_KEY: ethKeys.privateKey
      }
    };

    // Save to file
    this.saveKeysToFile(allKeys);

    console.log('\n📋 ADD THESE TO YOUR .env FILE:');
    console.log('================================');
    console.log(`VC_SIGNING_PRIVATE_KEY=${JSON.stringify(vcKeys.privateKey)}`);
    console.log(`VC_SIGNING_PUBLIC_KEY=${JSON.stringify(vcKeys.publicKey)}`);
    console.log(`ETH_SIGNING_PRIVATE_KEY=${ethKeys.privateKey}`);
    console.log('================================\n');

    console.log('🔐 Ethereum Address:', ethKeys.address);
    console.log('📝 Key ID:', vcKeys.kid);

    return allKeys;
  }
}

module.exports = KeyGenerator;