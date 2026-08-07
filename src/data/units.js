// The 27 real unit numbers supplied by Pivu Holdings.
// The remaining slots are placeholders until the owner provides
// the actual unit numbers.

const actualUnits = [
  "1A4",
  "1A8",
  "1C3",
  "1C7",
  "1C8",
  "1D1",
  "1D8",
  "1E2",
  "1E3",
  "1E4",
  "1H5B",
  "1H10",

  "2A2",
  "2B3",
  "2B5",
  "2D3",
  "2E1",
  "2E2",
  "2E5",
  "2E6",
  "2F1",
  "2F2",
  "2F3",
  "2F5",
  "2F6",
  "2A3",
  "2A4"
];

const placeholderUnits = Array.from(
  { length: 100 - actualUnits.length },
  (_, index) =>
    `UNIT-${String(actualUnits.length + index + 1).padStart(3, "0")}`
);

export const units = [
  ...actualUnits,
  ...placeholderUnits
];