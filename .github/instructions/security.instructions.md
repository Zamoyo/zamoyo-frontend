---
description: "Use when: modifying or creating code with security implications (auth, data fetching, input handling, etc.)."
applyTo: ["**/*.ts", "**/*.tsx", "src/api/**", "src/app/auth/**"]
---
# Security Best Practices

Ensure all code follows these professional security standards:

## 1. Input Validation & Sanitization
- Never trust user input. Use libraries like `zod` for schema validation.
- Sanitize input before rendering (Next.js does this by default for JSX, but be careful with `dangerouslySetInnerHTML`).

## 2. Authentication & Authorization
- Use secure, server-side session management.
- Always check permissions on the server (Server Components or Middleware) even if they are checked on the client.

## 3. Data Protection
- Avoid logging sensitive information (PII, tokens, passwords).
- Use HTTPS for all API calls.
- Store sensitive environment variables in `.env.local` and ensure they are not committed.

## 4. Error Handling
- Do not expose detailed stack traces or internal system information in production error messages.
- Use generic error messages for the client while logging details internally.

## 5. Dependency Security
- Periodically check for vulnerable dependencies (`npm audit`).
- Avoid using `eval()` or `new Function()`.

## 6. CSRF & XSS Protection
- Use CSRF tokens if not using built-in Next.js/React protection.
- Ensure `Content-Security-Policy` headers are correctly configured where possible.
