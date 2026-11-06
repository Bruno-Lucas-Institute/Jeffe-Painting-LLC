import defaultCopy from "@/config/owner-defaults.json";
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
export function pushBlock(
	environment: PushEnvironment,
	copy: Record<string, string> = defaultCopy,
): PushBlock | null {
	if (!environment.secure)
		return {
			kind: "https",
			label: copy.httpsLabel,
			message: copy.httpsMessage,
		};
	if (environment.ios && !environment.installed)
		return {
			kind: "install",
			label: copy.installLabel,
			message: copy.installMessage,
		};
	if (!environment.apisAvailable)
		return {
			kind: "unsupported",
			label: copy.unsupportedLabel,
			message: copy.unsupportedMessage,
		};
	if (environment.permission === "denied")
		return {
			kind: "denied",
			label: copy.deniedLabel,
			message: copy.deniedMessage,
		};
	return null;
}
