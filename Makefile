.PHONY: dev check

# Start the app for local development
dev:
	npm run dev

# Run all code quality checks (formatting, linting, typecheck, tests)
check:
	npm run check
	npm run typecheck
	npm test -- --run
	npm run test:production
	npx playwright test
