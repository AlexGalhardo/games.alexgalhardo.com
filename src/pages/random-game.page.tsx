import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/navbar.component";
import { useLocation } from "react-router-dom";
import ErrorAlertMessage from "../components/error-alert-message.component";
import ReactPaginate from "react-paginate";
import GamesRepository, { Game } from "../repositories/games.repository";
import Head from "../components/head.component";
import GameFound from "../components/game-found.component";
import { iterateFromIndex } from "../utils/functions.util";
import { SHOW_GAMES_PER_PAGE } from "../utils/constants.util";
import ProgressBar from "../components/progress-bar.component";

export default function RandomGamePage() {
	const [error, setError] = useState<string | null>();
	const [game, setGame] = useState<Game | null>(null);
	const [games, setGames] = useState<Game[] | null>(null);
	const [foundMoreThanOne, setFoundMoreThanOne] = useState<boolean>(false);
	const [totalGamesFound, setTogalGamesFound] = useState<number | null>(null);
	const [paginationGames, setPaginationGames] = useState<Game[]>();
	const [pageCount, setPageCount] = useState(0);
	const [pageOffset, setPageOffset] = useState(0);

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const recommendRandomGame = useCallback(async () => {
		setError("");
		const randomGame = new GamesRepository().getRandom();

		setGame({
			...randomGame,
		});
		setPageCount(0);
	}, []);

	const searchGameByTitle = useCallback(async (gameTitle: string | null) => {
		if (gameTitle) {
			const searchGameTitle = new GamesRepository().searchAllGamesSimilarTitle(gameTitle);
			const randomGame = new GamesRepository().getRandom();

			if (!searchGameTitle.length) {
				setError(`Nothing found for search "${gameTitle}". Recommending random game...`);
				setTogalGamesFound(null);
				setGames(null);
				setPageCount(0);
				setFoundMoreThanOne(false);

				setGame({
					...randomGame,
				});
			}

			if (searchGameTitle.length > 1) {
				setError("");
				setFoundMoreThanOne(true);
				setTogalGamesFound(searchGameTitle.length);
				setGames(searchGameTitle);
				setPageCount(Math.ceil((games?.length as number) / SHOW_GAMES_PER_PAGE));
			} else if (searchGameTitle.length === 1) {
				setError("");
				setGames(null);
				setFoundMoreThanOne(false);
				setPageCount(0);
				setGame({
					...searchGameTitle[0],
				});
			}
		}
	}, []);

	useEffect(() => {
		if (queryParams.get("search")) {
			const search = queryParams.get("search");
			searchGameByTitle(search);
		} else {
			recommendRandomGame();
		}
	}, [queryParams.get("search")]);

	useEffect(() => {
		if (games?.length) {
			setPaginationGames(iterateFromIndex(games, 0));
			setPageCount(Math.ceil(games?.length / SHOW_GAMES_PER_PAGE));
			setPageOffset(0);
		}
	}, [games]);

	useEffect(() => {
		if (game) {
			setGames(null);
			setFoundMoreThanOne(false);
			setPageCount(0);
			setTogalGamesFound(0);
		}
	}, [game]);

	const handlePageChange = (event: any) => {
		setPaginationGames(iterateFromIndex(games!, event.selected));
		setPageCount(Math.ceil((games?.length as number) / SHOW_GAMES_PER_PAGE));
		setPageOffset(event.selected);
	};

	return (
		<>
			<Head
				title="Games API for Developers"
				description="The best games recomendation system and api for developers & gamers on internet."
			/>
			<ProgressBar />
			<Navbar />
			<div className="container col-lg-8" style={{ marginTop: "100px" }}>
				<div className="row mt-5">
					{error && <ErrorAlertMessage message={error} />}

					{totalGamesFound !== 0 ? (
						<p className="fs-3 mb-5 alert alert-light d-flex justify-content-between">
							<span>
								Searching: <strong className="text-success">{queryParams.get("search")}</strong>
							</span>
							<span>
								Found:{" "}
								<strong className="text-danger">
									{" "}
									{totalGamesFound} {totalGamesFound! > 1 ? "Games" : "Game"}{" "}
								</strong>
							</span>
						</p>
					) : null}

					{totalGamesFound && totalGamesFound > SHOW_GAMES_PER_PAGE ? (
						<ReactPaginate
							previousLabel="Previous"
							nextLabel="Next"
							pageClassName="page-item"
							pageLinkClassName="page-link"
							previousClassName="page-item"
							previousLinkClassName="page-link"
							nextClassName="page-item"
							nextLinkClassName="page-link"
							breakLabel="..."
							breakClassName="page-item"
							breakLinkClassName="page-link"
							pageCount={pageCount}
							pageRangeDisplayed={SHOW_GAMES_PER_PAGE}
							onPageChange={handlePageChange}
							containerClassName="pagination"
							activeClassName="active"
							className="pagination justify-content-center mb-5"
							forcePage={pageOffset}
						/>
					) : null}

					{!foundMoreThanOne ? (
						<GameFound
							key={game?.id}
							game={game}
							buttonRecommend={true}
							recommendRandomGame={recommendRandomGame}
						/>
					) : null}

					{foundMoreThanOne &&
						games &&
						totalGamesFound &&
						paginationGames?.map((game: Game) => <GameFound key={game.id} game={game} />)}

					{totalGamesFound && totalGamesFound > SHOW_GAMES_PER_PAGE ? (
						<ReactPaginate
							previousLabel="Previous"
							nextLabel="Next"
							pageClassName="page-item"
							pageLinkClassName="page-link"
							previousClassName="page-item"
							previousLinkClassName="page-link"
							nextClassName="page-item"
							nextLinkClassName="page-link"
							breakLabel="..."
							breakClassName="page-item"
							breakLinkClassName="page-link"
							pageCount={pageCount}
							pageRangeDisplayed={SHOW_GAMES_PER_PAGE}
							onPageChange={handlePageChange}
							containerClassName="pagination"
							activeClassName="active"
							className="pagination justify-content-center mb-5"
							forcePage={pageOffset}
						/>
					) : null}
				</div>
			</div>
		</>
	);
}
