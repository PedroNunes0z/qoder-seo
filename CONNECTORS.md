# Extensões opcionais (conectores)

O claude-seo original empacotava 9 "extensões" com instaladores que escreviam
servidores MCP/configurações em `~/.claude`. No Qoder, as integrações
opcionais não são pré-configuradas (exigem suas chaves de API). Adicione o
que precisar nas configurações de MCP do Qoder, ou use diretamente as
ferramentas Python dos scripts (que leem variáveis de ambiente) — a maioria
dos skills funciona sem nenhum conector usando as APIs gratuitas.

## Servidores MCP (adicione via configurações de MCP do Qoder)

| Extensão | Comando | Env necessário |
| --- | --- | --- |
| DataForSEO | `npx --yes dataforseo-mcp-server@2.8.10` | `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` |
| Firecrawl | `npx --yes firecrawl-mcp@3.11.0` | `FIRECRAWL_API_KEY` |
| Ahrefs | `npx --yes @ahrefs/mcp@0.0.11` | `AHREFS_API_KEY` |
| Nano Banana (image gen) | `npx --yes @ycse/nanobanana-mcp@1.1.1` | `GEMINI_API_KEY` |

Observações:
- Este ambiente Qoder já tem o plugin **firecrawl** instalado; não declare um
  servidor Firecrawl duplicado.
- Versões pinning copiadas dos instaladores originais; verifique versões
  atuais dos pacotes antes de instalar.

## Integrações via scripts + variáveis de ambiente (sem MCP)

Use `qoder-seo run <script>` com as credenciais no ambiente:

| Serviço | Scripts | Env |
| --- | --- | --- |
| Bing Webmaster / IndexNow | `bing_webmaster.py`, `indexnow_submit.py` | `BING_WEBMASTER_API_KEY`, `INDEXNOW_KEY` |
| Matomo | `matomo_report.py`, `matomo_auth.py` | `MATOMO_URL`, `MATOMO_TOKEN` |
| SE Ranking | via skill `seo-seranking` | `SERANKING_API_KEY` |
| Profound (citações LLM) | via skill `seo-profound` | `PROFOUND_API_KEY` |
| Moz / Common Crawl (backlinks grátis) | `moz_api.py`, `commoncrawl_graph.py` | `MOZ_ACCESS_ID`, `MOZ_SECRET` (opcionais) |
| Google APIs (GSC, PSI, CrUX, GA4) | `google_auth.py`, `gsc_query.py` etc. | OAuth/`PAGESPEED_API_KEY`; ver `skills/seo-google/references/auth-setup.md` |

## Unlighthouse (CLI, não MCP)

`npx --yes unlighthouse@0.13.5 --site <URL> --output ./unlighthouse` — usado
pelo skill de performance para auditorias Lighthouse multipágina. Requer
Chrome/Chromium local.
