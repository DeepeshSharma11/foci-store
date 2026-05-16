const fs = require('fs').promises;
const path = require('path');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

async function copyDir(srcDir, destDir) {
  try {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    for (const e of entries) {
      const srcPath = path.join(srcDir, e.name);
      const destPath = path.join(destDir, e.name);
      if (e.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await ensureDir(path.dirname(destPath));
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    // ignore if srcDir doesn't exist
  }
}

async function prepare() {
  const root = path.resolve(__dirname, '..');
  const publicPages = path.join(root, 'public', 'pages');
  const publicJs = path.join(root, 'public', 'js');
  const publicCss = path.join(root, 'public', 'css');
  const publicAssets = path.join(root, 'public', 'assets');

  await ensureDir(publicPages);
  await ensureDir(publicJs);
  await ensureDir(publicCss);
  await ensureDir(publicAssets);

  // Copy assets directory if present
  const assetsSrc = path.join(root, 'assets');
  try {
    const st = await fs.stat(assetsSrc);
    if (st.isDirectory()) await copyDir(assetsSrc, publicAssets);
  } catch (e) {}

  // Copy JS files to /public/js
  const jsCandidates = ['script.js', 'data.js'];
  for (const js of jsCandidates) {
    const src = path.join(root, js);
    try {
      await fs.stat(src);
      await copyFile(src, path.join(publicJs, js));
    } catch (e) {}
  }

  // Copy CSS files to /public/css
  const cssCandidates = ['style.css', 'responsive.css', 'animations.css'];
  for (const css of cssCandidates) {
    const src = path.join(root, css);
    try {
      await fs.stat(src);
      await copyFile(src, path.join(publicCss, css));
    } catch (e) {}
  }

  // Copy and rewrite HTML files into public/pages
  try {
    const rootEntries = await fs.readdir(root, { withFileTypes: true });
    for (const e of rootEntries) {
      if (!e.isFile()) continue;
      if (!e.name.endsWith('.html')) continue;
      const srcPath = path.join(root, e.name);
      let html = await fs.readFile(srcPath, 'utf8');

      // Normalize asset links: assets/ -> /assets/
      html = html.replace(/(href|src)=["'](?:\.\/)?assets\/([^"']+)["']/gi, (m, attr, rest) => `${attr}="/assets/${rest}"`);

      // CSS links -> /css/<file>
      html = html.replace(/<link([^>]*rel=["']stylesheet["'][^>]*)href=["'](?:\.\/)?([^"']+\.css)["']([^>]*)>/gi, (m, pre, href, post) => {
        const filename = path.basename(href);
        return `<link ${pre} href="/css/${filename}"${post}>`;
      });

      // JS src -> /js/<file>
      html = html.replace(/<script([^>]*)src=["'](?:\.\/)?([^"']+\.js)["']([^>]*)><\/script>/gi, (m, a, src, b) => {
        const filename = path.basename(src);
        return `<script${a}src="/js/${filename}"${b}></script>`;
      });

      // Make relative src attributes root-relative (except data: and external URLs)
      html = html.replace(/(src)=["'](?!\/)(?!https?:\/\/)([^"']+)["']/gi, (m, attr, val) => {
        if (val.startsWith('data:')) return `${attr}="${val}"`;
        return `${attr}="/${val}"`;
      });

      await fs.writeFile(path.join(publicPages, e.name), html, 'utf8');
    }
  } catch (e) {
    console.error('failed preparing HTML', e);
  }

  // Create styles/globals.css by concatenating the main CSS files
  const globalsPath = path.join(root, 'styles', 'globals.css');
  await ensureDir(path.dirname(globalsPath));
  let combined = '';
  for (const css of cssCandidates) {
    try {
      const content = await fs.readFile(path.join(root, css), 'utf8');
      combined += `/* --- ${css} --- */\n` + content + '\n\n';
    } catch (e) {}
  }
  try {
    await fs.writeFile(globalsPath, combined, 'utf8');
  } catch (e) {
    console.error('failed writing globals.css', e);
  }

  console.log('prepare finished. Run `npm install` then `npm run prepare`, then `npm run dev`.');
}

prepare().catch(err => { console.error(err); process.exit(1); });
