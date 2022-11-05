import { describe, expect } from "manten";
import { TextParser } from "../src";

describe("TextParser", ({ test }) => {
  test("Argument", () => {
    const parser = new TextParser();
    parser.registerCommand("t", true, (arg) => arg.toUpperCase());
    expect(parser.parse("Hello \\t[world]")).toBe("Hello WORLD");
  });

  test("No argument", () => {
    const parser = new TextParser();
    parser.registerCommand("t", false, () => "world");
    expect(parser.parse("Hello \\t")).toBe("Hello world");
  });

  test("Expected argument", () => {
    const parser = new TextParser();
    parser.registerCommand("t", true, () => "world");
    expect(() => parser.parse("Hello \\tworld")).toThrow();
  })

  test("Optional argument", () => {
    const parser = new TextParser();
    parser.registerCommand("t", false, () => "Hello");
    parser.registerCommand("t", true, (arg) => arg.toUpperCase());
    expect(parser.parse("\\t \\t[world]")).toBe("Hello WORLD");
  });

  test("Invalid format", () => {
    const parser = new TextParser();
    parser.registerCommand("t", true, (arg) => arg.toUpperCase());
    expect(() => parser.parse("Hello \\t[world")).toThrow();
  });

  test("Nested commands", () => {
    const parser = new TextParser();
    parser.registerCommand("t", true, (arg) => arg.toUpperCase());
    parser.registerCommand("T", true, (arg) => arg.toLowerCase());
    expect(parser.parse("Hel\\t[l\\t[o w]o]rld")).toBe("HelLo wOrld");
  });

  test("Can't overwrite existing command", () => {
    const parser = new TextParser();
    parser.registerCommand("t", false, () => {});
    parser.registerCommand("t", true, () => {});
    expect(() => parser.registerCommand("t", false, () => {})).toThrow();
    expect(() => parser.registerCommand("t", true, () => {})).toThrow();
  });
});
