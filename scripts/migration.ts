import readline from "readline";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n📦 Drizzle Migration Generator\n");

rl.question("Do you want to generate a migration? (yes/no): ", (answer) => {
  const response = answer.trim().toLowerCase();
  
  if (response !== "yes" && response !== "y") {
    console.log("❌ Migration generation cancelled.");
    rl.close();
    process.exit(0);
  }

  rl.question("\nEnter migration name: ", (name) => {
    if (!name) {
      console.log("❌ Migration name cannot be empty.");
      rl.close();
      process.exit(1);
    }

    // Clean the name to match drizzle naming convention
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "_");
    
    rl.close();

    try {
      console.log("\n🔄 Generating migration from schema changes...");
      
      const startTime = Date.now();
      execSync(`npx drizzle-kit generate --config drizzle.config.ts --name ${cleanName}`, { stdio: "inherit" });
      const endTime = Date.now();
      
      console.log("\n⚡ Applying migration to database...");
      execSync(`npx drizzle-kit migrate --config drizzle.config.ts`, { stdio: "inherit" });
      
      // Log migration creation
      const logDir = path.join(process.cwd(), "drizzle/migrations");
      const logFile = path.join(logDir, ".migration-log.json");
      
      let logs = [];
      if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
      }
      
      logs.push({
        name: cleanName,
        timestamp: new Date().toISOString(),
        duration: `${endTime - startTime}ms`,
        user: process.env.USER || process.env.USERNAME || "unknown",
        applied: true
      });
      
      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
      
      console.log("\n✅ Migration generated and applied successfully!");
      console.log(`📝 Name: ${cleanName}`);
      console.log(`⏱️  Duration: ${endTime - startTime}ms`);
      console.log(`📁 Location: drizzle/migrations/`);
      console.log(`🗄️  Applied to database: YES`);
      
    } catch (error) {
      console.error("\n❌ Error generating migration:", error);
      process.exit(1);
    }
  });
});