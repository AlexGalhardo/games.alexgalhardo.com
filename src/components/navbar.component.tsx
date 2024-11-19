import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalState } from "../context/global-state.context";
import { useState } from "react";

export default function NavbarComponent() {
	const { user, logout } = useGlobalState();
	const navigate = useNavigate();
	const [search, setSearch] = useState<string | undefined>();
	const location = useLocation();

	function handleLogout() {
		logout();
		navigate("/login");
	}

	function handleSearch(event: any) {
		event.preventDefault();

		navigate(`/?search=${search}`);
	}

	return (
		<>
			<div className="fixed-top mb-5" style={{ backgroundColor: "#05050B" }}>
				<nav className="container col-lg-8 navbar navbar-expand-lg fixed p-3">
					<div className="container-fluid">
						<a className="navbar-brand appTitle" href="/">
							<span className="fs-4 fw-bold text-white">Games</span>
						</a>

						<form className="d-flex w-50" onSubmit={handleSearch}>
							<div className="input-group">
								<input
									autoFocus
									type="text"
									name="search"
									className="fs-6 form-control"
									placeholder="Search Game Title..."
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
						</form>

						<button
							className="navbar-toggler bg-white"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>

						<div className="collapse navbar-collapse pull-right" id="navbarSupportedContent">
							<ul className="navbar-nav me-auto mb-2 mb-lg-0">
								<li className="nav-item">
									<a
										className={`fs-5 nav-link ${
											location.pathname === "/pricing" ? "text-warning fw-bold" : "text-white"
										}`}
										aria-current="page"
										href="/pricing"
									>
										Pricing
									</a>
								</li>

								<li className="nav-item">
									<a
										className="fs-5 nav-link text-white"
										aria-current="page"
										href="https://docs.games.alexgalhardo.com"
										target="_blank"
									>
										API
									</a>
								</li>
							</ul>

							{user ? (
								<ul className="navbar-nav me-auto mb-2 mb-lg-0 right">
									<li className="nav-item dropdown">
										<a
											className="fs-5 fw-bold nav-link dropdown-toggle text-white"
											href="#"
											id="navbarDropdown"
											role="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											{user.name ?? "Alex Galhardo"}
										</a>
										<ul className="dropdown-menu" aria-labelledby="navbarDropdown">
											<li>
												<a className="fs-5 fw-bold dropdown-item" href="/profile">
													<i className="bi bi-person-circle"></i> Profile
												</a>
											</li>
											<li>
												<hr className="dropdown-divider" />
											</li>
											<li>
												<a className="fs-5 fw-bold dropdown-item" onClick={handleLogout}>
													<i className="bi bi-x-lg"></i> Logout
												</a>
											</li>
										</ul>
									</li>
								</ul>
							) : (
								<div className="pull-right">
									<a
										href="/login"
										className="button fw-bold fs-6 btn btn-success shadow"
										type="submit"
									>
										<i className="bi bi-person-fill-lock"></i> Login
									</a>
								</div>
							)}
						</div>
					</div>
				</nav>
			</div>
		</>
	);
}
