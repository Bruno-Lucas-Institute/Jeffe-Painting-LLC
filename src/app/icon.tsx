import { ImageResponse } from "next/og";
import { client } from "@/config/client";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
				background: client.theme.primary,
				color: client.theme.white,
				fontSize: 260,
				fontWeight: 700,
			}}
		>
			{client.logo.mark}
		</div>,
		size,
	);
}
