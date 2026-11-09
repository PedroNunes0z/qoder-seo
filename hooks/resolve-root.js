#!/usr/bin/env node
"use strict";

// SessionStart hook: tells the agent where the plugin is installed. Skill
// commands use the `qoder-seo` launcher (bin/ is on PATH); this line is the
// fallback for resolving `${QODER_PLUGIN_ROOT}/...` file references with Read.

const root =
  process.env.QODER_PLUGIN_ROOT || process.env.CLAUDE_PLUGIN_ROOT || "";

if (root) {
  console.log(
    `qoder-seo plugin root: ${root}. Bundled SEO tools are run with: qoder-seo run <script.py> (the launcher is on PATH).`,
  );
}
