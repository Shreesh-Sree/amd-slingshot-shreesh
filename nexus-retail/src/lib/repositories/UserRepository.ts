import { PrismaClient } from '@prisma/client';

// In a real application, initialize Prisma in a separate singleton file
const prisma = new PrismaClient();

export class UserRepository {
  /**
   * Syncs a Firebase user to the PostgreSQL Database.
   * If the user already exists (mapped by firebaseUid), returns the user.
   * Otherwise, provisions a new mapped identity.
   */
  static async syncIdentity(firebaseUid: string, email: string, name?: string) {
    // Upsert avoids race conditions
    return await prisma.user.upsert({
      where: { firebaseUid },
      update: {
        // Only update easily mutable fields like name if preferred, 
        // though typically Zero Trust demands deliberate updates.
        ...(name && { name })
      },
      create: {
        firebaseUid,
        email,
        name: name || '',
        // Default role is USER as per schema mapping
      },
    });
  }

  static async findByFirebaseUid(firebaseUid: string) {
    return await prisma.user.findUnique({
      where: { firebaseUid }
    });
  }
}
