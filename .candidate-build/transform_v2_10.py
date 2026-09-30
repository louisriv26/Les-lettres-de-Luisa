from pathlib import Path
import re,hashlib,base64,json,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '.')

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def hashes(html,tag):
    return ['sha256-'+base64.b64encode(hashlib.sha256(m.group(1).encode()).digest()).decode() for m in re.finditer(fr'<{tag}(?:\s[^>]*)?>(.*?)</{tag}>',html,re.I|re.S)]
def rebind(html):
    scripts=hashes(html,'script'); styles=hashes(html,'style')
    def repl(m):
        content=m.group(1)
        content=re.sub(r"script-src-elem\s+[^;]+", "script-src-elem " + ' '.join(f"'{x}'" for x in scripts), content)
        content=re.sub(r"style-src-elem\s+[^;]+", "style-src-elem " + ' '.join(f"'{x}'" for x in styles), content)
        sm=re.search(r"script-src\s+([^;]+)",content)
        if sm:
            seg=sm.group(1); old=re.findall(r"'sha256-[A-Za-z0-9+/=]+'",seg)
            if old:
                seg=seg.replace(old[0],f"'{scripts[0]}'",1)
                content=content[:sm.start(1)]+seg+content[sm.end(1):]
        return '<meta http-equiv="Content-Security-Policy" content="'+content+'">'
    out,n=re.subn(r'<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)">',repl,html,count=1,flags=re.I)
    assert n==1
    return out
p=root/'index.html'; s=p.read_text(encoding='utf-8-sig')
forced='''@media (forced-colors: active){
  .chip.active,.setting-choice.active,.snav-item.active,.help-nav-btn.primary,
  .path-step.done,.path-step.current,.help-dot.active,.letter-item.selected,.tab.active,
  .pnav-item.active,.ldj-card{border:2px solid currentColor!important;}
  .pnav-item.active::after{background:CanvasText!important;forced-color-adjust:auto;}
  .letter-item.selected{outline:1px solid currentColor;outline-offset:-1px;}
  .hl-color-btn,.hl-color-btn.selected{border:2px solid currentColor!important;}
  .install-btn,.action-btn.active,.action-btn[aria-pressed="true"]{border:2px solid currentColor!important;}
}

'''
anchor='mark.hl[role="button"]:focus-visible{outline:2px solid var(--focus);outline-offset:2px;}\n'
assert s.count(anchor)==1 and forced not in s
s=s.replace(anchor,anchor+forced,1)
repls={
'<strong>Version de l’app :</strong> v2.8<br>':'<strong>Version de l’app :</strong> v2.10<br>',
'À propos se trouve à la fin de l’Aide · v2.8 · 2026-09-29':'À propos se trouve à la fin de l’Aide · v2.10 · 2026-09-30',
'v2.8 · 2026-09-29':'v2.10 · 2026-09-30',
'<div class="panel" id="p-list">':'<div class="panel" id="p-list" role="main" aria-label="Liste des lettres">',
"const APP_VERSION = '2.8';":"const APP_VERSION = '2.10';",
'shell-v2.8-b1':'shell-v2.10-b1',
'corpus-v2.8-b1':'corpus-v2.10-b1',
}
for a,b in repls.items():
    assert a in s,(a,s.count(a)); s=s.replace(a,b)
anchor2='function openHelp(startSlide, returnFocusOverride) {'
helper='''function resolveHelpReturnFocus(returnFocusOverride) {
  if (returnFocusOverride && returnFocusOverride.isConnected) return returnFocusOverride;
  var active = document.activeElement;
  if (active && active !== document.body && active !== document.documentElement && active.isConnected) return active;
  return document.querySelector('.panel.active .phone-help-entry') || document.getElementById('snav-help') || document.getElementById('settings-help-btn') || null;
}
'''
assert s.count(anchor2)==1 and 'function resolveHelpReturnFocus' not in s
s=s.replace(anchor2,helper+anchor2,1)
old="activateDialog('help-modal','help-close-btn',returnFocusOverride);"; new="activateDialog('help-modal','help-close-btn',resolveHelpReturnFocus(returnFocusOverride));"
assert s.count(old)==1; s=s.replace(old,new,1)
s=rebind(s)
p.write_text(s,encoding='utf-8')
mp=root/'manifest.json'; m=json.loads(mp.read_text(encoding='utf-8-sig'));m['version']='2.10';m['build_revision']='B1';m['release_id']='lettres-v2.10-b1-prephysical';mp.write_text(json.dumps(m,ensure_ascii=False,indent=4)+'\n',encoding='utf-8')
sp=root/'sw.js'; sw=sp.read_text(encoding='utf-8-sig');sw=sw.replace('v2.8 B1','v2.10 B1').replace('shell-v2.8-b1','shell-v2.10-b1').replace('corpus-v2.8-b1','corpus-v2.10-b1');sp.write_text(sw,encoding='utf-8')
expected={'index.html':'2b9d97a5c99ac1419e9b78b0d448110b94d3bbf20755a6137ae60bf40cc5d99b','manifest.json':'4f09463222166f6b2482c8d2e0faf686a5db528b9f409beebfa4917218af63fb','sw.js':'cd4f9d8813b11d66fba7d94f7ccce9e4fefe83c849949f12e02829652af8bba4'}
for fn,h in expected.items(): assert sha(root/fn)==h,(fn,sha(root/fn),h)
print('LETTRES_2_10_EXACT_OK')
