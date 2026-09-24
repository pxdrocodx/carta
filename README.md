# para Jeni... 💌

Carta romântica interativa em HTML, CSS e JavaScript puro (sem frameworks, sem build).

## Estrutura

```
index.html      → as 3 telas (envelope, carta, galeria)
style.css       → todo o visual (paleta, tipografia, animações)
script.js       → efeito de digitação, player, navegação, modal
assets/         → capa do álbum + 3 fotos polaroid (SVGs de exemplo)
```

## Personalizar

Tudo fica num único lugar: o objeto `CONFIG` no topo do `script.js`.

### Adicionar mais páginas e escolher as fotos de cada uma

```js
pages: [
  {
    text: 'Querida Jeni,\n\nBem-vinda a este cantinho...',
    typewriter: true,        // só a 1ª página deve ter isso true
    showMusicAfter: true,    // mostra o player do Spotify ao terminar de digitar
    photos: [],               // sem galeria nesta página
    openGalleryOnEntry: false
  },
  {
    text: '…cada dia que passa, o meu amor por ti cresce...',
    typewriter: false,
    showMusicAfter: false,
    photos: [                          // galeria só com as fotos desta página
      'assets/polaroid1.svg',
      'assets/polaroid2.svg',
      'assets/polaroid3.svg'
    ],
    openGalleryOnEntry: true            // abre a galeria sozinha ao chegar aqui
  },
  {
    // basta copiar e colar este bloco para criar uma 3ª, 4ª... página
    text: 'Mais uma página só nossa...',
    typewriter: false,
    showMusicAfter: false,
    photos: ['assets/foto-da-viagem.jpg'],
    openGalleryOnEntry: false
  }
]
```

- `photos` pode ter **quantas imagens quiser**, e cada página pode ter um conjunto totalmente diferente (ou nenhuma).
- A seta `>` sempre avança para a próxima página do array; a `<` volta. Um contador `1 / 3` aparece automaticamente quando há mais de uma página.
- O ícone de foto (canto inferior) só aparece nas páginas que têm `photos` preenchido, e o ponto vermelho some assim que a galeria daquela página é aberta pela primeira vez.
- Só deixe `typewriter: true` na primeira página — é o efeito de digitação automática descrito no pedido original; as demais páginas exibem o texto direto.

### Trocar as fotos

Coloque seus arquivos `.jpg`/`.png` dentro de `assets/` e referencie o caminho deles em `photos` (ex.: `'assets/praia.jpg'`). Não precisa manter os nomes `polaroid1.svg` etc. — são só placeholders de exemplo.

### Trocar a música

Edite o bloco `music` no topo do `CONFIG`:

```js
music: {
  title: 'Moonlight',
  artist: 'Kali Uchis',
  cover: 'assets/album-cover.svg',
  durationSeconds: 188,
  startAtSeconds: 102
}
```

É um player simulado (sem conta nem API do Spotify).

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex.: `carta-para-jeni`).
2. Suba estes arquivos mantendo a mesma estrutura de pastas:
   ```
   git init
   git add .
   git commit -m "carta romântica"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/carta-para-jeni.git
   git push -u origin main
   ```
3. No repositório, vá em **Settings → Pages**.
4. Em "Build and deployment", selecione **Deploy from a branch**, branch `main`, pasta `/ (root)`.
5. Salve e aguarde cerca de 1 minuto. O site ficará disponível em:
   ```
   https://SEU-USUARIO.github.io/carta-para-jeni/
   ```

Pronto — é só enviar o link. 🖤
