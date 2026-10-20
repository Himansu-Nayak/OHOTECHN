# OHO TECH welcome email rollout

## What this change does

- Reuses the existing Spring Boot `EmailTemplateService` and `EmailService` (`JavaMailSender` / SMTP); no new email SDK or database migration is required.
- Restyles the existing welcome email with dark navy and purple branding, mobile viewport support, and a responsive small-screen layout.
- Builds product and homepage links from the existing `app.frontend.url` property, defaulting to `https://ohotechn.com`.
- Escapes the display name in the welcome email to prevent user-supplied HTML from being rendered.
- Sends a plain-text alternative alongside the HTML message.
- Reuses the existing registration and Firebase first-account welcome triggers in `AuthService`.

## Configuration to inspect before production

The repository can define the configuration, but it cannot verify the secrets configured in the deployed environment. Confirm these values in the VPS/container environment or deployment secret store:

- `SPRING_MAIL_HOST=smtp.resend.com`
- `SPRING_MAIL_PORT=587`
- `SPRING_MAIL_USERNAME=resend`
- `SPRING_MAIL_PASSWORD=<Resend SMTP API key>`
- `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true`
- `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true`
- `SPRING_MAIL_PROPERTIES_MAIL_SMTP_SSL_ENABLE=false`
- `SPRING_MAIL_FROM_ADDRESS=<sender address on a domain verified in Resend>`
- `MAIL_FROM_NAME=OHO TECH`
- `FRONTEND_URL=https://ohotechn.com`

Do not commit the SMTP API key or other secrets. The configured From address must be authorized for the Resend account/domain; the development fallback `onboarding@resend.dev` should not be treated as the production sender.

## Rollout and verification

1. Run the backend test suite: `cd backend && ./mvnw test` (Windows: `mvnw.cmd test`; use installed Maven if the wrapper is absent).
2. Deploy to staging with the environment values above and confirm the service starts with SMTP enabled.
3. Register a test customer with an inbox you control. Confirm the welcome email arrives once, the name is correct, and the primary CTA opens `https://ohotechn.com/products`.
4. Inspect on Gmail mobile and desktop. Confirm both HTML and plain-text parts exist.
5. Check backend logs and Resend delivery/event logs for delivery, bounce, or rejection.
6. Verify email OTP and password-reset flows still work, since they share the existing email service.
7. Confirm production domain authentication (SPF/DKIM; publish a DMARC policy appropriate to the domain) and test the exact From address.

## Operational notes

- Welcome email dispatch is already invoked during password-based registration and when Firebase creates a new user. This change deliberately reuses those triggers rather than adding a second registration event that could send duplicates.
- The current email sender is asynchronous and logs delivery failures without failing registration. Monitor delivery logs during rollout.
- The existing `REQUIRE_EMAIL_VERIFICATION` setting controls whether email verification is required; this change does not alter that security behavior.
