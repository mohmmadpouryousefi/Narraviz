// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getDummyHash, hashPassword, verifyPassword } from "@/lib/password";

describe("password hashing", () => {
  it("verifies the right password and rejects a wrong one", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
    expect(await verifyPassword("correct horse battery stapl", hash)).toBe(false);
  });

  it("stores parameters and a random salt", async () => {
    const [a, b] = await Promise.all([hashPassword("same"), hashPassword("same")]);
    expect(a).toMatch(/^scrypt\$32768\$8\$1\$[^$]+\$[^$]+$/);
    expect(a).not.toBe(b);
  });

  it("treats Unicode-equivalent passwords as equal", async () => {
    const hash = await hashPassword("café"); // precomposed é
    expect(await verifyPassword("café", hash)).toBe(true); // e + combining accent
  });

  it("rejects malformed stored hashes without throwing", async () => {
    expect(await verifyPassword("x", "")).toBe(false);
    expect(await verifyPassword("x", "bcrypt$abc")).toBe(false);
    expect(await verifyPassword("x", "scrypt$abc$8$1$c2FsdA==$aGFzaA==")).toBe(false);
  });

  it("caches the dummy hash used for unknown emails", async () => {
    const first = await getDummyHash();
    expect(await getDummyHash()).toBe(first);
    expect(await verifyPassword("anything", first)).toBe(false);
  });
});
