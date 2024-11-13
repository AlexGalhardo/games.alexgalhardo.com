import { Navigate } from "react-router-dom";
import { useGlobalState } from "../context/global-state.context";
import Button from "../components/button.component";
import ErrorAlertMessage from "../components/error-alert-message.component";
import { useState } from "react";
import { SignupValidator } from "../validators/signup.validator";

export default function SignupPage() {
	let { isAlreadyLoggedIn, signup, loading, apiRequestError } = useGlobalState();
	const [checkbox, setCheckbox] = useState(false);
	const [errorCheckBox, setErrorCheckBox] = useState(false);
	const [formDataError, setFormDataError] = useState<string>();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	if (isAlreadyLoggedIn) return <Navigate to="/profile" />;

	const handleCheckboxChange = () => setCheckbox(!checkbox);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setFormDataError("");
	};

	async function handleSubmit(event: any) {
		event.preventDefault();

		const validateInputs = SignupValidator.safeParse(formData);

		if (!validateInputs.success) return setFormDataError(validateInputs.error.errors[0].message);

		if (!checkbox) {
			setErrorCheckBox(true);
		} else {
			setErrorCheckBox(false);
			if (formData.name && formData.email && formData.password) {
				signup(formData.name, formData.email, formData.password);
			}
		}
	}

	return (
		<>
			<div className="container col-lg-3 mt-5">
				<h1 className="text-center text-white mb-5">
					<a className="text-decoration-none" href="/">
						<b className="fw-bold text-warning">Games</b>
					</a>
				</h1>

				<form onSubmit={handleSubmit}>
					<small>
						<span id="alert_name" className="fw-bold text-danger"></span>
					</small>

					<div className="form-group mb-3">
						<input
							className="fs-5 form-control"
							minLength={4}
							placeholder="Username"
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>

					<small>
						<span id="alert_email" className="fw-bold text-danger"></span>
					</small>

					<div className="form-group mb-3">
						<input
							className="fs-5 form-control"
							minLength={8}
							placeholder="Email"
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>

					<small>
						<span id="alert_password" className="fw-bold text-danger"></span>
					</small>

					<div className="form-group mb-3">
						<input
							className="fs-5 form-control"
							minLength={6}
							placeholder="Password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>

					{formDataError && (
						<small>
							<span className="fw-bold text-danger">{formDataError}</span>
						</small>
					)}

					<div className="mb-3 mt-4 form-check">
						<label className="form-check-label" htmlFor="checkbox_policy">
							<small className="fs-6 text-white">
								You agree with our{" "}
								<a target="_blank" href="/privacy">
									Privacy and Terms of Use Policy
								</a>{" "}
							</small>
						</label>
						<input
							type="checkbox"
							className="form-check-input"
							checked={checkbox}
							onChange={handleCheckboxChange}
						/>
						{errorCheckBox && (
							<small>
								<span className="fw-bold text-danger">
									<br />
									You need to agree with our terms to create an account
								</span>
							</small>
						)}
					</div>

					<div className="form-group">
						{loading ? <Button disabled={true}>Processing...</Button> : <Button>Create Account</Button>}

						{apiRequestError && <ErrorAlertMessage message={apiRequestError} />}
					</div>
				</form>

				<div className="text-center mt-5">
					<h5>Already have a account?</h5>
					<h5>
						<a href="/login" className="text-success text-decoration-none fs-3">
							<b>Login</b>
						</a>
					</h5>
				</div>
			</div>
		</>
	);
}
