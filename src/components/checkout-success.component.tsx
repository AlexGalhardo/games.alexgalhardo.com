import { Navigate, useLocation } from "react-router-dom";
import { useGlobalState } from "../context/global-state.context";
import CheckoutCasualSuccessComponent from "./checkout-casual-success.component";
import CheckoutProSuccessComponent from "./checkout-pro-success.component";

export default function CheckoutSuccessComponent() {
	const { isAlreadyLoggedIn } = useGlobalState();

	setTimeout(() => {
		if (!isAlreadyLoggedIn) return <Navigate to="/login" />;
	}, 1000);

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const session_id = queryParams.get("session_id");
	const planName = queryParams.get("plan");

	if (session_id && planName) {
		return (
			<>
				<div className="col-lg-3 mt-5 sm-8 text-center"></div>
				<div className="col-lg-6 mt-5 sm-8 text-center">
					{planName === "casual" ? (
						<CheckoutCasualSuccessComponent sessionId={session_id} />
					) : (
						<CheckoutProSuccessComponent sessionId={session_id} />
					)}
					<br />
				</div>
				<div className="col-lg-3 mt-5 sm-8 text-center"></div>
			</>
		);
	}

	return <Navigate to="/" />;
}
