import { SHOW_GAMES_PER_PAGE } from "./constants.util";
import { Game } from "../repositories/games.repository";

export function iterateFromIndex(games: Game[], pageOffset: number): Game[] {
	const newOffset = (pageOffset * SHOW_GAMES_PER_PAGE) % games.length;
	const arrayFromOffeset: Game[] = [];
	for (let i = newOffset; i < Number(newOffset + SHOW_GAMES_PER_PAGE); i++) {
		if (games[i]) arrayFromOffeset.push(games[i]);
		if (!games[i]) break;
	}

	return arrayFromOffeset;
}
