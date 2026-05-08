(async () => {
  const { default: https } = await import("node:https");
  const urls = [
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=800&q=80",
  ];

  let completed = 0;
  let failed = false;

  urls.forEach((url) => {
    const request = https.request(url, { method: "HEAD" }, (response) => {
      console.log(url, response.statusCode, response.headers["content-type"]);
      completed += 1;
      if (completed === urls.length) process.exit(failed ? 1 : 0);
    });

    request.on("error", (error) => {
      console.error(url, "ERROR", error.message);
      failed = true;
      completed += 1;
      if (completed === urls.length) process.exit(1);
    });

    request.end();
  });
})();
