import * as stringSimilarity from "string-similarity";

import gamesDatabase from "./jsons/games.json";

export interface PlatformAvailable {
	id: number | string;
	name: string;
	slug: string;
}

export interface Developer {
	id: number | string;
	name: string;
	slug: string;
}

export interface Publisher {
	id: number | string;
	name: string;
	slug: string;
}

export interface Genre {
	id: number | string;
	name: string;
	slug: string;
}

export interface Game {
	id: string;
	title: string;
	slug: string;
	cover_image: string;
	summary: string;
	release_year: number;
	igdb: {
		id: string | number;
		url: string | null;
		rating: number;
	};
	developer: Developer;
	publisher: Publisher;
	platforms_available: PlatformAvailable[];
	genres: Genre[];
}

export interface GamesRepositoryPort {
	getRandom(): Game;
	getById(gameId: string): Game;
	getByTitleSlug(gameTitle: string): Game;
	searchAllGamesSimilarTitle(gameTitle: string): Game[];
	getByDeveloper(developerName: string): Game[];
	getByPublisher(publisherName: string): Game[];
	getByPlatform(platformName: string): Game[];
	getByGenre(genreName: string): Game[];
}

export default class GamesRepository implements GamesRepositoryPort {
	constructor(private games: Game[] = gamesDatabase) {}

	public getById(gameId: string): Game {
		return this.games.filter((game: Game) => game.id === gameId)[0];
	}

	public getRandom(): Game {
		return this.games[Math.floor(Math.random() * this.games.length)];
	}

	public getByTitleSlug(gameTitle: string): Game {
		return this.games.filter((game: Game) => game.slug.toLowerCase().includes(gameTitle.toLowerCase()))[0];
	}

	public searchAllGamesSimilarTitle(gameTitle: string): Game[] {
		const gamesFound = this.games.filter((game: Game) =>
			game.title.toLowerCase().includes(gameTitle.toLowerCase()),
		);

		const matches = stringSimilarity.findBestMatch(
			gameTitle,
			this.games.map((game) => game.title),
		);

		matches.ratings.forEach((similarity) => {
			if (similarity.rating >= 0.5) {
				if (!gamesFound.some((game) => game.title.toLowerCase() === similarity.target.toLowerCase())) {
					gamesFound.push(this.games.filter((game) => game.title === similarity.target)[0]);
				}
			}
		});

		return gamesFound.sort((a: Game, b: Game) => b.igdb.rating - a.igdb.rating);
	}

	public getByDeveloper(developerName: string): Game[] {
		return this.games
			.filter((game: Game) => game.developer.slug.toLowerCase().includes(developerName.toLowerCase()))
			.sort((a: Game, b: Game) => b.igdb.rating - a.igdb.rating);
	}

	public getByPublisher(publisherName: string): Game[] {
		return this.games
			.filter((game: Game) => game.publisher.slug.toLowerCase().includes(publisherName.toLowerCase()))
			.sort((a: Game, b: Game) => b.igdb.rating - a.igdb.rating);
	}

	public getByPlatform(platformName: string): Game[] {
		return this.games
			.filter((game: Game) =>
				game.platforms_available.some((platform) =>
					platform.slug.toLowerCase().includes(platformName.toLowerCase()),
				),
			)
			.sort((a: Game, b: Game) => b.igdb.rating - a.igdb.rating);
	}

	public getByGenre(genreName: string): Game[] {
		return this.games
			.filter((game: Game) =>
				game.genres.some((platform) => platform.slug.toLowerCase().includes(genreName.toLowerCase())),
			)
			.sort((a: Game, b: Game) => b.igdb.rating - a.igdb.rating);
	}
}
