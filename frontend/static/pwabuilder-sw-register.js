if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    // eslint-disable-next-line no-console
    console.log(
      "[PWA Builder] active service worker found, no need to register"
    )
  } else {
    // Register the service worker
    navigator.serviceWorker
      .register("pwabuilder-sw.js", {
        scope: "./",
      })
      .then(function(reg) {
        // eslint-disable-next-line no-console
        console.log(
          "[PWA Builder] Service worker has been registered for scope: " +
            reg.scope
        )
      })
  }
}
