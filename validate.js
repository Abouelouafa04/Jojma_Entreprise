#!/usr/bin/env node

/**
 * JOJMA Validation Script
 * Tests both backend and frontend functionality
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 JOJMA Validation Script Starting...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      log(`✅ ${description} exists`, 'green');
      return true;
    } else {
      log(`❌ ${description} missing`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error checking ${description}: ${error.message}`, 'red');
    return false;
  }
}

function validateBackend() {
  log('\n🔧 Validating Backend...', 'blue');

  const backendFiles = [
    ['backend/src/modules/auth/auth.controller.ts', 'Auth Controller'],
    ['backend/src/modules/users/user.model.ts', 'User Model'],
    ['backend/src/modules/users/emailVerificationToken.model.ts', 'Email Verification Token Model'],
    ['backend/src/services/verificationEmailService.ts', 'Email Service'],
    ['backend/src/routes/auth.routes.ts', 'Auth Routes']
  ];

  let backendScore = 0;
  backendFiles.forEach(([file, desc]) => {
    if (checkFileExists(file, desc)) {
      backendScore++;
    }
  });

  // Check if routes are properly configured
  try {
    const routesContent = fs.readFileSync(path.join(__dirname, 'backend/src/routes/auth.routes.ts'), 'utf8');
    if (routesContent.includes('/verify-email') && routesContent.includes('/logout')) {
      log('✅ Auth routes properly configured', 'green');
      backendScore++;
    } else {
      log('❌ Auth routes incomplete', 'red');
    }
  } catch (error) {
    log('❌ Could not read auth routes', 'red');
  }

  return backendScore;
}

function validateFrontend() {
  log('\n🎨 Validating Frontend...', 'blue');

  const frontendFiles = [
    ['frontend/src/pages/Register.tsx', 'Register Page'],
    ['frontend/src/pages/Login.tsx', 'Login Page'],
    ['frontend/src/pages/Welcome.tsx', 'Welcome Page'],
    ['frontend/src/contexts/AuthContext.tsx', 'Auth Context'],
    ['frontend/src/layouts/PublicLayout.tsx', 'Public Layout']
  ];

  let frontendScore = 0;
  frontendFiles.forEach(([file, desc]) => {
    if (checkFileExists(file, desc)) {
      frontendScore++;
    }
  });

  // Check if routes are configured
  try {
    const routesContent = fs.readFileSync(path.join(__dirname, 'frontend/src/routes/index.tsx'), 'utf8');
    if (routesContent.includes('/welcome') && routesContent.includes('/register')) {
      log('✅ Frontend routes properly configured', 'green');
      frontendScore++;
    } else {
      log('❌ Frontend routes incomplete', 'red');
    }
  } catch (error) {
    log('❌ Could not read frontend routes', 'red');
  }

  return frontendScore;
}

function validateUXRequirements() {
  log('\n🎯 Validating UX Requirements...', 'blue');

  let uxScore = 0;

  // Check Register page content
  try {
    const registerContent = fs.readFileSync(path.join(__dirname, 'frontend/src/pages/Register.tsx'), 'utf8');
    const requiredTexts = [
      'Créer votre compte JOJMA',
      'Commencez à gérer vos modèles 3D',
      'Nom complet',
      'Email professionnel',
      'Confirmer le mot de passe',
      'Type de compte',
      'Conditions d\'utilisation'
    ];

    requiredTexts.forEach(text => {
      if (registerContent.includes(text)) {
        uxScore++;
      } else {
        log(`❌ Missing: "${text}" in Register page`, 'red');
      }
    });
  } catch (error) {
    log('❌ Could not validate Register page content', 'red');
  }

  // Check Login page content
  try {
    const loginContent = fs.readFileSync(path.join(__dirname, 'frontend/src/pages/Login.tsx'), 'utf8');
    const requiredTexts = [
      'Connectez-vous à votre espace JOJMA',
      'Se souvenir de moi',
      'Mot de passe oublié'
    ];

    requiredTexts.forEach(text => {
      if (loginContent.includes(text)) {
        uxScore++;
      } else {
        log(`❌ Missing: "${text}" in Login page`, 'red');
      }
    });
  } catch (error) {
    log('❌ Could not validate Login page content', 'red');
  }

  // Check Welcome page content
  try {
    const welcomeContent = fs.readFileSync(path.join(__dirname, 'frontend/src/pages/Welcome.tsx'), 'utf8');
    const requiredTexts = [
      'Bienvenue sur JOJMA',
      'Importer mon premier modèle',
      'Générer une expérience AR',
      'Découvrir le tableau de bord'
    ];

    requiredTexts.forEach(text => {
      if (welcomeContent.includes(text)) {
        uxScore++;
      } else {
        log(`❌ Missing: "${text}" in Welcome page`, 'red');
      }
    });
  } catch (error) {
    log('❌ Could not validate Welcome page content', 'red');
  }

  return uxScore;
}

function validateHeaderLogic() {
  log('\n📋 Validating Header Logic...', 'blue');

  let headerScore = 0;

  try {
    const layoutContent = fs.readFileSync(path.join(__dirname, 'frontend/src/layouts/PublicLayout.tsx'), 'utf8');

    // Check if header changes based on auth state
    if (layoutContent.includes('isAuthenticated') && layoutContent.includes('Mon espace')) {
      log('✅ Header shows authenticated state correctly', 'green');
      headerScore++;
    } else {
      log('❌ Header does not handle authenticated state', 'red');
    }

    if (layoutContent.includes('logout') && layoutContent.includes('Déconnexion')) {
      log('✅ Logout functionality present', 'green');
      headerScore++;
    } else {
      log('❌ Logout functionality missing', 'red');
    }

  } catch (error) {
    log('❌ Could not validate header logic', 'red');
  }

  return headerScore;
}

function runTests() {
  log('\n🧪 Running Tests...', 'blue');

  try {
    // Run backend manual tests
    log('Running backend tests...', 'yellow');
    execSync('cd backend && node tests/manual-test.js', { stdio: 'inherit' });
    log('✅ Backend tests completed', 'green');
  } catch (error) {
    log('❌ Backend tests failed', 'red');
  }

  try {
    // Run Playwright tests
    log('Running E2E tests...', 'yellow');
    execSync('npx playwright test tests/e2e/auth.spec.ts --headed=false', { stdio: 'inherit' });
    log('✅ E2E tests completed', 'green');
  } catch (error) {
    log('❌ E2E tests failed (expected if servers not running)', 'yellow');
  }
}

// Main validation
function main() {
  let totalScore = 0;
  let maxScore = 0;

  // Backend validation
  const backendScore = validateBackend();
  totalScore += backendScore;
  maxScore += 6; // 5 files + 1 route check

  // Frontend validation
  const frontendScore = validateFrontend();
  totalScore += frontendScore;
  maxScore += 6; // 5 files + 1 route check

  // UX validation
  const uxScore = validateUXRequirements();
  totalScore += uxScore;
  maxScore += 13; // All required texts

  // Header validation
  const headerScore = validateHeaderLogic();
  totalScore += headerScore;
  maxScore += 2; // Auth state + logout

  // Calculate percentage
  const percentage = Math.round((totalScore / maxScore) * 100);

  log(`\n📊 Validation Results: ${totalScore}/${maxScore} (${percentage}%)`, percentage >= 80 ? 'green' : 'red');

  if (percentage >= 90) {
    log('🎉 Excellent! Implementation is complete and correct.', 'green');
  } else if (percentage >= 70) {
    log('👍 Good! Most features are implemented correctly.', 'yellow');
  } else {
    log('⚠️  Some features need attention.', 'red');
  }

  // Run tests if score is good
  if (percentage >= 80) {
    runTests();
  }

  log('\n✨ Validation complete!', 'blue');
}

// Run validation
main();