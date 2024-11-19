import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constants.util";

export interface ProfileUpdateDTO {
	name?: string | null;
	phone_number?: string | null;
	new_password?: string | null;
	confirm_new_password?: string | null;
}

export interface User {
	id: string | null;
	name: string | null;
	email: string | null;
	phone_number: string | null;
	password: string | null;
	auth_token: string | null;
	api_key: string | null;
	reset_password_token: string | null;
	reset_password_token_expires_at: string | null;
	stripe: {
		customer_id: string | null;
		subscription: {
			active: boolean;
			name: string | null;
			starts_at: string | null;
			ends_at: string | null;
			charge_id: string | null;
			receipt_url: string | null;
			hosted_invoice_url: string | null;
		};
		updated_at: string | null;
	};
	created_at: string | null;
	updated_at: string | null;
}

interface GlobalStateContextPort {
	error: null | string;
	loading: boolean;
	user: User | null;
	isAlreadyLoggedIn: boolean;
	updatedProfile: boolean;
	sendRecoverPassword: boolean;
	sendResetPassword: boolean;
	apiRequestError: string | undefined;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	login: (name: string, password: string) => Promise<Element | undefined>;
	logout: () => Promise<void>;
	getUser: (token: string) => Promise<void>;
	signup: (name: string, email: string, password: string) => Promise<any>;
	updateProfile({ name, phone_number, new_password, confirm_new_password }: ProfileUpdateDTO): void;
	forgetPassword: (email: string) => Promise<any>;
	resetPassword(resetPasswordToken: string, new_password: string, confirm_new_password: string): Promise<any>;
	isValidResetPasswordToken(resetPasswordToken: string): Promise<boolean>;
}

const GlobalStateContext = createContext<GlobalStateContextPort | undefined>(undefined);

