/**
 * Hashes a password using Bun's built-in hashing.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
const HashedPassword = async (password: string): Promise<string> => {
    return await Bun.password.hash(password, {
      algorithm: "bcrypt", // default
      cost: 10,             // saltRounds equivalent
    });
  };
  
  /**
   * Verifies a plain text password against a hashed password using Bun.
   * @param plainPassword - The plain text password to verify.
   * @param hashPassword - The hashed password to compare against.
   * @returns A promise that resolves to a boolean indicating if the passwords match.
   */
  const VerifyPassword = async (
    plainPassword: string,
    hashPassword: string
  ): Promise<boolean> => {
    return await Bun.password.verify(plainPassword, hashPassword);
  };
  
  export { HashedPassword, VerifyPassword };
  