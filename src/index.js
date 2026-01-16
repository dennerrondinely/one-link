const express = require("express");
const useragent = require("express-useragent");
const { engine } = require("express-handlebars");
const path = require("path");
const app = express();

app.use(useragent.express());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

const port = 3000;

// Simulação de banco de dados de links
const links = {
  "instagram-demo": {
    appUrl: "instagram://user?username=exemplo",
    webUrl: "https://instagram.com/exemplo",
    name: "Instagram Demo",
    appStore: "https://apps.apple.com/app/instagram/id389801252",
    playStore:
      "https://play.google.com/store/apps/details?id=com.instagram.android",
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
    appStore:
      "https://apps.apple.com/br/app/geru-cr%C3%A9dito-e-pix-parcelado/id1587713422",
    playStore:
      "https://play.google.com/store/apps/details?id=com.geru.app&hl=pt_BR&gl=BR",
  },
};

// Página inicial com informações
app.get("/", (req, res) => {
  res.render("home", {
    isMobile: req.useragent.isMobile ? "Sim" : "Não",
    isDesktop: req.useragent.isDesktop ? "Sim" : "Não",
    platform: req.useragent.platform,
    browser: req.useragent.browser,
    title: "OneLink POC - Página Inicial",
  });
});

app.get("/:id", (req, res) => {
  const linkId = req.params.id;
  const link = links[linkId];

  if (!link) {
    return res.status(404).render("404", { linkId });
  }

  console.log(
    `[${new Date().toISOString()}] ${linkId} - ${
      req.useragent.isMobile ? "Mobile" : "Desktop"
    } - ${req.useragent.platform}`
  );

  if (req.useragent.isMobile) {
    res.render("redirect", {
      appUrl: link.appUrl,
      webUrl: link.webUrl,
      appStore: link.appStore,
      playStore: link.playStore,
      title: `Redirecionando para ${link.name}...`,
      isiOS: req.useragent.isiOS,
    });
  } else {
    // Desktop vai direto para a web
    res.redirect(link.webUrl);
  }
});

app.listen(port, () => {
  console.log(`🚀 OneLink POC rodando em http://localhost:${port}`);
  console.log(`📱 Teste no mobile para ver o redirecionamento de apps`);
});
