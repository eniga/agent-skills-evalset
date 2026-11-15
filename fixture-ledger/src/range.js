"use strict";

// Whether an ISO date falls inside a range. Either end may be omitted.
// ISO dates compare correctly as strings.
function inRange(date, range = {}) {
  if (range.from && date < range.from) return false;
  if (range.to && date >= range.to) return false;
  return true;
}

module.exports = { inRange };
