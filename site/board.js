// Renders board1.txt (spec 5.8) with textContent only: names are chosen by players and never treated as HTML.
const TIERS = ['若葉 Wakaba', '梅 Ume', '竹 Take', '松 Matsu', 'マスター Master'];

function cell(text, cls) {
  const td = document.createElement('td');
  td.textContent = text;
  if (cls) td.className = cls;
  return td;
}

async function load() {
  const info = document.getElementById('info');
  try {
    const r = await fetch('board1.txt', { cache: 'no-store' });
    const txt = await r.text();
    if (txt.length > 16000) throw new Error('too big');
    const lines = txt.split('\n').filter((l) => l !== '');
    const head = lines[0].split('\t');
    if (head[0] !== 'TRB1' || !lines[lines.length - 1].startsWith('END\t')) throw new Error('format');
    const built = new Date(Number(head[1]) * 1000);
    info.textContent = `${head[2]}人掲載 / ${head[2]} players · 更新 / updated ${built.toLocaleString()}`;
    const tbody = document.getElementById('rows');
    for (const line of lines) {
      const f = line.split('\t');
      if (f[0] !== 'R') continue;
      const [, pos, rp, tier, games, date, tag, name] = f;
      const tr = document.createElement('tr');
      tr.append(cell(pos, 'n'));
      const who = document.createElement('td');
      who.append(document.createTextNode(name || '（非公開）'));
      const t = document.createElement('span');
      t.className = 'tag';
      t.textContent = ` #${tag}`;
      who.append(t);
      tr.append(who, cell(TIERS[Number(tier)] ?? tier), cell(rp, 'n'), cell(games, 'n'), cell(date));
      tbody.append(tr);
    }
    if (!tbody.children.length) info.textContent += ' · まだ掲載はありません / No rows yet';
  } catch {
    info.textContent = 'ランキング表を読み込めませんでした / Could not load the board';
  }
}

load();
