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
		setLoading(false);
		setAlreadyLoggedIn(false);
		window.localStorage.removeItem("auth_token");
	}, []);

	async function getUser(token: string) {
		setAlreadyLoggedIn(true);

		const { data } = await (
			await fetch(`${API_URL}/check-user-jwt-token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
		).json();

		setUser({
			id: data.id,
			name: data.name,
			email: data.email,
			phone_number: data.phone_number,
			password: data.password,
			auth_token: data.auth_token,
			api_key: data.api_key,
			reset_password_token: data.reset_password_token,
			reset_password_token_expires_at: data.reset_password_token_expires_at,
			stripe: {
				customer_id: data.stripe.customer_id,
				subscription: {
					active: data.stripe.subscription.active,
					name: data.stripe.subscription.name,
					starts_at: data.stripe.subscription.starts_at,
					ends_at: data.stripe.subscription.ends_at,
					charge_id: data.stripe.subscription.charge_id,
					receipt_url: data.stripe.subscription.receipt_url,
					hosted_invoice_url: data.stripe.subscription.hosted_invoice_url,
				},
				updated_at: data.stripe.updated_at,
			},
			created_at: data.created_at,
			updated_at: data.updated_at,
		});
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
			const response = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			if (!response.ok) {
				const { message } = await response.json();
				setAPIRequestError(message);
				setError("Email and/or Password Invalid");
			} else {
				const json = await response.json();
				if (json.redirect) window.location.href = json.redirect;
				window.localStorage.setItem("auth_token", json.auth_token);
				await getUser(json.auth_token);
				navigate("/profile");
			}
		} catch (err: any) {
			setError(err.message);
			setAlreadyLoggedIn(false);
		} finally {
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
				}
			}
		} catch (error: any) {
			setError(error.message);
			setLoading(false);
			setUpdatedProfile(false);
		} finally {
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
			setLoading(false);
		}
	}

	useEffect(() => {
		async function autoLogin() {
			const currentUrl = window.location.href;
			const urlSearchParams = new URLSearchParams(currentUrl.split("?")[1]);
			let token = null;
			if (urlSearchParams.get("auth_token")) {
				token = urlSearchParams.get("auth_token");
				window.localStorage.setItem("auth_token", token as string);
			} else if (window.localStorage.getItem("auth_token")) token = window.localStorage.getItem("auth_token");
			if (token) {
				try {
					setError(null);
					setLoading(true);
					await getUser(token);
				} catch (err) {
					logout();
				} finally {
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
