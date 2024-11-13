export function formatDateTimeToPtBr(dateString: string): string {
	const date = new Date(dateString);
	const brazilTime = new Date(date.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
	const day = brazilTime.getDate().toString().padStart(2, "0");
	const month = (brazilTime.getMonth() + 1).toString().padStart(2, "0");
	const year = brazilTime.getFullYear();
	const hours = brazilTime.getHours().toString().padStart(2, "0");
	const minutes = brazilTime.getMinutes().toString().padStart(2, "0");
	const seconds = brazilTime.getSeconds().toString().padStart(2, "0");
	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
