import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

let reconnectInterval: NodeJS.Timeout | null = null;

export const checkConnectionDATABASE = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connection to the database was successful.");
    
    // Clear reconnect interval if already connected
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);

    await prisma.$disconnect();

    // Prevent multiple intervals
    if (!reconnectInterval) {
      reconnectInterval = setInterval(async () => {
        console.log("🔁 Attempting to reconnect to the database...");
        await checkConnectionDATABASE();
      }, 10_000); // 10 seconds
    }
  }
};

export default prisma;
