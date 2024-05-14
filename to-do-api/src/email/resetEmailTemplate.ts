/**
 * This file contains an email template to be used when sending a
 * password reset email.
 */
const resetEmailTemplate = (id: string, token: string) => {
    return `
        <html>
            <h1>We received a request to reset your password</h1>
            </br>
            <div>
                Please use the following link to complete the reset process:
            </div>
            <div>
                <a href="http://localhost:3000/account/${id}/pw-reset/${token}" target="_blank">
                    Reset Password
                </a>
            </div>
            <div>
                If you did not request this you can safely ignore this 
                message. This link will expire in 15 minutes.
            </div>

        </html>
    `
}

export default resetEmailTemplate;