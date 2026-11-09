# qoder-seo — SEO completo para Qoder

Port do plugin [claude-seo v2.5.0](https://github.com/AgriciDaniel/claude-seo)
(MIT, por [@AgriciDaniel](https://github.com/AgriciDaniel)) para Qoder,
mantido por **Pedro Nunes** ([github.com/PedroNunes0z/qoder-seo](https://github.com/PedroNunes0z/qoder-seo)).
Empacota 26 skills, 19 subagents e 60 ferramentas Python para análise SEO:
auditoria técnica, conteúdo/E-E-A-T, schema.org, sitemaps, Core Web Vitals
(INP), imagens, SEO local, backlinks, GEO/AI Overviews, ecommerce, hreflang,
SXO, clustering semântico, monitoramento de drift e APIs do Google.

> **Aviso:** este é um port comunitário não oficial. Não há afiliação com, ou
> endosso de, AgriciDaniel (autor do claude-seo), Anthropic (marca "Claude")
> ou Qoder. O trabalho original é distribuído sob licença MIT, cujo texto e
> aviso de copyright estão preservados em [`LICENSE`](LICENSE).

## Instalação

1. Baixe o `qoder-seo.zip` da página [Releases](../../releases) (ou gere você
   mesmo: compacte o conteúdo deste repositório com `.qoder-plugin/plugin.json`
   na raiz do ZIP).
2. No Qoder, instale o plugin a partir do ZIP — pela tela de extensões
   (importar plugin local) ou pedindo ao agente:
   "instale o plugin local a partir de C:\caminho\qoder-seo.zip".
3. Reinicie o Qoder ou recarregue as extensões.

Requisitos: Node.js (hooks) e Python 3.11–3.14 no PATH. Na primeira
execução de uma ferramenta o ambiente Python é criado automaticamente
(ou antes, com `qoder-seo setup`).

## Uso

Instale o plugin no Qoder e reinicie/recarregue extensões. Depois pergunte,
por exemplo:

- `/seo audit https://exemplo.com` — auditoria completa com subagents paralelos
- `/seo technical https://exemplo.com/pagina`
- `faça uma análise de schema em https://exemplo.com`

As skills também são ativadas automaticamente por contexto (SEO, Core Web
Vitals, sitemap, GEO etc.). O hub `seo` roteia para as skills específicas.

## Como rodar as ferramentas

Todo script Python é executado pelo launcher empacotado:

```bash
qoder-seo run <script.py> [args]      # via bin/qoder-seo (PATH do plugin)
qoder-seo doctor                       # checagem de prontidão do ambiente
qoder-seo setup                        # cria/atualiza o venv gerenciado
```

Na primeira execução o runtime cria um venv isolado e instala
`requirements.txt` (requer Python 3.11–3.14 no sistema; pode demorar alguns
minutos). O ambiente fica em `%LOCALAPPDATA%\qoder-seo` (Windows),
`~/Library/Application Support/qoder-seo` (macOS) ou
`~/.local/share/qoder-seo` (Linux). Para escolher o interpretador, defina
`CLAUDE_SEO_PYTHON`; para mudar o diretório de dados, `CLAUDE_SEO_DATA_DIR`
(nomes herdados do upstream).

## O que mudou no port

| Claude Code | Qoder |
| --- | --- |
| `.claude-plugin/plugin.json` | `.qoder-plugin/plugin.json` (o original foi removido do pacote) |
| `"${CLAUDE_PLUGIN_ROOT}/scripts/claude-seo" run ...` (192 ocorrências) | `qoder-seo run ...` via wrapper `bin/qoder-seo`, que o Qoder coloca no `PATH` da sessão |
| `model: sonnet`/`opus` nos subagents | removido (o Qoder gerencia modelos; aliases Claude não resolvem) |
| Hook `PostToolUse` de validação de schema | mantido; `run-python-hook.js` agora também lê `tool_input.file_path` do payload stdin, caso o placeholder `${tool_input.*}` não seja expandido |
| — | novo hook `SessionStart` (`hooks/resolve-root.js`) anuncia o diretório raiz do plugin para resolver referências de arquivo `${QODER_PLUGIN_ROOT}/...` |
| `runtime.py` | reconhece `QODER_PLUGIN_ROOT`/`QODER_PLUGIN_DATA` e `.qoder-plugin/plugin.json`; dados em `.../qoder-seo` |
| `install.sh`/`install.ps1`, `CLAUDE.md`, `tests/`, `docs/`, `screenshots/` | omitidos (instalação é pelo Qoder; documentação de desenvolvimento não é necessária em runtime) |
| `extensions/` (9 instaladores de MCP no formato Claude) | omitidos; configuração documentada em `CONNECTORS.md` |

Referências a "Claude SEO" no texto dos skills são proveniência do upstream;
comandos, caminhos e variáveis citados nas skills foram verificados para o
Qoder. Nada foi revalidado contra a API do Google/Firecrawl neste port.

## Dependências e credenciais

- Node.js (hooks e extensões MCP) e Python 3.11–3.14.
- Playwright é instalado no venv; o download do Chromium ocorre sob demanda
  nos fluxos de renderização SPA (`render_page.py --mode always/auto`).
- APIs externas exigem credenciais suas: Google Search Console/PageSpeed/GA4
  (veja `skills/seo-google/references/auth-setup.md`), DataForSEO, Moz,
  Bing Webmaster etc. As extensões opcionais estão em `CONNECTORS.md`.
- Nada de chaves ou configuração local está incluído no pacote.

## Segurança

Os fetchers empacotados (`fetch_page.py`, `render_page.py`, `url_safety.py`)
validam SSRF/DNS-rebinding. As skills mandam usá-los em vez de
`requests.get` direto — regra preservada do upstream.

## Licença e atribuição

- Código e conteúdo originais: MIT, © 2026 agricidaniel — ver [`LICENSE`](LICENSE)
  e [`CITATION.cff`](CITATION.cff).
- Adaptações para Qoder (bin wrapper, hooks, manifesto, `runtime.py`): mantidas
  sob a mesma licença MIT, com base em claude-seo v2.5.0.
- Contribuições ao claude-seo: Lutfiya Miller, Chris Muller, Florian Schmitz,
  Dan Colta e Matej Marjanovic (v1.9.0).

## Atualizando a partir do upstream

Quando sair nova versão do claude-seo, refazer o port:

1. Copiar `skills/ agents/ hooks/ scripts/ schema/ data/` e os arquivos de
   runtime do repo novo.
2. Substituir todas as ocorrências de `"${CLAUDE_PLUGIN_ROOT}/scripts/claude-seo"`
   por `qoder-seo` nos `.md`; referências restantes de `${CLAUDE_PLUGIN_ROOT}`
   viram `${QODER_PLUGIN_ROOT}`.
3. Remover linhas `model:` do frontmatter dos agents; conferir
   `scripts/runtime.py` (paths `.qoder-plugin`, `QODER_PLUGIN_*`, dados em
   `qoder-seo`) e a forma canônica em `scripts/consistency_check.py`.
4. Validar com `node --check`, `python -m py_compile`, `qoder-seo doctor` e
   `qoder-seo run portability_check.py`; bumpar `version` no manifesto e gerar
   o ZIP de release.
