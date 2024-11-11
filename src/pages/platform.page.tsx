import Navbar from "../components/navbar.component";
import Head from "../components/head.component";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GamesRepository, { Game } from "../repositories/games.repository";
import GameFound from "../components/game-found.component";
import platformsJson from "../repositories/jsons/platforms.json";
import { SHOW_GAMES_PER_PAGE } from "../utils/constants.util";
import ReactPaginate from "react-paginate";
import { iterateFromIndex } from "../utils/functions.util";
import ProgressBar from "../components/progress-bar.component";

export default function PlatformPage() {
	const { platform_name } = useParams();
	const platformName = platformsJson.filter((platform) => platform.slug === platform_name)[0].name;
	const pageTitle = `${platformName} Games`;
	const pageDescription = `See games by platform ${platform_name}`;
	const navigate = useNavigate();
	const [games, setGames] = useState<Game[] | null>(null);
	const [totalGamesFound, setTogalGamesFound] = useState<number | null>(null);
	const [paginationGames, setPaginationGames] = useState<Game[]>();
	const [pageCount, setPageCount] = useState(0);
	const [pageOffset, setPageOffset] = useState(0);

	const searchGamesByPlatform = useCallback(async (platformName: string) => {
		const gamesFound = new GamesRepository().getByPlatform(platformName);
		if (!gamesFound.length) navigate("/");

		setTogalGamesFound(gamesFound.length);
		setGames(gamesFound);
	}, []);

	useEffect(() => {
		if (platform_name) {
			searchGamesByPlatform(platform_name);
		} else {
			navigate("/");
		}
	}, [platform_name]);

	useEffect(() => {
		if (games?.length) {
			setPaginationGames(iterateFromIndex(games!, 0));
			setPageCount(Math.ceil(games?.length / SHOW_GAMES_PER_PAGE));
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
								Platform: <strong className="text-success">{platformName}</strong>
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
