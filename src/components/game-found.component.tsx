import { CSSProperties } from "react";
import { Game } from "../repositories/games.repository";

export default function GameFound({
	game,
	buttonRecommend,
	recommendRandomGame,
}: {
	game: Game | null | undefined;
	buttonRecommend?: boolean;
	recommendRandomGame?: any;
}) {
	return (
		<>
			<div className="col-lg-3 text-center">
				<img
					id="game_image"
					src={game?.cover_image}
					className="shadow mx-auto d-block w-100 image-fluid mb-3"
					alt="game_image"
				/>
				{buttonRecommend && (
					<button
						className="button mt-3 w-100 btn mb-5 btn-success fw-bold fs-6 shadow-lg"
						onClick={recommendRandomGame}
					>
						<i className="bi bi-play-fill"></i>
						Random Game
					</button>
				)}
			</div>

			<div className="col-lg-6">
				<div className="card-body">
					<div className="d-flex justify-content-between">
						<h2>
							<span className="fw-bold text-warning">{game?.title} </span>
						</h2>
					</div>

					<hr />

					<p>{game?.summary}</p>
				</div>
			</div>

			<div className="col-lg-3 mb-3">
				<ul className="mt-3">
					{game?.igdb?.rating && (
						<li>
							<span className="fw-bold text-decoration-none">
								Rating: ⭐{" "}
								<span id="game_igdb_rating" className="fw-bold text-warning">
									{game?.igdb?.rating}
								</span>
							</span>
						</li>
					)}
					<li>
						<span className="fw-bold text-decoration-none">Release Year: {game?.release_year}</span>
					</li>
					<li className="">
						<b>Developer:</b>
						<ul>
							<li>
								<a href={`/developer/${game?.developer?.slug}`}>{game?.developer?.name}</a>
							</li>
						</ul>
					</li>
					<li className="">
						<b>Publisher:</b>
						<ul>
							<li>
								<a href={`/publisher/${game?.publisher?.slug}`}>{game?.publisher?.name}</a>
							</li>
						</ul>
					</li>
					<li className="">
						<b>Genres:</b>
						<ul>
							{game?.genres?.map((genre) => (
								<li key={genre.id}>
									<a href={`/genre/${genre?.slug}`}>{genre?.name}</a>
								</li>
							))}
						</ul>
					</li>
					<li className="">
						<b>Platforms:</b>
						<ul>
							{game?.platforms_available?.map((platform) => (
								<li key={platform.id}>
									<a href={`/platform/${platform.slug}`}>{platform.name}</a>
								</li>
							))}
						</ul>
					</li>
				</ul>
			</div>

			<span className="mt-5" />
		</>
	);
}
