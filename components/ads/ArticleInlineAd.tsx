"use client";

export default function ArticleInlineAd() {
  const desktopAdHtml = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 728px;
      height: 90px;
      overflow: hidden;
      background: transparent;
    }
  </style>
</head>
<body>
  <script>
    atOptions = {
      'key': '7918701c8d2c091ea9c3c8c07615b5bb',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };
  <\/script>
  <script src="https://www.highrevenueformat.com/7918701c8d2c091ea9c3c8c07615b5bb/invoke.js"><\/script>
</body>
</html>
`;

  const mobileAdHtml = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 300px;
      height: 250px;
      overflow: hidden;
      background: transparent;
    }
  </style>
</head>
<body>
  <script>
    atOptions = {
      'key': 'faf588868194a62146f31126dbc52e90',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };
  <\/script>
  <script src="https://www.highrevenueformat.com/faf588868194a62146f31126dbc52e90/invoke.js"><\/script>
</body>
</html>
`;

  return (
    <div className="py-10">
      <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
        Advertisement
      </div>

      {/* Mobile */}
      <div className="flex justify-center lg:hidden">
        <iframe
          srcDoc={mobileAdHtml}
          title="Advertisement"
          width="300"
          height="250"
          scrolling="no"
          className="block border-0"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin"
        />
      </div>

      {/* Desktop */}
      <div className="hidden justify-center lg:flex">
        <iframe
          srcDoc={desktopAdHtml}
          title="Advertisement"
          width="728"
          height="90"
          scrolling="no"
          className="block border-0"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin"
        />
      </div>
    </div>
  );
}
