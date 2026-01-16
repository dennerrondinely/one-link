class Home {
  static render(req, res) {
    res.render("home", {
      isMobile: req.useragent.isMobile ? "Sim" : "Não",
      isDesktop: req.useragent.isDesktop ? "Sim" : "Não",
      platform: req.useragent.platform,
      browser: req.useragent.browser,
      title: "OneLink POC - Página Inicial",
    });
  }
}

module.exports = Home;