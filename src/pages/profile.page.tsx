import Navbar from "../components/navbar.component";
import { Navigate, Route, Routes } from "react-router-dom";
import { useGlobalState } from "../context/global-state.context";
import ProfileUser from "../components/profile.component";
import Head from "../components/head.component";
import HeadScript from "../components/head-script.component";
import NotFound from "../components/not-found.component";

export default function ProfilePage() {
	const { isAlreadyLoggedIn } = useGlobalState();

	if (!isAlreadyLoggedIn) return <Navigate to="/login" />;

	return (
		<>
			<Head title="Profile" description="My Profile" />
			<HeadScript url="https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js" />
			<Navbar />

			<main className="container col-lg-8 mt-5 mb-5">
				<div className="row">
					<Routes>
						<Route path="/" element={<ProfileUser />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</div>
			</main>
		</>
	);
}
