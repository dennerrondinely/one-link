const express = require("express");
const useragent = require("express-useragent");
const app = express();

app.use(useragent.express());
const port = 3000;

// Simulação de banco de dados de links
const links = {
  "instagram-demo": {
    appUrl: "instagram://user?username=exemplo",
    webUrl: "https://instagram.com/exemplo",
    name: "Instagram Demo",
    appStore: "https://apps.apple.com/app/instagram/id389801252",
    playStore: "https://play.google.com/store/apps/details?id=com.instagram.android",
  },
  "whatsapp-demo": {
    appUrl: "whatsapp://send?phone=5511999999999",
    webUrl: "https://wa.me/5511999999999",
    name: "WhatsApp Demo",
    appStore: "https://apps.apple.com/app/whatsapp-messenger/id310633997",
    playStore: "https://play.google.com/store/apps/details?id=com.whatsapp",
  },
  geru: {
    appUrl: "geru://home",
    webUrl: "https://www.geru.com.br",
    name: "Geru",
    appStore: "https://apps.apple.com/br/app/geru-empr%C3%A9stimo-pessoal/id1444621362",
    playStore: "https://play.google.com/store/apps/details?id=br.com.geru",
  },
};

// Página inicial com informações
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>OneLink POC</title>
        <style>
          body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
          .info { background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .link { color: #0066cc; text-decoration: none; }
          code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🔗 OneLink POC</h1>
        <p>Servidor de redirecionamento inteligente Mobile/Desktop</p>
        
        <div class="info">
          <h3>Seu dispositivo:</h3>
          <p>📱 Mobile: ${req.useragent.isMobile ? "Sim" : "Não"}</p>
          <p>💻 Desktop: ${req.useragent.isDesktop ? "Sim" : "Não"}</p>
          <p>🖥️ Platform: ${req.useragent.platform}</p>
          <p>🌐 Browser: ${req.useragent.browser}</p>
        </div>

        <h3>Links de teste:</h3>
        <ul>
          <li><a href="/instagram-demo" class="link">/instagram-demo</a> - Abre Instagram app ou web</li>
          <li><a href="/whatsapp-demo" class="link">/whatsapp-demo</a> - Abre WhatsApp app ou web</li>
        </ul>

        <h3>Como usar:</h3>
        <p>Acesse <code>/&lt;link-id&gt;</code> para testar o redirecionamento</p>
      </body>
    </html>
  `);
});

app.get("/:id", (req, res) => {
  const linkId = req.params.id;
  const link = links[linkId];

  if (!link) {
    return res.status(404).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>❌ Link não encontrado</h1>
          <p>O link <code>${linkId}</code> não existe.</p>
          <a href="/">← Voltar</a>
        </body>
      </html>
    `);
  }

  console.log(
    `[${new Date().toISOString()}] ${linkId} - ${
      req.useragent.isMobile ? "Mobile" : "Desktop"
    } - ${req.useragent.platform}`
  );

  if (req.useragent.isMobile) {
    res.send(`
      <html>
        <head>
          <title>Abrindo ${link.name}...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: Arial;
              text-align: center;
              padding: 50px 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .spinner {
              border: 4px solid rgba(255,255,255,0.3);
              border-top: 4px solid white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <h1>Abrindo ${link.name}...</h1>
          <div class="spinner"></div>
          <p id="message">Tentando abrir o aplicativo...</p>
          
          <script>
            const appUrl = '${link.appUrl}';
            const webUrl = '${link.webUrl}';
            const timeout = 2000;
            const start = Date.now();
            
            // Tenta abrir o app
            window.location = appUrl;
            
            // Fallback para web se app não abrir
            const fallbackTimer = setTimeout(function() {
              if (Date.now() - start < timeout + 100) {
                document.getElementById('message').textContent = 'Redirecionando para a loja...';
                window.location = ${req.useragent.isiOS ? `'${link.appStore}'` : `'${link.playStore}'`};
              }
            }, timeout);
            
            // Detecta se saiu da página
            document.addEventListener('visibilitychange', function() {
              if (document.hidden) {
                clearTimeout(fallbackTimer);
              }
            });
            
            window.addEventListener('blur', function() {
              clearTimeout(fallbackTimer);
            });
          </script>
        </body>
      </html>
    `);
  } else {
    // Desktop vai direto para a web
    res.redirect(link.webUrl);
  }
});

app.listen(port, () => {
  console.log(`🚀 OneLink POC rodando em http://localhost:${port}`);
  console.log(`📱 Teste no mobile para ver o redirecionamento de apps`);
});
