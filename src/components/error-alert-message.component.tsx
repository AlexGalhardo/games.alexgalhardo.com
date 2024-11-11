interface AlertError {
	message: string | null | boolean | undefined;
}

export default function ErrorAlertMessage({ message }: AlertError) {
	if (!message) return null;
	return (
		<p className="fw-bold fs-3 text-center alert alert-danger mb-5" role="alert">
			{message}
		</p>
	);
}
