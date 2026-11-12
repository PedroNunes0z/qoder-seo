# qoder-seo - SEO completo para Qoder

[![Linguagem principal](https://img.shields.io/github/languages/top/PedroNunes0z/qoder-seo)](https://github.com/PedroNunes0z/qoder-seo)
[![Linguagens](https://img.shields.io/github/languages/count/PedroNunes0z/qoder-seo)](https://github.com/PedroNunes0z/qoder-seo)
[![Stars](https://img.shields.io/github/stars/PedroNunes0z/qoder-seo?style=for-the-badge&logo=github&label=stars)](https://github.com/PedroNunes0z/qoder-seo/stargazers)
[![Forks](https://img.shields.io/github/forks/PedroNunes0z/qoder-seo?style=for-the-badge&logo=github&label=forks)](https://github.com/PedroNunes0z/qoder-seo/network/members)
[![Issues](https://img.shields.io/github/issues/PedroNunes0z/qoder-seo?style=for-the-badge&logo=github&label=issues)](https://github.com/PedroNunes0z/qoder-seo/issues)
[![Último commit](https://img.shields.io/github/last-commit/PedroNunes0z/qoder-seo?style=for-the-badge&logo=git&label=last%20commit)](https://github.com/PedroNunes0z/qoder-seo/commits/main)
[![Licença MIT](https://img.shields.io/github/license/PedroNunes0z/qoder-seo?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Python 3.11–3.14](https://img.shields.io/badge/Python-3.11%E2%80%933.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-required-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

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
| `install.sh`/`install.ps1` (raiz), `CLAUDE.md`, `tests/`, `screenshots/`, `.github/` | omitidos (instalação é pelo Qoder; documentação de desenvolvimento não é necessária em runtime) |
| `extensions/` e `docs/` | incluídos como referência. O Qoder só carrega automaticamente os `skills/` de nível superior; os 7 skills extras em `extensions/*/skills/` ficam disponíveis como documentação e extensão. |

Referências a "Claude SEO" no texto dos skills são proveniência do upstream;
comandos, caminhos e variáveis citados nas skills foram verificados para o
Qoder. Nada foi revalidado contra a API do Google/Firecrawl neste port.

## Dependências e credenciais

- Node.js (hooks e extensões MCP) e Python 3.11–3.14.
- Playwright é instalado no venv; o download do Chromium ocorre sob demanda
  nos fluxos de renderização SPA (`render_page.py --mode always/auto`).
- No Windows, a exportação **PDF** do `google_report.py` exige as libs
  nativas GTK/Pango (o `weasyprint` de pip não as inclui); os formatos
  HTML/XLSX funcionam sem nada extra e o erro é reportado de forma graciosa.
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
