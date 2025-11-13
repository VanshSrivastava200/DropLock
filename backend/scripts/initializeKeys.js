const KeyGenerator = require('../utils/keyGenerator');

async function initialize() {
  try {
    console.log('🚀 Initializing VC Signing Keys...\n');
    await KeyGenerator.initializeVCKeys();
    console.log('✅ Key initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Key initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initialize();
}

module.exports = initialize;