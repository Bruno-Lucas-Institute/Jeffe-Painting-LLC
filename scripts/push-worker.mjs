// Run beside the Node server, or call the retry endpoint from an authenticated scheduler.
const origin =
	process.env.PUSH_RETRY_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL;
const secret = process.env.PUSH_RETRY_SECRET;
if (!origin || !secret || secret.length < 32)
	throw new Error(
		"Configure site origin and retry secret before starting the worker.",
	);
const url = new URL("/api/owner/push/retry", origin);
if (
	url.protocol !== "https:" &&
	!["localhost", "127.0.0.1"].includes(url.hostname)
)
	throw new Error("Retry worker requires HTTPS outside localhost.");
let running = true;
process.on("SIGTERM", () => {
	running = false;
});
process.on("SIGINT", () => {
	running = false;
});
console.log("Notification retry worker running.");
while (running) {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { authorization: `Bearer ${secret}` },
			signal: AbortSignal.timeout(25000),
		});
		if (!response.ok) throw new Error();
		console.log("Notification queue checked.");
	} catch {
		console.error("Notification retry failed; requests remain stored.");
		if (process.argv.includes("--once")) process.exitCode = 1;
	}
	if (process.argv.includes("--once")) break;
	for (let tick = 0; tick < 30 && running; tick++)
		await new Promise((resolve) => setTimeout(resolve, 1000));
}
