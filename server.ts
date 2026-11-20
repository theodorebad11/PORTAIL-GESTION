import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateBoaFallback(message: string, siteContext: any = {}): string {
  const q = (message || '').toLowerCase().trim();
  const siteName = siteContext.siteName || 'Portail de Promotion';
  const activeSem = siteContext.activeSemester || 3;
  const balance = siteContext.treasuryBalance ? `${Number(siteContext.treasuryBalance).toLocaleString()} FCFA` : '103 000 FCFA';

  if (
    q.includes('qui es-tu') ||
    q.includes("t'es qui") ||
    q.includes('tu es qui') ||
    q.includes('présentation') ||
    q.includes('bonjour') ||
    q.includes('salut') ||
    q.includes('bonsoir') ||
    q === 'boa'
  ) {
    return `Bonjour ! 👋 Je suis **Boa**, votre assistant virtuel officiel pour le **${siteName}** à **FORMATEC** (Agoè-Cacavéli).\n\nJe suis là pour vous guider et répondre à toutes vos questions sur :\n- 📅 **L'emploi du temps** et les salles de cours à FORMATEC\n- 📚 **Les cours et annales** d'examens téléchargeables\n- 🖨️ **Les commandes de polycopiés** et fascicules\n- 💰 **La caisse et trésorerie** de la promotion\n- 🏛️ **La permanence** et les contacts des délégués\n\nQue souhaitez-vous savoir ?`;
  }

  if (
    q.includes('emploi') ||
    q.includes('planning') ||
    q.includes('horaire') ||
    q.includes('heure') ||
    q.includes('salle') ||
    q.includes('amphi') ||
    q.includes("cours aujourd'hui")
  ) {
    return `📅 **Emploi du Temps & Salles de cours à FORMATEC :**\n\nL'emploi du temps complet du **Semestre ${activeSem}** est consultable directement dans la rubrique **« Emploi du Temps »** du portail.\n\n- **Lieu des cours :** FORMATEC (Campus Agoè-Cacavéli).\n- **Planning hebdomadaire :** Vous y trouverez les créneaux horaires, les matières, les professeurs et les attributions de salles ou d'amphis.\n- **Export PDF :** Vous pouvez également télécharger le planning officiel en format PDF depuis cette page.`;
  }

  if (
    q.includes('cours') ||
    q.includes('annale') ||
    q.includes('fascicule') ||
    q.includes('poly') ||
    q.includes('document') ||
    q.includes('pdf') ||
    q.includes('télécharger') ||
    q.includes('matière')
  ) {
    return `📚 **Bibliothèque de Cours & Annales d'Examens :**\n\nToutes les ressources pédagogiques sont regroupées dans l'onglet **« Cours & Annales »** du portail.\n\n- Vous y trouverez les supports de cours au format PDF, les fascicules de travaux dirigés (TD) et les annales d'examens des semestres précédents.\n- Le téléchargement est direct et gratuit pour tous les étudiants inscrits.\n- Les délégués et administrateurs enrichissent régulièrement cette bibliothèque depuis l'Espace Admin.`;
  }

  if (
    q.includes('photocopie') ||
    q.includes('commander') ||
    q.includes('commande') ||
    q.includes('imprimer') ||
    q.includes('reçu') ||
    q.includes('payer')
  ) {
    return `🖨️ **Commandes de Polycopiés & Photocopies :**\n\nPour réserver ou commander un fascicule imprimé par la promotion :\n1. Rendez-vous sur la page **« Accueil »** ou **« Photocopies »**.\n2. Sélectionnez le document ou la campagne active et réservez votre exemplaire.\n3. Dès que votre paiement est validé par la trésorerie, un **reçu officiel avec code de vérification** est généré.\n4. Le retrait s'effectue auprès de la délégation lors des permanences à **FORMATEC (Agoè-Cacavéli)**.`;
  }

  if (
    q.includes('permanence') ||
    q.includes('lieu') ||
    q.includes('où') ||
    q.includes('ou se trouve') ||
    q.includes('adresse') ||
    q.includes('contact') ||
    q.includes('mail') ||
    q.includes('email') ||
    q.includes('tace')
  ) {
    return `📍 **Permanence & Contact de la Promotion :**\n\n- **Établissement :** FORMATEC\n- **Lieu :** Campus Agoè-Cacavéli\n- **Courriel officiel :** \`tace616@gmail.com\`\n- **Permanence étudiante :** FORMATEC (de 12h à 14h lors des jours de cours)\n\nN'hésitez pas à vous adresser directement aux délégués ou à envoyer un message via la rubrique **« Aide & Recours »**.`;
  }

  if (
    q.includes('caisse') ||
    q.includes('trésorerie') ||
    q.includes('solde') ||
    q.includes('argent') ||
    q.includes('cotisation') ||
    q.includes('finance') ||
    q.includes('fonds')
  ) {
    return `💰 **Caisse & Trésorerie de Promotion :**\n\n- **Solde actuel en caisse :** **${balance}**\n- La caisse de la promotion permet de financer les impressions groupées de polycopiés, les fournitures d'examens et les projets de classe.\n- Toutes les opérations d'entrées et de sorties sont tracées en toute transparence dans l'onglet **« Trésorerie »** de l'Espace Admin.`;
  }

  if (
    q.includes('admin') ||
    q.includes('délégué') ||
    q.includes('bureau') ||
    q.includes('promu') ||
    q.includes('responsable') ||
    q.includes('gestion')
  ) {
    return `🛡️ **Espace Administration & Délégués :**\n\n- L'accès à l'**Espace Admin** est réservé aux délégués généraux, délégués adjoints, trésoriers et secrétaires de la promotion.\n- Les membres promus et admis arborent un **badge de vérification officiel étoilé bleu** devant leur nom partout sur le site.\n- L'espace admin permet de gérer la fiche de classe officielle (avec recherche en temps réel par nom/email), la trésorerie, les semestres 1 à 6, l'emploi du temps et les publications officielles.`;
  }

  if (q.includes('badge') || q.includes('étoile') || q.includes('vérifié') || q.includes('bleu')) {
    return `⭐ **Badge Vérifié Officiel :**\n\nLe badge étoilé bleu avec coche blanche indique un **membre vérifié, promu ou administrateur** de la promotion (Délégué Général, Délégué Adjoint, Trésorier, Secrétaire).\nIl apparaît automatiquement devant leur nom dans la fiche de classe, sur leur profil, dans la barre de navigation et sur les discussions.`;
  }

  if (
    q.includes('discussion') ||
    q.includes('forum') ||
    q.includes('salon') ||
    q.includes('message') ||
    q.includes('parler')
  ) {
    return `💬 **Salon d'échange & Discussions :**\n\nLa rubrique **« Discussion »** permet à tous les étudiants de poser des questions, d'échanger des astuces, de partager des informations urgentes et de dialoguer directement avec la délégation.\nVous pouvez y créer un sujet ou répondre aux messages existants.`;
  }

  if (
    q.includes('inscription') ||
    q.includes('profil') ||
    q.includes('matricule') ||
    q.includes('compte') ||
    q.includes('série')
  ) {
    return `👤 **Profil & Inscription Étudiante :**\n\n- Vous pouvez vous inscrire ou vous connecter via le bouton en haut à droite pour obtenir votre **carte d'étudiant numérique**.\n- Votre profil indique votre nom, matricule académique, série d'origine, semestre actuel et statut dans la classe.\n- Vous pouvez y ajouter votre photo de profil personnalisée à tout moment.`;
  }

  return `Bonjour ! Je suis **Boa**, votre assistant pour le **${siteName}** à **FORMATEC** (Agoè-Cacavéli).\n\nPour votre demande sur « *${message}* », voici comment vous orienter sur le portail :\n- 📅 **Emploi du temps** : Consultez les cours et salles à FORMATEC dans l'onglet *Emploi du Temps*.\n- 📚 **Documents & Annales** : Téléchargez les fascicules dans *Cours & Annales*.\n- 🖨️ **Commandes & Photocopies** : Réservez vos polycopiés et obtenez votre reçu numérique.\n- 📍 **Permanence & Contact** : FORMATEC (Agoè-Cacavéli) ou \`tace616@gmail.com\`.\n\nPosez-moi une question plus précise si vous souhaitez un renseignement particulier !`;
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '20mb' }));

  app.use('/api', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  const rawApiKey = process.env.GEMINI_API_KEY?.trim();
  const hasBootKey = Boolean(rawApiKey && rawApiKey !== 'undefined' && rawApiKey !== 'null' && rawApiKey.length > 5);
  const ai = hasBootKey
    ? new GoogleGenAI({
        apiKey: rawApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  const sseClients = new Set<express.Response>();

  app.get('/api/realtime/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Système de notifications en temps réel connecté.' })}\n\n`);

    sseClients.add(res);

    const heartbeat = setInterval(() => {
      try {
        res.write(': keep-alive\n\n');
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  app.post('/api/realtime/broadcast', (req, res) => {
    const payload = req.body;
    const messageData = `data: ${JSON.stringify(payload)}\n\n`;

    sseClients.forEach((client) => {
      try {
        client.write(messageData);
      } catch {
        sseClients.delete(client);
      }
    });

    res.json({ success: true, clientCount: sseClients.size });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', sseClients: sseClients.size });
  });

  // End-point Chatbot Boa
  app.post('/api/chatbot/boa', async (req, res) => {
    try {
      const { message, history = [], siteContext = {} } = req.body;
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Le message est requis.' });
      }

      const systemInstruction = `Tu es "Boa", le chatbot et assistant virtuel officiel du portail étudiant FORMATEC (Agoè-Cacavéli, Lomé).
Ton objectif est de répondre avec clarté, précision, bienveillance et concision à TOUTES les questions des étudiants et visiteurs concernant le site et la vie académique.

Contexte officiel du site :
- Établissement : FORMATEC
- Lieu de permanence : FORMATEC (Agoè-Cacavéli)
- Contact officiel / administration : tace616@gmail.com
- Titre du portail : ${siteContext.siteName || 'Portail de Gestion'}
- Semestre actif : Semestre ${siteContext.activeSemester || 3} (${siteContext.customLevelTerm || 'Licence 2'})
- Nombre d'étudiants inscrits : ${siteContext.registeredCount || 0}
- Nombre de documents/cours disponibles : ${siteContext.resourcesCount || 0}
- Nombre de créneaux d'emploi du temps : ${siteContext.scheduleCount || 0}
- Solde actuel de la caisse : ${siteContext.treasuryBalance ? Number(siteContext.treasuryBalance).toLocaleString() + ' FCFA' : '103 000 FCFA'}

Fonctionnalités et rubriques du site :
1. "Accueil" : Vue globale, échéances, événements, calendrier interactif avec codes couleurs personnalisés.
2. "Emploi du Temps" : Tous les cours hebdomadaires, horaires, salles et amphis à FORMATEC avec export PDF.
3. "Cours & Annales" : Bibliothèque numérique de supports de cours, polycopiés, fascicules et annales d'examens téléchargeables.
4. "Photocopies & Caisse" : Réservation et commande de polycopiés imprimés par la promotion, fiches d'émargement et reçu numérique avec code de vérification.
5. "Salon d'échange" : Espace d'échange et d'entraide entre camarades avec publications et commentaires.
6. "Aide & Recours" : Signalement de soucis, réclamations ou questions directes aux délégués.
7. "Mon Profil" : Fiche étudiante personnalisée, matricule, série d'origine et statut vérifié avec badge officiel étoilé bleu pour les délégués/promus.
8. "Espace Admin" (sécurisé) : Gestion complète de la promotion par les délégués (fiche de classe avec recherche en temps réel par nom/email, trésorerie, emploi du temps, promotion d'étudiants, personnalisation des couleurs et libellés).

Directives de réponse :
- Exprime-toi toujours en français impeccable, de manière polie, accueillante et concise.
- Utilise le formatage Markdown (gras, listes à puces) pour que ce soit agréable et facile à lire.
- Réponds directement à la question en orientant l'utilisateur vers la bonne rubrique ou en lui donnant l'information exacte.
- Si la question concerne l'administration ou la trésorerie, rappelle que les délégués sont joignables à FORMATEC (Agoè-Cacavéli) ou par email à tace616@gmail.com.
- Signe ou termine par une note chaleureuse comme : « N'hésite pas si tu as d'autres questions ! — Boa »`;

      const apiKey = process.env.GEMINI_API_KEY?.trim();
      const hasValidKey = Boolean(ai && apiKey && apiKey !== 'undefined' && apiKey !== 'null' && apiKey.length > 5);

      if (hasValidKey && ai) {
        try {
          const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

          if (Array.isArray(history) && history.length > 0) {
            for (const h of history.slice(-6)) {
              if (h && (h.role === 'user' || h.role === 'model') && typeof h.content === 'string') {
                contents.push({
                  role: h.role,
                  parts: [{ text: h.content }],
                });
              }
            }
          }

          contents.push({
            role: 'user',
            parts: [{ text: message.trim() }],
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout Gemini API')), 6000)
          );

          const geminiPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction,
            },
          });

          const geminiResponse = await Promise.race([geminiPromise, timeoutPromise]);

          const replyText = geminiResponse.text;
          if (replyText && replyText.trim()) {
            return res.json({ reply: replyText.trim(), source: 'gemini' });
          }
        } catch (geminiError: any) {
          console.warn('Gemini API call error, falling back to local Boa engine:', geminiError?.message || geminiError);
        }
      }

      // Smart fallback answering site questions if API key is absent or temporary failure
      const fallbackReply = generateBoaFallback(message, siteContext);
      return res.json({ reply: fallbackReply, source: 'boa-fallback' });
    } catch (err: any) {
      console.error('Erreur chatbot Boa:', err);
      res.status(500).json({ error: 'Impossible de traiter la demande.', details: err?.message });
    }
  });

  const distDir = path.resolve(__dirname, 'dist');
  const distIndex = path.resolve(distDir, 'index.html');
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.argv.includes('--prod') && fs.existsSync(distIndex));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(distIndex);
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Portail L2 server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
