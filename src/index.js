const express = require("express");
const useragent = require("express-useragent");
const app = express();

app.use(useragent.express());
const port = 3000;

// Simulação de banco de dados de links
const links = {
  'instagram-demo': {
    type: 'simple',
    appUrl: 'instagram://user?username=exemplo',
    webUrl: 'https://instagram.com/exemplo',
    name: 'Instagram Demo'
  },
  'whatsapp-demo': {
    type: 'simple',
    appUrl: 'whatsapp://send?phone=5511999999999',
    webUrl: 'https://wa.me/5511999999999',
    name: 'WhatsApp Demo'
  },
  'geru': {
    type: 'simple',
    appUrl: 'geru://user?id=123',
    webUrl: 'https://geru.com.br',
    name: 'Geru App'
  },
};
geru://user?id=123
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
          <p>📱 Mobile: ${req.useragent.isMobile ? 'Sim' : 'Não'}</p>
          <p>💻 Desktop: ${req.useragent.isDesktop ? 'Sim' : 'Não'}</p>
          <p>🖥️ Platform: ${req.useragent.platform}</p>
          <p>🌐 Browser: ${req.useragent.browser}</p>
        </div>

        <h3>Links de teste:</h3>
        <ul>
          <li><a href="/instagram-demo" class="link">/instagram-demo</a> - Abre Instagram app ou web</li>
          <li><a href="/whatsapp-demo" class="link">/whatsapp-demo</a> - Abre WhatsApp app ou web</li>
          <li><a href="/geru" class="link">/geru</a> - Abre Geru App</li>
        </ul>

        <h3>Criar link dinâmico:</h3>
        <p>Use query params para criar links sem configuração prévia:</p>
        <code>/link?android=com.app&ios=123456&web=https://site.com&name=MeuApp</code>
        
        <h3>Parâmetros suportados:</h3>
        <ul style="text-align: left;">
          <li><code>android</code> - Package name do Android (ex: com.instagram.android)</li>
          <li><code>ios</code> - App Store ID do iOS (ex: 389801252)</li>
          <li><code>iosScheme</code> - Custom URL scheme iOS (ex: instagram)</li>
          <li><code>web</code> - URL de fallback web</li>
          <li><code>name</code> - Nome do app (opcional)</li>
          <li><code>appUrl</code> - Custom deep link direto (ex: instagram://user?username=x)</li>
        </ul>

        <h3>Como usar:</h3>
        <p>Acesse <code>/&lt;link-id&gt;</code> para testar o redirecionamento</p>
      </body>
    </html>
  `);
});

// Rota dinâmica com query params
app.get("/link", (req, res) => {
  const { android, ios, iosScheme, web, name, appUrl } = req.query;

  if (!web) {
    return res.status(400).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>❌ Parâmetro obrigatório</h1>
          <p>O parâmetro <code>web</code> é obrigatório.</p>
          <p>Exemplo: <code>/link?web=https://site.com&android=com.app&ios=123456</code></p>
          <a href="/">← Voltar</a>
        </body>
      </html>
    `);
  }

  const linkConfig = {
    type: 'app',
    androidPackage: android,
    iosAppId: ios,
    iosScheme: iosScheme || (android ? android.split('.').pop() : null),
    webUrl: web,
    name: name || 'App',
    appUrl: appUrl
  };

  handleRedirect(req, res, linkConfig);
});

// Rota de redirecionamento para links configurados
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

  console.log(`[${new Date().toISOString()}] ${linkId} - ${req.useragent.isMobile ? 'Mobile' : 'Desktop'} - ${req.useragent.platform}`);

  handleRedirect(req, res, link);
});

// Função centralizada para lidar com redirecionamento
function handleRedirect(req, res, link) {
  if (req.useragent.isMobile) {
    const isIOS = req.useragent.isIOS || req.useragent.platform === 'iOS';
    const isAndroid = req.useragent.isAndroid || req.useragent.platform === 'Android';

    // Para links tipo 'app' (com package/appId)
    if (link.type === 'app' && (link.androidPackage || link.iosAppId)) {
      const androidScheme = link.androidPackage 
        ? `intent://${new URL(link.webUrl).hostname}#Intent;scheme=https;package=${link.androidPackage};end`
        : null;
      const iosSchemeUrl = link.iosScheme ? `${link.iosScheme}://` : null;
      const androidAppUrl = link.androidPackage 
        ? `https://play.google.com/store/apps/details?id=${link.androidPackage}` 
        : null;
      const iosAppUrl = link.iosAppId 
        ? `https://apps.apple.com/app/id${link.iosAppId}` 
        : null;

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
              .btn {
                display: inline-block;
                margin: 20px 10px;
                padding: 12px 24px;
                background: white;
                color: #667eea;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <h1>Abrindo ${link.name}...</h1>
            <div class="spinner"></div>
            <p id="message">Tentando abrir o aplicativo...</p>
            
            <div id="fallback" style="display: none;">
              <p>Aplicativo não instalado?</p>
              ${isAndroid && androidAppUrl ? `<a href="${androidAppUrl}" class="btn">📱 Baixar na Play Store</a>` : ''}
              ${isIOS && iosAppUrl ? `<a href="${iosAppUrl}" class="btn">📱 Baixar na App Store</a>` : ''}
              <a href="${link.webUrl}" class="btn">🌐 Abrir no navegador</a>
            </div>
            
            <script>
              const isIOS = ${isIOS};
              const isAndroid = ${isAndroid};
              const timeout = 2500;
              const start = Date.now();
              
              if (isIOS && '${iosSchemeUrl}') {
                window.location = '${iosSchemeUrl}';
                setTimeout(function() {
                  if (Date.now() - start < timeout + 200) {
                    ${iosAppUrl 
                      ? `document.getElementById('message').textContent = 'Redirecionando para App Store...';
                         window.location = '${iosAppUrl}';`
                      : `window.location = '${link.webUrl}';`
                    }
                  }
                }, timeout);
              } else if (isAndroid && '${androidScheme}') {
                window.location = '${androidScheme}';
                setTimeout(function() {
                  if (Date.now() - start < timeout + 200) {
                    ${androidAppUrl 
                      ? `document.getElementById('message').textContent = 'Redirecionando para Play Store...';
                         window.location = '${androidAppUrl}';`
                      : `window.location = '${link.webUrl}';`
                    }
                  }
                }, timeout);
              } else {
                document.getElementById('fallback').style.display = 'block';
                document.getElementById('message').textContent = 'Escolha uma opção:';
                document.querySelector('.spinner').style.display = 'none';
              }
              
              document.addEventListener('visibilitychange', function() {
                if (document.hidden) clearTimeout();
              });
              
              window.addEventListener('blur', function() {
                clearTimeout();
              });
            </script>
          </body>
        </html>
      `);
    } else {
      // Para links simples com appUrl direto
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
            
            window.location = appUrl;
            
            const fallbackTimer = setTimeout(function() {
              if (Date.now() - start < timeout + 100) {
                document.getElementById('message').textContent = 'Redirecionando para versão web...';
                window.location = webUrl;
              }
            }, timeout);
            
            document.addEventListener('visibilitychange', function() {
              if (document.hidden) clearTimeout(fallbackTimer);
            });
            
            window.addEventListener('blur', function() {
              clearTimeout(fallbackTimer);
            });
          </script>
        </body>
      </html>
    `);
    }
  } else {
    res.redirect(link.webUrl);
  }
}

app.listen(port, () => {
  console.log(`🚀 OneLink POC rodando em http://localhost:${port}`);
  console.log(`📱 Teste no mobile para ver o redirecionamento de apps`);
});
