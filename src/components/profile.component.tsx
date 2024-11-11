import { useGlobalState } from "../context/global-state.context";
import SuccessAlertMessage from "./success-alert-message.component";
import ClipboardJS from "clipboard";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorAlertMessage from "./error-alert-message.component";

export default function ProfileUser() {
	const { user, updateProfile, loading, error, updatedProfile } = useGlobalState();
	const [errorUsername, setErrorUsername] = useState<string | boolean>(false);
	const [errorNewPassword, setErrorNewPassword] = useState<string | boolean>(false);
	const [errorTelegramNumber, setErrorTelegramNumber] = useState<string | boolean>(false);
	let registred = null;

	const [name, setUsername] = useState<string>(user?.name as string);
	const [phone_number, setTelegramNumber] = useState<string>(user?.phone_number as string);
	const [new_password, setNewPassword] = useState<string>();
	const [confirm_new_password, setConfirmNewPassword] = useState<string>();

	const notifyCopiedAPIKEY = () => {
		toast.success("API KEY COPIED!", {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: false,
			theme: "dark",
		});
	};

	function checkUsername(fullName: string) {
		function isValidSingleName(name: string): boolean {
			if (!name || name.length <= 3) {
				setErrorUsername("Username must has at least 4 characters");
				return false;
			} else if (name.length > 16) {
				setErrorUsername("Username must has max 16 characters");
				return false;
			}

			const regexOfValidNamesWithAcents = /^[a-zA-ZÀ-ú]+$/g;
			return regexOfValidNamesWithAcents.test(name);
		}

		const names = fullName.split(" ");
		if (names.length > 1) {
			for (const name of names) {
				if (!isValidSingleName(name)) return false;
			}
		} else if (names.length <= 1) {
			if (!isValidSingleName(fullName)) return false;
		}

		return true;
	}

	function checkTelegramNumber(phone_number: string) {
		const BRAZIL_VALID_PHONE_DDD = [
			11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46,
			47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85,
			86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
		];

		phone_number = phone_number?.replace(/\D/g, "");

		if (phone_number && phone_number?.length !== 13) {
			setErrorTelegramNumber("TelegramNumber must has 13 numbers");
		} else if (phone_number && parseInt(phone_number.substring(4, 5)) !== 9) {
			setErrorTelegramNumber("TelegramNumber must be in Brazil Phone Number Format like 5518999999999");
		} else if (phone_number && new Set(phone_number).size === 1) {
			setErrorTelegramNumber("TelegramNumber must be in Brazil Phone Number Format like 5518999999999");
		} else if (phone_number && BRAZIL_VALID_PHONE_DDD.indexOf(parseInt(phone_number.substring(2, 4))) == -1) {
			setErrorTelegramNumber("TelegramNumber must be in Brazil Phone Number Format like 5518999999999");
		}

		setErrorTelegramNumber("");
	}

	function checkNewPassword(new_password: string) {
		const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
		const uppercaseRegex = /[A-Z]/;
		const numberRegex = /[0-9]/;

		const securePassword =
			specialCharRegex.test(new_password) && uppercaseRegex.test(new_password) && numberRegex.test(new_password);

		if (new_password.length < 12) {
			setErrorNewPassword("New Password must has at least 12 characters");
		} else if (new_password && confirm_new_password && new_password !== confirm_new_password) {
			setErrorNewPassword("Passwords not equal");
		} else if (!securePassword) {
			setErrorNewPassword("New Password must has at least 1 upperCase, 1 number and 1 special character");
		} else {
			setErrorNewPassword("");
		}
	}

	async function handleSubmitUpdateProfile(event: any) {
		event.preventDefault();

		if (phone_number) checkTelegramNumber(phone_number);
		if (new_password) checkNewPassword(new_password);

		if (name && checkUsername(name) && !errorTelegramNumber && !errorNewPassword) {
			setErrorUsername("");
			updateProfile({
				name: name ?? undefined,
				phone_number: phone_number ?? undefined,
				new_password: new_password ?? undefined,
				confirm_new_password: confirm_new_password ?? undefined,
			});
		}
	}

	useEffect(() => {
		const clipboard = new ClipboardJS(".BUTTON_COPY_API_KEY");
		return () => {
			clipboard.destroy();
		};
	}, []);

	return (
		<>
			{registred && (
				<SuccessAlertMessage
					message={
						registred === "true" &&
						"Welcome, your password is your email! You can change your password in this page."
					}
				/>
			)}

			<div className="col-lg-5 mt-5">
				<form onSubmit={handleSubmitUpdateProfile}>
					<small>
						<span id="alert_name" className="fw-bold text-danger"></span>
					</small>

					<div className="form-group mb-3">
						<label htmlFor="name">Username</label>
						<input
							type="text"
							min={4}
							max={16}
							className="fs-4 form-control"
							defaultValue={user?.name as string}
							name="name"
							onChange={(e) => setUsername(e.target.value)}
						/>
						{errorUsername && (
							<small>
								<span className="fw-bold text-danger">{errorUsername}</span>
							</small>
						)}
					</div>

					<div className="form-group mb-3">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							className="fs-4 form-control"
							name="email"
							defaultValue={user?.email as string}
							readOnly
							disabled
						/>
					</div>

					<div className="form-group mb-3">
						<label htmlFor="phone_number">Telegram Number</label>
						<input
							className="fs-4 mb-2 form-control"
							type="text"
							name="phone_number"
							pattern="^55[0-9]{11}$"
							minLength={13}
							maxLength={13}
							defaultValue={user?.phone_number as string}
							onChange={(e) => setTelegramNumber(e.target.value)}
						/>
						{errorTelegramNumber && (
							<small>
								<span className="fw-bold text-danger">{errorTelegramNumber}</span>
							</small>
						)}
					</div>

					<hr />

					<div className="form-group mb-3">
						<label htmlFor="new_password">New Password</label>
						<input
							type="password"
							className="fs-4 form-control"
							name="new_password"
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>

					<div className="form-group mb-3">
						<label htmlFor="confirm_new_password">Confirm New Password</label>
						<input
							type="password"
							className="fs-4 form-control"
							name="confirm_new_password"
							onChange={(e) => setConfirmNewPassword(e.target.value)}
						/>
					</div>
					{errorNewPassword && (
						<small>
							<span className="fw-bold text-danger">{errorNewPassword}</span>
						</small>
					)}

					{loading ? (
						<button
							type="submit"
							className="button fs-4 mt-3 mb-3 w-50 btn btn btn-outline-success"
							disabled={true}
						>
							Processing...
						</button>
					) : (
						<button
							type="submit"
							className="button fs-4 mt-3 mb-3 w-50 btn btn btn-outline-success"
							disabled={false}
						>
							Update Profile
						</button>
					)}

					<ErrorAlertMessage message={error && !updatedProfile && `${error}`} />

					<SuccessAlertMessage message={!error && updatedProfile && `Profile Updated!`} />
				</form>
			</div>

			<div className="container col-lg-7">
				<div className="form-group mt-5">
					<label htmlFor="apiKey">API KEY</label>
					<input
						id="apiKey"
						name="apiKey"
						className="fs-4 mb-2 form-control"
						type="text"
						defaultValue={user?.api_key ?? undefined}
						readOnly
						disabled
					/>
					{!user?.api_key && (
						<small>
							<a href="/pricing">You need to have a subscription active to have access to a API KEY.</a>
						</small>
					)}
				</div>

				{user?.api_key && (
					<>
						<button
							onClick={notifyCopiedAPIKEY}
							className="fw-bold btn btn-outline-success border-whitebutton BUTTON_COPY_API_KEY"
							data-clipboard-text={user?.api_key}
						>
							COPY API KEY
						</button>
						<ToastContainer />
					</>
				)}

				<div className="mt-5">
					<div className="form-group mb-3">
						<label htmlFor="name">Currently Plan</label>
						<input
							className="fs-4 mb-2 form-control"
							type="text"
							defaultValue={user?.stripe.subscription.name as string}
							readOnly
							disabled
						/>
					</div>

					{user?.stripe.subscription.hosted_invoice_url && (
						<a
							className="button fs-4 mt-3 mb-3 w-25 btn btn btn-outline-primary"
							href={user?.stripe.subscription.hosted_invoice_url}
							target="_blank"
						>
							Invoice
						</a>
					)}

					<hr></hr>

					<div className="form-group mb-3">
						<label htmlFor="name">Subscription started at</label>
						<input
							className="fs-4 mb-2 form-control"
							name="SUBSCRIPTION_START_DATE_TIME"
							type="text"
							defaultValue={user?.stripe.subscription.starts_at ?? undefined}
							readOnly
							disabled
						/>
					</div>

					<div className="form-group mb-3">
						<label htmlFor="name">Subscription ends at</label>
						<input
							className="fs-4 mb-2 form-control"
							name="SUBSCRIPTION_END_DATE_TIME"
							type="text"
							defaultValue={user?.stripe.subscription.ends_at ?? undefined}
							readOnly
							disabled
						/>
					</div>

					{user?.stripe.subscription.receipt_url && (
						<a
							className="button fs-4 mt-3 mb-3 w-50 btn btn btn-outline-danger"
							href={user?.stripe.subscription.receipt_url}
							target="_blank"
						>
							Manage Subscription
						</a>
					)}
				</div>
			</div>
		</>
	);
}
