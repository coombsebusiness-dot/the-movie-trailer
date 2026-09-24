"use client";

export default function ArticleLeaderboardAd() {
  const adHtml = `
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

  return (
    <div className="hidden lg:flex flex-col items-center">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
        Advertisement
      </div>

      <iframe
        srcDoc={adHtml}
        title="Advertisement"
        width="728"
        height="90"
        scrolling="no"
        className="block border-0"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin"
      />
    </div>
  );
}
