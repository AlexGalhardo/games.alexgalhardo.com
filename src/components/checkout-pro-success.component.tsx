import { API_URL } from "../utils/constants.util";

export default function CheckoutProSuccessComponent({ sessionId }: { sessionId: string }) {
	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			const response = await fetch(`${API_URL}/stripe/create-portal-session`, {
				method: "POST",
				body: JSON.stringify({
					session_id: sessionId,
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
		<div className="card mb-4 rounded-3 shadow-sm border-primary">
			<div className="card-header py-3 text-white border-primary bg-primary">
				<h4 className="my-0 fw-bold text-white">
					<i className="bi bi-award"></i> You Are PRO now!
				</h4>
			</div>
			<div className="card-body">
				<ul className="list-unstyled mt-3 mb-4">
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

				<form onSubmit={handleSubmit}>
					<button
						className="fs-4 fw-bold w-100 btn btn-lg btn-outline-primary"
						id="checkout-and-portal-button"
						type="submit"
					>
						Manage your billing information
					</button>
				</form>
			</div>
		</div>
	);
}
