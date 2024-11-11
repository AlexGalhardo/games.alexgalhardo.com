import Navbar from "../components/navbar.component";
import Head from "../components/head.component";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GamesRepository, { Game } from "../repositories/games.repository";
import GameFound from "../components/game-found.component";
import genresJson from "../repositories/jsons/genres.json";
import ReactPaginate from "react-paginate";
import { iterateFromIndex } from "../utils/functions.util";
import { SHOW_GAMES_PER_PAGE } from "../utils/constants.util";
import ProgressBar from "../components/progress-bar.component";

export default function GenrePage() {
	const { genre_name } = useParams();
	const genreName = genresJson.filter((genre) => genre.slug === genre_name)[0].name;
	const pageTitle = `${genreName} Games`;
	const pageDescription = `See games by genre ${genre_name}`;
	const navigate = useNavigate();
	const [games, setGames] = useState<Game[] | null>(null);
	const [totalGamesFound, setTogalGamesFound] = useState<number | null>(null);
	const [paginationGames, setPaginationGames] = useState<Game[]>();
	const [pageCount, setPageCount] = useState(0);
	const [pageOffset, setPageOffset] = useState(0);

	const searchGamesByGenre = useCallback(async (genreName: string) => {
		const gamesFound = new GamesRepository().getByGenre(genreName);
		if (!gamesFound.length) navigate("/");

		setTogalGamesFound(gamesFound.length);
		setGames(gamesFound);
	}, []);

	useEffect(() => {
		if (genre_name) {
			searchGamesByGenre(genre_name);
		} else {
			navigate("/");
		}
	}, [genre_name]);

	useEffect(() => {
		if (games?.length) {
			setPaginationGames(iterateFromIndex(games, 0));
			setPageCount(Math.ceil(games.length / SHOW_GAMES_PER_PAGE));
			setPageOffset(0);
		}
	}, [games]);

	const handlePageChange = (event: any) => {
		setPaginationGames(iterateFromIndex(games!, event.selected));
		setPageCount(Math.ceil((games?.length as number) / SHOW_GAMES_PER_PAGE));
		setPageOffset(event.selected);
	};

	return (
		<>
			<Head title={pageTitle} description={pageDescription} />
			<ProgressBar />
			<Navbar />
			<div className="container col-lg-8" style={{ marginTop: "100px" }}>
				<div className="row mt-5">
					{totalGamesFound && (
						<p className="fs-3 mb-5 alert alert-light d-flex justify-content-between">
							<span>
								Genre: <strong className="text-success">{genreName}</strong>
							</span>
							<span>
								Found:{" "}
								<strong className="text-danger">
									{totalGamesFound} {totalGamesFound > 1 ? "Games" : "Game"}
								</strong>{" "}
							</span>
						</p>
					)}

					{totalGamesFound && totalGamesFound > SHOW_GAMES_PER_PAGE && (
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
					)}

					{paginationGames?.map((game) => (
						<GameFound key={game.id} game={game} />
					))}

					{totalGamesFound && totalGamesFound > SHOW_GAMES_PER_PAGE && (
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
					)}
				</div>
			</div>
		</>
	);
}
