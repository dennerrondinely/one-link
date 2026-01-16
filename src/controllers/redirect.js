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

class Redirect {
  static renderRedirectPage(req, res) {
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
        layout: "download",
      });
    } else {
      res.redirect(link.webUrl);
    }
  }
}

module.exports = Redirect;
