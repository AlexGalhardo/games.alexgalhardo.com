import { Route, Routes } from "react-router-dom";

import Navbar from "../components/navbar.component";
import NotFound from "../components/not-found.component";
import CheckoutSuccess from "../components/checkout-success.component";

export default function CheckoutPage() {
	return (
		<>
			<Navbar />

			<main className="container col-lg-8 mt-5">
				<div className="row">
					<Routes>
						<Route path="/success" element={<CheckoutSuccess />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</main>
		</>
	);
}
