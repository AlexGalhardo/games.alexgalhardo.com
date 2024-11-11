import Navbar from "../components/navbar.component";
import Head from "../components/head.component";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GamesRepository, { Game } from "../repositories/games.repository";
import GameFound from "../components/game-found.component";
import publishersJson from "../repositories/jsons/publishers.json";
import ReactPaginate from "react-paginate";
import { SHOW_GAMES_PER_PAGE } from "../utils/constants.util";
import { iterateFromIndex } from "../utils/functions.util";
import ProgressBar from "../components/progress-bar.component";

export default function PublisherPage() {
	const { publisher_name } = useParams();
	const publisherName = publishersJson.filter((publisher) => publisher.slug === publisher_name)[0].name;
	const pageTitle = `${publisherName} Games`;
	const pageDescription = `See games made by publisher ${publisher_name}`;
	const navigate = useNavigate();
	const [games, setGames] = useState<Game[] | null>(null);
	const [totalGamesFound, setTogalGamesFound] = useState<number | null>(null);
	const [paginationGames, setPaginationGames] = useState<Game[]>();
	const [pageCount, setPageCount] = useState(0);
	const [pageOffset, setPageOffset] = useState(0);

	const searchPublisherGames = useCallback(async (publisherName: string) => {
		const gamesFound = new GamesRepository().getByPublisher(publisherName);
		console.log("gamesFound", gamesFound);
		if (!gamesFound.length) navigate("/");

		setTogalGamesFound(gamesFound.length);
		setGames(gamesFound);
	}, []);

	useEffect(() => {
		if (publisher_name) {
			searchPublisherGames(publisher_name);
		} else {
			navigate("/");
		}
	}, [publisher_name]);

	useEffect(() => {
		if (games?.length) {
			setPaginationGames(iterateFromIndex(games!, 0));
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
								Publisher: <strong className="text-success">{publisherName}</strong>
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
