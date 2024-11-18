import { z } from "zod";

export const ProfileUpdateValidator = z
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
