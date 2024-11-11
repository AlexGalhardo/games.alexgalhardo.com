import { useState } from "react";
import Navbar from "../components/navbar.component";
import { API_URL } from "../utils/constants.util";
import Head from "../components/head.component";
import { useGlobalState } from "../context/global-state.context";
import { useNavigate } from "react-router-dom";
import SuccessAlertMessage from "../components/success-alert-message.component";

export default function PricingPage() {
	const { login, user } = useGlobalState();
	const [alreadyMember, setAlreadyMember] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleSubmitCasual = async (e: any) => {
		e.preventDefault();

		if (login === false) {
			navigate("/login");
		}

		try {
			const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
				method: "POST",
				body: JSON.stringify({
					lookup_key: "plan_casual",
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${window.localStorage.getItem("auth_token")}`,
				},
			});

			if (response.ok) {
				const json = await response.json();

				if (json.redirect) {
					window.location.href = json.redirect;
				} else {
					setAlreadyMember(true);
				}
			} else {
				console.error("Error:", response.statusText);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleSubmitPro = async (e: any) => {
		e.preventDefault();

		if (login === false) {
			navigate("/login");
		}

		try {
			const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
				method: "POST",
				body: JSON.stringify({
					lookup_key: "plan_pro",
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${window.localStorage.getItem("auth_token")}`,
				},
			});

			if (response.ok) {
				const json = await response.json();

				if (json.redirect) {
					window.location.href = json.redirect;
				} else {
					console.error("Response does not contain a redirect URL.");
				}
			} else {
				console.error("Error:", response.statusText);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<>
			<Head title="Pricing" description="See ours plans to get access to Games!" />
			<Navbar />
			<div className="container col-lg-7" style={{ marginTop: "50px" }}>
				<div className="row">
					<div className="mt-5 text-center">
						<p className="fs-4 mb-5">
							<strong>
								We're building the best Games API with a awesome experience for software developers and
								gamers out there to consume and enjoy.
							</strong>{" "}
							<br />
							<br />
							<small className="text-white">
								You can help us by being a subscription member, sharing the site with your friends and
								acquaintances, reporting bugs, and sugesting missing or wrong video game data.
							</small>
						</p>
					</div>

					{alreadyMember && <SuccessAlertMessage message={"You already has a subscription active!"} />}

					<main>
						<div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
							<div className="col">
								<div className="card mb-4 rounded-3 shadow border-success">
									<div className="card-header py-3 bg-success">
										<h4 className="my-0 fw-bold text-white">NOOB</h4>
									</div>
									<div className="card-body">
										<h1 className="card-title pricing-card-title">
											<small>$</small>
											<big>0</big>
											<small className="text-dark fw-light">/mo</small>
										</h1>
										<ul className="list-unstyled mt-3 mb-4 fs-6">
											<li>
												<i className="bi bi-check-circle"></i> 20 API Requests/daily
											</li>
											<li>
												<s>Priority Email Support</s>
											</li>
											<li>
												<s>Access To Telegram BOT</s>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div className="col">
								<div className="card mb-4 rounded-3 shadow border-danger">
									<div className="card-header py-3 bg-danger">
										<h4 className="my-0 fw-bold text-white">
											<i className="bi bi-award"></i> CASUAL
										</h4>
									</div>
									<div className="card-body">
										<h1 className="card-title pricing-card-title">
											<small>$</small>
											<big>1.99</big>
											<small className="text-dark fw-light">/mo</small>
										</h1>
										<ul className="list-unstyled mt-3 mb-4 fs-6">
											<li>
												<i className="bi bi-check-circle"></i> 500 API Requests/daily
											</li>
											<li>
												<i className="bi bi-check-circle"></i> Priority Email Support
											</li>
											<li>
												<s>Access To Telegram BOT</s>
											</li>
										</ul>
										<form onSubmit={handleSubmitCasual}>
											{user && user.stripe.subscription.active ? (
												<button
													className="button w-100 btn btn-lg btn-outline-danger"
													id="checkout-and-portal-button"
													type="submit"
													disabled={true}
												>
													Already Member
												</button>
											) : (
												<button
													className="button w-100 btn btn-lg btn-outline-danger fw-bold fs-4 text-dark shadow"
													id="checkout-and-portal-button"
													type="submit"
												>
													Get Started
												</button>
											)}
										</form>
									</div>
								</div>
							</div>
							<div className="col">
								<div className="card mb-4 rounded-3 shadow border-primary">
									<div className="card-header py-3 text-white border-primary bg-primary">
										<h4 className="my-0 fw-bold text-white">
											<i className="bi bi-award"></i>PRO
										</h4>
									</div>
									<div className="card-body">
										<h1 className="card-title pricing-card-title">
											<small>$</small>
											<big>4.99</big>
											<small className="text-dark fw-light">/mo</small>
										</h1>
										<ul className="list-unstyled mt-3 mb-4 fs-6">
											<li>
												<i className="bi bi-check-circle"></i> 2000 API Requests/daily
											</li>
											<li>
												<i className="bi bi-check-circle"></i> Priority Email Support
											</li>
											<li>
												<i className="bi bi-check-circle"></i> Access To Telegram BOT
											</li>
										</ul>
										<form onSubmit={handleSubmitPro}>
											{user && user.stripe.subscription.active ? (
												<button
													className="button w-100 btn btn-lg btn-outline-primary"
													id="checkout-and-portal-button"
													type="submit"
													disabled={true}
												>
													Already Member
												</button>
											) : (
												<button
													className="button w-100 btn btn-lg btn-outline-primary fw-bold fs-4 text-dark shadow"
													id="checkout-and-portal-button"
													type="submit"
												>
													Get Started
												</button>
											)}
										</form>
									</div>
								</div>
							</div>
						</div>

						<h3 className="fw-bold text-center mt-5 mb-4 text-white">Frequently Asked Questions</h3>

						<div className="container col-lg-8 mb-5">
							<div className="accordion" id="accordionExample">
								<div className="accordion-item">
									<h2 className="accordion-header" id="headingOne">
										<button
											className="accordion-button fs-5 "
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#collapseOne"
											aria-expanded="true"
											aria-controls="collapseOne"
										>
											There's any discount or annual subscriptions?
										</button>
									</h2>
									<div
										id="collapseOne"
										className="accordion-collapse collapse show"
										aria-labelledby="headingOne"
										data-bs-parent="#accordionExample"
									>
										<div className="accordion-body">
											No, for now we only provide monthly plans without discounts.
										</div>
									</div>
								</div>
								<div className="accordion-item">
									<h2 className="accordion-header" id="headingTwo">
										<button
											className="accordion-button collapsed fs-5 "
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#collapseTwo"
											aria-expanded="false"
											aria-controls="collapseTwo"
										>
											The payments transactions are secure?
										</button>
									</h2>
									<div
										id="collapseTwo"
										className="accordion-collapse collapse"
										aria-labelledby="headingTwo"
										data-bs-parent="#accordionExample"
									>
										<div className="accordion-body">
											Sure. All payments transactions data are take care by Stripe, one of the
											most reliable and secure payments processor on internet.
										</div>
									</div>
								</div>
								<div className="accordion-item">
									<h2 className="accordion-header" id="headingFour">
										<button
											className="accordion-button collapsed fs-5 "
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#collapseFour"
											aria-expanded="false"
											aria-controls="collapseFour"
										>
											What payments methods I can use?
										</button>
									</h2>
									<div
										id="collapseFour"
										className="accordion-collapse collapse"
										aria-labelledby="headingFour"
										data-bs-parent="#accordionExample"
									>
										<div className="accordion-body">
											In our stripe checkout, we accept all major credit cards and other payment
											methods linked to your stripe account.
										</div>
									</div>
								</div>
								<div className="accordion-item">
									<h2 className="accordion-header" id="headingThree">
										<button
											className="accordion-button collapsed fs-5 "
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#collapseThree"
											aria-expanded="false"
											aria-controls="collapseThree"
										>
											I can upgrade, dowgrade or cancel my subscription at any time?
										</button>
									</h2>
									<div
										id="collapseThree"
										className="accordion-collapse collapse"
										aria-labelledby="headingThree"
										data-bs-parent="#accordionExample"
									>
										<div className="accordion-body">
											You can cancel your subscription at any time, by clicking on "Manage
											Subscription" in your profile page, then you'll be redirect to Stripe
											portal. To upgrade or downgrade your plan, you need first to wait until the
											currently subscription is expired.
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
}
