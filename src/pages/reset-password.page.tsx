import { Navigate, useParams } from "react-router-dom";
import { useGlobalState } from "../context/global-state.context";
import Button from "../components/button.component";
import ErrorAlertMessage from "../components/error-alert-message.component";
import { useState } from "react";
import SuccessAlertMessage from "../components/success-alert-message.component";

export default function ResetPasswordForm() {
	const { isAlreadyLoggedIn, loading, resetPassword, sendResetPassword, isValidResetPasswordToken } =
		useGlobalState();
	const [new_password, setNewPassword] = useState<string>();
	const [confirm_new_password, setConfirmNewPassword] = useState<string>();
	const [newPasswordError, setNewPasswordError] = useState<string>();
	const { reset_password_token } = useParams();

	if (!isAlreadyLoggedIn) return <Navigate to="/login" />;

	if (reset_password_token) {
		isValidResetPasswordToken(reset_password_token);
	} else {
		return <Navigate to="/" />;
	}

	async function handleSubmit(event: any) {
		event.preventDefault();

		let securePassword = null;

		if (new_password !== confirm_new_password) {
			setNewPasswordError("Passwords are not equal");
		} else if (new_password) {
			const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
			const uppercaseRegex = /[A-Z]/;
			const numberRegex = /[0-9]/;

			securePassword =
				specialCharRegex.test(new_password) &&
				uppercaseRegex.test(new_password) &&
				numberRegex.test(new_password);

			if (new_password.length < 12) {
				setNewPasswordError("Password must has at least 12 characters");
			} else if (!securePassword) {
				setNewPasswordError("Password must has at least 1 upperCase, 1 number and 1 special character");
			} else {
				setNewPasswordError(undefined);
			}
		}

		if (new_password && confirm_new_password && !newPasswordError && securePassword) {
			setNewPasswordError("");
			resetPassword(reset_password_token as string, new_password, confirm_new_password);
		}
	}

	return (
		<>
			<div className="container col-lg-3 mt-5">
				<h1 className="text-center text-white mb-4">
					<a className="text-decoration-none" href="/">
						<b className="fw-bold text-primary">Games</b>
					</a>
				</h1>

				<form onSubmit={handleSubmit}>
					<div className="form-group mb-4 mt-5">
						<label htmlFor="name" className="text-white mt-3">
							Digit your new password
						</label>
						<input
							className="fs-4 form-control"
							minLength={12}
							placeholder="Digit your new password"
							type="password"
							name="new_password"
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>

						<label htmlFor="name" className="text-white mt-3">
							Confirm your new password
						</label>
						<input
							className="fs-4 form-control"
							minLength={12}
							placeholder="Confirm your new password"
							type="password"
							name="confirm_new_password"
							onChange={(e) => setConfirmNewPassword(e.target.value)}
							required
						/>
					</div>

					{newPasswordError && <ErrorAlertMessage message={newPasswordError} />}

					{sendResetPassword && (
						<SuccessAlertMessage message={"Password changed! Redirecting to home page..."} />
					)}

					{loading ? <Button disabled={true}>Processing...</Button> : <Button>Change My Password</Button>}
				</form>
			</div>
		</>
	);
}
