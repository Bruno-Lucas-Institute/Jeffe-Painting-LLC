type ActionIconName =
	| "estimate"
	| "phone"
	| "gallery"
	| "message"
	| "calendar"
	| "send"
	| "arrow";

const paths: Record<ActionIconName, string> = {
	estimate:
		"M9 5H6a2 2 0 0 0-2 2v13h16V7a2 2 0 0 0-2-2h-3M9 3h6v4H9zM8 12h8M8 16h5",
	phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z",
	gallery: "M3 3h18v18H3zM3 17l6-6 4 4 3-3 5 5M16 7h.01",
	message:
		"M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z",
	calendar: "M4 5h16v16H4zM16 3v4M8 3v4M4 11h16M9 16l2 2 4-4",
	send: "M22 2 9 15M22 2l-7 20-4-9-9-4z",
	arrow: "M5 12h14M12 5l7 7-7 7",
};

export function ActionIcon({ name }: { name: ActionIconName }) {
	return (
		<svg
			aria-hidden="true"
			className="action-icon"
			focusable="false"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d={paths[name]} />
		</svg>
	);
}