export const GlobalStateProvider = ({ children }: React.PropsWithChildren) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAlreadyLoggedIn, setAlreadyLoggedIn] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | string>(null);
	const [sendRecoverPassword, setSendRecoverPassword] = useState<boolean>(false);
	const [sendResetPassword, setSendResetPassword] = useState<boolean>(false);
	const [updatedProfile, setUpdatedProfile] = useState<boolean>(false);
	const [apiRequestError, setAPIRequestError] = useState<string | undefined>(undefined);
	const navigate = useNavigate();

	const logout = useCallback(async function () {
		setUser(null);
		setError(null);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setLoading(false);
		setAlreadyLoggedIn(false);
		window.localStorage.removeItem("auth_token");
	}, []);

	async function getUser(auth_token: string) {
		const { data } = await (
			await fetch(`${API_URL}/check-user-auth-token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${auth_token}`,
				},
			})
		).json();

		if (data) {
			const user = {
				id: data?.id,
				name: data?.name,
				email: data?.email,
				phone_number: data?.phone_number,
				password: data?.password,
				auth_token: data.auth_token,
				api_key: data?.api_key,
				reset_password_token: data?.reset_password_token,
				reset_password_token_expires_at: data?.reset_password_token_expires_at,
				stripe: {
					customer_id: data?.stripe_customer_id,
					subscription: {
						active: data?.stripe_subscription_active,
						name: data?.stripe_subscription_name,
						starts_at: data?.stripe.subscription_starts_at,
						ends_at: data?.stripe_subscription_ends_at,
						charge_id: data?.stripe_subscription_charge_id,
						receipt_url: data?.stripe_subscription_receipt_url,
						hosted_invoice_url: data?.stripe_subscription_hosted_invoice_url,
					},
					updated_at: data?.stripe_updated_at,
				},
				created_at: data?.created_at,
				updated_at: data?.updated_at,
			};
			console.log("user -> ", user);

			// setUser(user);

			// setAlreadyLoggedIn(true);
		}

		setAlreadyLoggedIn(true);
	}

	async function forgetPassword(email: string): Promise<any> {
		try {
			setError(null);
			setLoading(true);
			const response = await fetch(`${API_URL}/forget-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
				}),
			});
			if (!response.ok) {
				const { message } = await response.json();
				setError(message);
			}
		} catch (err: any) {
			setError(err.message);
			setSendRecoverPassword(true);
		} finally {
			setSendRecoverPassword(true);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setLoading(false);
		}
	}

	async function resetPassword(
		resetPasswordToken: string,
		new_password: string,
		confirm_new_password: string,
	): Promise<any> {
		try {
			setError(null);
			setLoading(true);
			const response = await fetch(`${API_URL}/reset-password/${resetPasswordToken}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					new_password,
					confirm_new_password,
				}),
			});
			if (!response.ok) {
				const { message } = await response.json();
				setError(message);
			} else {
				setSendResetPassword(true);
				setTimeout(() => {
					navigate("/");
				}, 5000);
			}
		} catch (err: any) {
			setError(err.message);
			setSendResetPassword(true);
		} finally {
			setSendResetPassword(true);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setLoading(false);
		}
	}

	async function isValidResetPasswordToken(resetPasswordToken: string): Promise<any> {
		try {
			const response = await fetch(`${API_URL}/check-reset-password-token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					resetPasswordToken,
				}),
			});
			const json = await response.json();
			if (!json.success) navigate("/");
		} catch (err: any) {
			setError(err.message);
			navigate("/");
		}
	}

	async function login(email: string, password: string): Promise<any> {
		try {
			setError(null);
			setLoading(true);
			const response = await (
				await fetch(`${API_URL}/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						password,
					}),
				})
			).json();

			if (response.success) {
				if (response.redirect) window.location.href = response.redirect;
				window.localStorage.setItem("auth_token", response.auth_token);
				await getUser(response.auth_token);
				navigate("/profile");
			}
		} catch (err: any) {
			setError("Email and/or Password Invalid");
			setAlreadyLoggedIn(false);
		} finally {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setLoading(false);
		}
	}

	async function updateProfile({ name, phone_number, new_password, confirm_new_password }: ProfileUpdateDTO) {
		try {
			setError(null);
			setLoading(true);
			const response = await fetch(`${API_URL}/profile`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${window.localStorage.getItem("auth_token")}`,
				},
				body: JSON.stringify({
					name,
					phone_number,
					new_password,
					confirm_new_password,
				}),
			});

			if (!response.ok) {
				const { message } = await response.json();
				setError(message);
				setUpdatedProfile(false);
				setAPIRequestError(message);
			} else {
				const { data } = await response.json();
				if (user) {
					setUser({
						...user,
						name: data.name,
						phone_number: data.phone_number,
						password: data.password,
					});
					setUpdatedProfile(true);
					setAPIRequestError("");
				} else {
					setUpdatedProfile(false);
				}
			}
		} catch (error: any) {
			setError(error.message);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setLoading(false);
			setUpdatedProfile(false);
		} finally {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setLoading(false);
		}
	}

	async function signup(name: string, email: string, password: string): Promise<any> {
		try {
			setError(null);
			setLoading(true);
			const response = await (
				await fetch(`${API_URL}/signup`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						email,
						password,
					}),
				})
			).json();
			if (!response.success) {
				setAPIRequestError(response.error);
			} else {
				window.localStorage.setItem("auth_token", response?.auth_token);
				await getUser(response?.auth_token);
				navigate("/profile");
			}
		} catch (err: any) {
			setError(err.message);
			setAlreadyLoggedIn(false);
		} finally {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setLoading(false);
		}
	}

	useEffect(() => {
		async function autoLogin() {
			const currentUrl = window.location.href;
			const urlSearchParams = new URLSearchParams(currentUrl.split("?")[1]);
			let auth_token = null;

			if (urlSearchParams.get("auth_token")) {
				auth_token = urlSearchParams.get("auth_token");
				window.localStorage.setItem("auth_token", auth_token as string);
			} else if (window.localStorage.getItem("auth_token")) {
				auth_token = window.localStorage.getItem("auth_token");
			}

			console.log("auth_token -> ", auth_token);

			if (auth_token) {
				try {
					setError(null);
					setLoading(true);
					await getUser(auth_token);
				} catch (err) {
					logout();
				} finally {
					await new Promise((resolve) => setTimeout(resolve, 2000));
					setLoading(false);
				}
			} else {
				setAlreadyLoggedIn(false);
			}
		}

		autoLogin();
	}, []);

	return (
		<GlobalStateContext.Provider
			value={{
				setLoading,
				login,
				logout,
				user,
				error,
				loading,
				isAlreadyLoggedIn,
				getUser,
				signup,
				sendRecoverPassword,
				forgetPassword,
				updateProfile,
				updatedProfile,
				resetPassword,
				sendResetPassword,
				isValidResetPasswordToken,
				apiRequestError,
			}}
		>
			{children}
		</GlobalStateContext.Provider>
	);
};

export const useGlobalState = (): GlobalStateContextPort => {
	const context = useContext(GlobalStateContext);
	if (!context) {
		throw new Error("useGlobalState must be used inside GlobalStateProvider");
	}
	return context;
};
