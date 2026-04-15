const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const payload = {
      type_demande: 'contact',
      source_formulaire: 'test_script',
      nom: 'TestScript',
      prenom: 'Local',
      email: `test.demande.${Date.now()}@example.com`,
      telephone: '0600000000',
      sujet: 'Sujet test via script',
      message: 'Message de test envoyé par script'
    };

    console.log('Soumission d\'une demande test:', payload.email);

    const submitRes = await fetch('http://localhost:5000/api/demandes/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const submitText = await submitRes.text();
    let submitJson = null;
    try { submitJson = JSON.parse(submitText); } catch (e) { submitJson = submitText; }

    console.log('Statut soumission:', submitRes.status);
    console.log('Réponse soumission:', submitJson);

    const tokenPath = path.join(__dirname, '..', 'tmp_admin_token.txt');
    if (!fs.existsSync(tokenPath)) {
      console.error('Fichier token admin introuvable:', tokenPath);
      process.exit(1);
    }

    const token = fs.readFileSync(tokenPath, 'utf-8').trim();

    console.log('Interrogation de /api/admin/demandes (authentifié)');
    const listRes = await fetch('http://localhost:5000/api/admin/demandes?perPage=10', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const listJson = await listRes.json();
    console.log('/api/admin/demandes statut:', listRes.status);
    console.log('Total trouvé (meta.total):', listJson?.meta?.total);

    const found = (listJson.data || []).find(d => d.email === payload.email || (submitJson && submitJson.id && String(d.id) === String(submitJson.id)));
    console.log('Demande créée trouvée dans la liste admin:', !!found);
    if (found) console.log('Item trouvé:', found);

    console.log('Interrogation de /api/admin/demandes/stats (authentifié)');
    const statsRes = await fetch('http://localhost:5000/api/admin/demandes/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const statsJson = await statsRes.json();
    console.log('/api/admin/demandes/stats statut:', statsRes.status);
    console.log('Stats:', statsJson);

    process.exit(0);
  } catch (err) {
    console.error('Erreur dans le script:', err);
    process.exit(2);
  }
})();
