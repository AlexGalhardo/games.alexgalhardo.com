import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalStateProvider } from "./context/global-state.context";
import PricingPage from "./pages/pricing.page";
import CheckoutPage from "./pages/checkout.page";
import NotFoundComponent from "./components/not-found.component";
import ProfilePage from "./pages/profile.page";
import TermsPage from "./pages/terms.page";
import LoginPage from "./pages/login.page";
import ForgetPasswordPage from "./pages/forget-password.page";
import ResetPasswordPage from "./pages/reset-password.page";
import DeveloperPage from "./pages/developer.page";
import PublisherPage from "./pages/publisher.page";
import GenrePage from "./pages/genre.page";
import PlatformPage from "./pages/platform.page";
import RandomGamePage from "./pages/random-game.page";
import GamePage from "./pages/game.page";
import SignupPage from "./pages/signup.page";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";

export default function App() {
	return (
		<BrowserRouter>
			<GlobalStateProvider>
				<Routes>
					<Route path="/" element={<RandomGamePage />} />
					<Route path="/games/*" element={<RandomGamePage />} />
					<Route path="/developer/:developer_name" element={<DeveloperPage />} />
					<Route path="/publisher/:publisher_name" element={<PublisherPage />} />
					<Route path="/genre/:genre_name" element={<GenrePage />} />
					<Route path="/platform/:platform_name" element={<PlatformPage />} />
					<Route path="/game/:game_title_slug" element={<GamePage />} />
					<Route path="/pricing" element={<PricingPage />} />
					<Route path="/checkout/*" element={<CheckoutPage />} />
					<Route path="/profile/*" element={<ProfilePage />} />
					<Route path="/terms/*" element={<TermsPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/forget-password" element={<ForgetPasswordPage />} />
					<Route path="/reset-password/:reset_password_token" element={<ResetPasswordPage />} />
					<Route path="*" element={<NotFoundComponent />} />
				</Routes>
			</GlobalStateProvider>
		</BrowserRouter>
	);
}
