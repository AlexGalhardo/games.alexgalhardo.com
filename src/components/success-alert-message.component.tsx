interface AlertSuccess {
	message: string | null | undefined | boolean;
}

export default function SuccessAlertMessage({ message }: AlertSuccess) {
	if (!message) return null;
	return (
		<p className="fw-bold fs-2 text-start alert alert-success mb-5" role="alert">
			{message}
		</p>
	);
}
