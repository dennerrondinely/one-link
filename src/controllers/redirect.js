const links = require("../constants");

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
