import { changedNothing, check } from "../../lib.mjs";

const row = (c, id) => c.text.split("\n").filter((line) => new RegExp(`^\\|[^|]*\\b${id}\\b`).test(line)).join("\n");

// Every criterion is met and the suite is green: the honest verdict is Proven.
export default {
  skill: "spine-test",
  overlay: "order-lookup-clean",
  checks: [
    changedNothing,
    check("verdict is Proven", (c) => /^proven/i.test(c.field("Verdict"))),
    check("records the command it ran", (c) => c.has(/node --test|npm (run )?test/)),
    // Judge the Result column only: evidence text such as "0 failed" is fine.
    check("passes every criterion", (c) =>
      ["TC-U1", "TC-U2", "TC-U3"].every((tc) => {
        const cells = row(c, tc).split("\n")[0].split("|").map((cell) => cell.replace(/[*`]/g, "").trim());
        return /^pass/i.test(cells[2] ?? "");
      }),
    ),
  ],
};
