import { Navigate } from "react-router-dom";
import { useGlobalState } from "../context/global-state.context";
import Button from "../components/button.component";
import SuccessAlertMessage from "../components/success-alert-message.component";
import { useState } from "react";

export default function ForgetPasswordPage() {
	const { forgetPassword, sendRecoverPassword, loading, isAlreadyLoggedIn } = useGlobalState();
	const [email, setEmail] = useState<string>();
	const [errorEmail, setErrorEmail] = useState<string>();

	if (!isAlreadyLoggedIn) return <Navigate to="/login" />;

	function isValidEmail(email: string): boolean {
		const regex = /\S+@\S+\.\S+/;
		return regex.test(email);
	}

	async function handleSubmit(event: any) {
		event.preventDefault();

		if (email && !isValidEmail(email)) {
			setErrorEmail("Invalid Email");
		} else if (email && isValidEmail(email)) {
			setErrorEmail("");
			await forgetPassword(email);
			setEmail("");
		}
	}

	return (
		<>
			<div className="container col-lg-3 mt-5">
				<h1 className="text-center text-white mb-4">
					<a className="text-decoration-none" href="/">
						<b className="fw-bold text-primary text-warning">Games</b>
					</a>
				</h1>

				<form onSubmit={handleSubmit}>
					<div className="form-group mb-4 mt-5">
						<input
							className="fs-5 form-control"
							placeholder="Email to recover password"
							minLength={8}
							value={email}
							type="email"
							name="email"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						{errorEmail && (
							<small>
								<span className="fw-bold text-danger">Email invalid</span>
							</small>
						)}
					</div>

					{loading ? <Button disabled={true}>Processing...</Button> : <Button>Send link</Button>}

					<SuccessAlertMessage
						message={
							sendRecoverPassword &&
							"If this email exists, a email was send with a link to recover password!"
						}
					/>
				</form>
			</div>
		</>
	);
}
