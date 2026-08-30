import os from "node:os";
import { spawn } from "node:child_process";

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    const lowerName = name.toLowerCase();

    // Ігноруємо віртуальні адаптери WSL, Hyper-V, VirtualBox, Docker тощо
    if (
      lowerName.includes("veth") ||
      lowerName.includes("virtual") ||
      lowerName.includes("wsl") ||
      lowerName.includes("hyper-v") ||
      lowerName.includes("docker") ||
      lowerName.includes("vethernet") ||
      lowerName.includes("loopback") ||
      lowerName.includes("bluetooth")
    ) {
      continue;
    }

    for (const addr of addrs) {
      if (addr.family === "IPv4" && !addr.internal) {
        // Пріоритет: Wi-Fi -> Ethernet -> інші
        const isWifi =
          lowerName.includes("wi-fi") ||
          lowerName.includes("wireless") ||
          lowerName.includes("wlan") ||
          lowerName.includes("беспроводная");
        const isEthernet =
          lowerName.includes("ethernet") ||
          lowerName.includes("eth") ||
          lowerName.includes("сетевое");

        candidates.push({
          ip: addr.address,
          name,
          priority: isWifi ? 1 : isEthernet ? 2 : 3,
        });
      }
    }
  }

  candidates.sort((a, b) => a.priority - b.priority);
  return candidates[0] || null;
}

const port = process.env.PORT || "3000";
const bestAdapter = getLocalIp();

console.log("\n=======================================================");
console.log("🚀 Next.js Dev Server (LAN Mobile Access)");
console.log("=======================================================");
console.log(`💻 Local:      http://localhost:${port}`);
if (bestAdapter) {
  console.log(`📱 Mobile LAN: http://${bestAdapter.ip}:${port} (${bestAdapter.name})`);
} else {
  console.log(`📱 Mobile LAN: http://0.0.0.0:${port}`);
}
console.log("=======================================================\n");

// Запускаємо Next.js на 0.0.0.0, щоб він слухав усі зовнішні підключення з Wi-Fi
const args = ["dev", "-H", "0.0.0.0", "--turbo", ...process.argv.slice(2)];

const command = process.platform === "win32" ? "cmd.exe" : "npx";
const spawnArgs = process.platform === "win32" ? ["/c", "npx", "next", ...args] : ["next", ...args];

const child = spawn(command, spawnArgs, {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
