import { useGlobalState } from "../context/global-state.context";
import SuccessAlertMessage from "./success-alert-message.component";
import ClipboardJS from "clipboard";
import { z } from "zod";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDateTimeToPtBr } from "../utils/format-date-time-pt-br.util";

const ProfileUpdateValidator = z
	.object({
		name: z.string().min(4, "name must have at least 4 characters").optional(),
		phone_number: z
			.string()
			.regex(/^55\d{11}$/, "Phone number must start with '55' and contain exactly 13 number digits")
			.length(13, "Phone number must be exactly 13 characters long")
			.optional(),
		new_password: z
			.string()
			.min(8, "new password must be at least 8 characters long")
			.refine((val) => /[A-Z]/.test(val), "new password must contain at least one uppercase letter")
			.refine((val) => /[a-z]/.test(val), "new password must contain at least one lowercase letter")
			.refine((val) => /[0-9]/.test(val), "new password must contain at least one number")
			.refine(
				(val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
				"new password must contain at least one special character",
			)
			.optional(),
		confirm_new_password: z
			.string()
			.min(8, "confirm new password must be at least 8 characters long")
			.refine((val) => /[A-Z]/.test(val), "confirm new password must contain at least one uppercase letter")
			.refine((val) => /[a-z]/.test(val), "confirm new password must contain at least one lowercase letter")
			.refine((val) => /[0-9]/.test(val), "confirm new password must contain at least one number")
			.refine(
				(val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
				"confirm new password must contain at least one special character",
			)
			.optional(),
	})
	.refine((data) => data.new_password === data.confirm_new_password, {
		message: "Passwords must be equal",
		path: ["confirm_new_password"],
	});

export default function ProfileUser() {
	const { user, updateProfile, loading, error, updatedProfile, setLoading } = useGlobalState();
	const [formDataError, setFormDataError] = useState<string>();

	const [formData, setFormData] = useState({
		name: user?.name,
		phone_number: user?.phone_number,
		new_password: undefined,
		confirm_new_password: undefined,
	});

	let registered = null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value ?? undefined }));
		setFormDataError("");
	};

	const notifyCopiedAPIKEY = () => {
		toast.success("API KEY COPIED!", {
			position: "bottom-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: false,
			theme: "light",
		});
	};

	async function handleSubmitUpdateProfile(event: React.FormEvent) {
		event.preventDefault();
		setLoading(true);
		const validateUpdateProfileInputs = ProfileUpdateValidator.safeParse(formData);

		if (!validateUpdateProfileInputs.success) {
			setTimeout(() => {
				setLoading(false);
				setFormDataError(validateUpdateProfileInputs.error.errors[0].message);
				toast.error(validateUpdateProfileInputs.error.errors[0].message, {
					position: "bottom-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
					theme: "light",
				});
			}, 2000);
			return;
		}

		updateProfile({
			name: formData?.name,
			phone_number: formData?.phone_number,
			new_password: formData?.new_password ?? undefined,
			confirm_new_password: formData?.confirm_new_password ?? undefined,
		});

		setLoading(false);

		if (error) {
			toast.error("Profile Update Error", {
				position: "bottom-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				theme: "light",
			});
		} else if (updatedProfile) {
			toast.success("Profile Updated!", {
				position: "bottom-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				theme: "light",
			});
		}
	}

	useEffect(() => {
		const clipboard = new ClipboardJS(".BUTTON_COPY_API_KEY");
		return () => clipboard.destroy();
	}, []);

	return (
		<>
			{registered && (
				<SuccessAlertMessage
					message={
						registered === "true" &&
						"Welcome, your password is your email! You can change your password in this page."
					}
				/>
			)}

			<ToastContainer />

			<div className="col-lg-5 mt-5">
				<form onSubmit={handleSubmitUpdateProfile}>
					<div className="form-group mb-3">
						<label htmlFor="name">Username</label>
						<input
							className="fs-5 form-control"
							type="text"
							name="name"
							value={formData.name ?? ""}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group mb-3">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							className="fs-5 form-control"
							name="email"
							defaultValue={user?.email ?? ""}
							readOnly
							disabled
						/>
					</div>

					<div className="form-group mb-3">
						<label htmlFor="phone_number">Phone Number</label>
						<input
							className="fs-5 mb-2 form-control"
							type="text"
							name="phone_number"
							value={formData.phone_number ?? ""}
							onChange={handleChange}
						/>
					</div>

					<hr />

					<div className="form-group mb-3">
						<label htmlFor="new_password">New Password</label>
						<input
							type="password"
							className="fs-5 form-control"
							name="new_password"
							onChange={handleChange}
						/>
					</div>

					<div className="form-group mb-3">
						<label htmlFor="confirm_new_password">Confirm New Password</label>
						<input
							type="password"
							className="fs-5 form-control"
							name="confirm_new_password"
							onChange={handleChange}
						/>
					</div>

					<button
						type="submit"
						className={`button fs-5 mt-3 mb-3 w-50 btn btn-outline-success ${loading ? "disabled" : ""}`}
						disabled={loading}
					>
						{loading ? "Processing..." : "Update Profile"}
					</button>
				</form>
			</div>

			<div className="container col-lg-7">
				<div className="form-group mt-5">
					<label htmlFor="apiKey">API KEY</label>
					<input
						id="apiKey"
						name="apiKey"
						className="fs-5 mb-2 form-control"
						type="text"
						defaultValue={user?.api_key ?? undefined}
						readOnly
						disabled
					/>
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
					</>
				)}

				<div className="mt-5">
					<div className="form-group mb-3">
						<label htmlFor="name">
							Currently Plan:{" "}
							<span className="fw-bold text-warning">{user?.stripe.subscription.name as string}</span>
						</label>
					</div>

					<div className="form-group mb-3">
						<label htmlFor="name">
							Subscription started at:{" "}
							<span className="fw-bold text-warning">
								{formatDateTimeToPtBr(user?.stripe.subscription.starts_at as string) ?? undefined}
							</span>
						</label>
					</div>

					<div className="form-group mb-3">
						<label htmlFor="name">
							Subscription ends at:{" "}
							<span className="fw-bold text-warning">
								{formatDateTimeToPtBr(user?.stripe?.subscription.ends_at as string) ?? undefined}
							</span>
						</label>
					</div>

					{user?.stripe?.subscription?.hosted_invoice_url && (
						<a
							className="button fs-5 mt-3 mb-3 w-25 btn btn btn-outline-primary"
							href={user?.stripe?.subscription?.hosted_invoice_url}
							target="_blank"
						>
							Invoice
						</a>
					)}

					<br></br>

					{user?.stripe?.subscription?.receipt_url && (
						<a
							className="button fs-5 mt-3 mb-3 w-50 btn btn btn-outline-danger"
							href={user?.stripe?.subscription?.receipt_url}
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
