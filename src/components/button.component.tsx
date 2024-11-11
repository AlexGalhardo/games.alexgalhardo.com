interface FormButton {
	children: React.ReactNode;
	disabled?: boolean;
}

export default function ButtonComponent({ children, ...props }: FormButton) {
	return (
		<button
			disabled={props?.disabled}
			{...props}
			className="fs-10 button mb-3 w-100 btn btn-success btn-lg btn-block login-btn fw-bold me-3"
		>
			{children}
		</button>
	);
}
