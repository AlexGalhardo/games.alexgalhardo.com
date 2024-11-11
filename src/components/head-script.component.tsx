import { useEffect } from "react";

export default function HeadScript({ url }: { url: string }) {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = url;
		document.head.appendChild(script);
	}, [url]);

	return <></>;
}
