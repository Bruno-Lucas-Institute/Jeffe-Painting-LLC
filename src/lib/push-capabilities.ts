export type PushEnvironment = {
	secure: boolean;
	apisAvailable: boolean;
	ios: boolean;
	installed: boolean;
	permission: NotificationPermission;
};
export type PushBlock = {
	kind: "https" | "install" | "unsupported" | "denied";
	label: string;
	message: string;
};
export function pushBlock(environment: PushEnvironment): PushBlock | null {
	if (!environment.secure)
		return {
			kind: "https",
			label: "HTTPS connection required",
			message:
				"This address uses HTTP. Phone notifications require a trusted HTTPS address. Requests remain available in the dashboard, but installing this HTTP address will not enable alerts.",
		};
	if (environment.ios && !environment.installed)
		return {
			kind: "install",
			label: "Add to Home Screen",
			message:
				"On iPhone/iPad, open in Safari, tap Share and Add to Home Screen. Open the installed icon, sign in again and enable notifications. Requires iOS/iPadOS 16.4 or later.",
		};
	if (!environment.apisAvailable)
		return {
			kind: "unsupported",
			label: "Unsupported browser",
			message:
				"This browser does not support the required notification APIs. Use an up-to-date supported browser, such as Safari on iPhone or Chrome on Android.",
		};
	if (environment.permission === "denied")
		return {
			kind: "denied",
			label: "Permission blocked",
			message:
				"Notifications are blocked in this browser. Allow notifications in the site settings, then return to this dashboard.",
		};
	return null;
}
