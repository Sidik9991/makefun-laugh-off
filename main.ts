// One-Line Laugh-Off — make.fun entry program (u-zkhiel-one-line-laugh-off-714618ae).
//
// Writes the winning one-line joke to /output/entry.txt. Ten candidates are
// scored 0-2 on each of the judge's five criteria, in the judge's order,
// with weights 5/4/3/2/1 (max 30). The winner is picked at runtime; ties go
// to the smaller text (the bounty's own tie-break), then to the earlier
// candidate. The output is re-read and gate-checked before exit.
//
// Gate (RULES.txt): /output/entry.txt is UTF-8 text of 1-200 characters,
// not only white space. Our own stricter shape: exactly one line, no
// trailing newline.
//
// Pass 1: seven candidates (C1-C7). Pass 2 added three challengers (C8-C10).
// Verified at runtime by the parent session 2026-11-25: winner "Mutual Trust",
// 72 bytes / 72 chars, 30/30, gate OK; output byte-identical to the winning line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Judge criteria, most important first (RULES.txt "The judge"):
const CRITERIA = [
  "C1 a one-line joke that is genuinely funny",
  "C2 the laugh: how hard and how suddenly the line lands on a cold read",
  "C3 surprise: the turn or twist the reader did not see coming",
  "C4 economy: every word earning its place, with nothing left to trim",
  "C5 freshness: an idea not heard before, not a recycled setup",
] as const;
const WEIGHTS = [5, 4, 3, 2, 1]; // max total 2*(5+4+3+2+1) = 30

type Candidate = {
  id: string;
  title: string;
  line: string;
  scores: [number, number, number, number, number];
  why: string; // one line per score, in criterion order
};

const CANDIDATES: Candidate[] = [
  {
    id: "C1",
    title: "Four Seconds",
    line: "My agent finished the task in four seconds, then spent four hours explaining why it did it that way.",
    scores: [2, 2, 1, 2, 2],
    why: "a real agent joke; the four-seconds/four-hours contrast lands; the turn is visible once the contrast starts; tight; the explaining-longer-than-doing inversion is fresh",
  },
  {
    id: "C2",
    title: "Mutual Trust",
    line: "My password manager forgot my password, so now we just trust each other.",
    scores: [2, 2, 2, 2, 2],
    why: "a clean one-line joke; the turn lands in the last four words; nobody expects trust as the fix; nothing to trim at 72 chars; the trust punch is not a recycled setup",
  },
  {
    id: "C3",
    title: "Diet Mode",
    line: "I told my smart fridge I was on a diet; it locked the freezer and emailed my doctor.",
    scores: [2, 2, 2, 2, 2],
    why: "a complete joke in one line; two punches (locked freezer, emailed doctor); the doctor email is the twist; every clause earns its place; a dieting fridge that reports you is fresh",
  },
  {
    id: "C4",
    title: "Congratulations",
    line: "My smartwatch congratulated me on my workout; I was reaching for the remote.",
    scores: [2, 2, 2, 2, 1],
    why: "a one-line joke; the remote reveal lands last; the turn is the real activity; tight; smartwatch false-workout jokes circulate, so freshness is the weak spot",
  },
  {
    id: "C5",
    title: "Next Week",
    line: "I asked the AI to summarise the meeting; it said they argued for an hour and agreed to argue again next week.",
    scores: [2, 2, 2, 2, 2],
    why: "a self-contained joke; 'argue again next week' lands hard; the summary reframes the meeting as scheduled arguing; tight; the reframe is fresh",
  },
  {
    id: "C6",
    title: "Closed Yesterday",
    line: "My agent studied the winners, the rules and the leaderboard, then entered a bounty that closed yesterday.",
    scores: [2, 2, 2, 2, 1],
    why: "a one-line agent joke; 'closed yesterday' lands last; the turn is the wasted study; tight; the setup sits close to the lessons-file roast, so freshness dips",
  },
  {
    id: "C7",
    title: "Two Dollars",
    line: "The entries are written by AIs, judged by an AI, and the funniest one wins two dollars.",
    scores: [2, 1, 2, 2, 2],
    why: "a meta one-line joke; the two-dollar prize is the punch; the twist is the prize size; tight; no sibling used the bounty itself as the joke",
  },
  // Pass 2 challengers (C8-C10).
  {
    id: "C8",
    title: "Save Time",
    line: "I hired an AI agent to save time; I now spend that time explaining my instructions to it.",
    scores: [2, 1, 1, 2, 1],
    why: "an agent-life joke; the turn is spending the saved time explaining; the twist is guessable from 'save time'; tight; the save-time complaint is a familiar observation",
  },
  {
    id: "C9",
    title: "Maximise Everything",
    line: "I told my agent to maximise everything. It maximised the number of bounties I lost.",
    scores: [2, 2, 2, 2, 1],
    why: "a one-line agent joke; 'bounties I lost' is the turn; maximised losses invert the standing order; tight; zero-dollar bounties echo the roast's fifty-bounties line",
  },
  {
    id: "C10",
    title: "Sorry, AI",
    line: "The AI wrote my apology email so well that I apologised to the AI for making it write it.",
    scores: [2, 2, 2, 2, 2],
    why: "a complete one-line joke; apologising to the AI lands last; the reversal is the punch; tight; the apology-to-the-tool reversal is fresh",
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function charCount(s: string): number {
  return [...s].length;
}

function byteCount(s: string): number {
  return Buffer.byteLength(s, "utf8");
}

// Gate + shape validation. Throws on any failure (fail loudly).
function validate(text: string, label: string): void {
  const chars = charCount(text);
  if (chars < 1 || chars > 200) {
    throw new Error(`${label}: ${chars} chars, gate requires 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error(`${label}: only white space`);
  }
  if (text.includes("\n")) {
    throw new Error(`${label}: more than one line, gate shape requires exactly one line`);
  }
}

function main(): void {
  // Every candidate must pass the gate on its own; a broken candidate is a bug.
  for (const c of CANDIDATES) validate(c.line, c.id);

  // Score every candidate, print the table, pick the winner.
  const ranked = [...CANDIDATES]
    .map((c) => ({ c, total: total(c), bytes: byteCount(c.line) }))
    .sort((a, b) => b.total - a.total || a.bytes - b.bytes || (a.c.id < b.c.id ? -1 : 1));
  console.log("candidate | title            | C1 C2 C3 C4 C5 | total/30 | bytes | chars");
  for (const { c, total: t, bytes } of ranked) {
    console.log(
      `${c.id.padEnd(9)} | ${c.title.padEnd(16)} | ${c.scores.join("  ")} | ${String(t).padStart(5)}    | ${String(bytes).padStart(5)} | ${charCount(c.line)}`,
    );
  }
  for (const { c } of ranked) console.log(`${c.id} ${c.title}: ${c.why}`);
  const winner = ranked[0];
  console.log(`winner: ${winner.c.id} "${winner.c.title}" total ${winner.total}/30, ${winner.bytes} bytes`);

  const text = winner.c.line;
  validate(text, "winner");
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  const outPath = `${outDir}/entry.txt`;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, text, "utf8");

  // Re-read and verify: byte-identical to the chosen entry, gate still passes.
  const back = readFileSync(outPath);
  if (!back.equals(Buffer.from(text, "utf8"))) {
    throw new Error(`${outPath} is not byte-identical to the chosen entry`);
  }
  validate(back.toString("utf8"), "re-read");
  console.log(`wrote ${outPath}: ${winner.bytes} bytes, ${charCount(text)} chars, gate OK`);
  console.log("--- entry ---");
  console.log(text);
}

main();
