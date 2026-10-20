#!/usr/bin/env node
/**
 * Writes site/data/contributions.json from a GitHub user's PUBLIC
 * contribution calendar (the same data shown on their profile page).
 *
 * - With GH_TOKEN set, uses the GraphQL API (exact counts).
 * - Without a token, reads the public calendar fragment at
 *   github.com/users/<login>/contributions (no auth needed).
 *
 * If both fail, the existing snapshot is left untouched and the script
 * exits 0 so a deploy never breaks because of a network hiccup.
 *
 * Env: GH_USERNAME (default j2445), GH_TOKEN (optional),
 *      OUTPUT_PATH (default site/data/contributions.json)
 */

import fs from "node:fs";
import path from "node:path";

const LOGIN = process.env.GH_USERNAME || "j2445";
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const OUTPUT = process.env.OUTPUT_PATH || "site/data/contributions.json";

async function viaGraphQL() {
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });
  if (!res.ok) throw new Error(`GraphQL ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  const levels = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  const cal = json.data.user.contributionsCollection.contributionCalendar;
  return cal.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: levels[d.contributionLevel] ?? 0 }))
  );
}

async function viaPublicCalendar() {
  const res = await fetch(`https://github.com/users/${LOGIN}/contributions`, {
    headers: { "User-Agent": "portfolio-contributions-snapshot" },
  });
  if (!res.ok) throw new Error(`Calendar ${res.status}`);
  const html = await res.text();

  // Tooltips carry the counts ("4 contributions on …" / "No contributions on …"),
  // keyed to the cell id they describe.
  const counts = new Map();
  for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)</g)) {
    const n = m[2].trim().match(/^(\d+)\s+contribution/);
    counts.set(m[1], n ? Number(n[1]) : 0);
  }

  const days = [];
  for (const m of html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
    const tag = m[0];
    const date = tag.match(/data-date="([^"]+)"/)?.[1];
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    if (date) days.push({ date, count: counts.get(id) ?? 0, level });
  }
  if (days.length < 300) throw new Error(`Only parsed ${days.length} days`);
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

async function main() {
  let days;
  let method;
  try {
    if (!TOKEN) throw new Error("no token");
    days = await viaGraphQL();
    method = "GitHub GraphQL API";
  } catch (err) {
    if (TOKEN) console.warn(`GraphQL failed (${err.message}); trying public calendar`);
    try {
      days = await viaPublicCalendar();
      method = "public GitHub contribution calendar";
    } catch (err2) {
      console.warn(`Could not refresh contributions (${err2.message}); keeping existing snapshot.`);
      return;
    }
  }

  const out = {
    source: `github.com/${LOGIN}`,
    method,
    login: LOGIN,
    fetchedAt: new Date().toISOString(),
    total: days.reduce((s, d) => s + d.count, 0),
    days,
  };
  const file = path.resolve(OUTPUT);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out) + "\n", "utf8");
  console.log(`Wrote ${days.length} days (${out.total} contributions) via ${method} → ${OUTPUT}`);
}

main();
