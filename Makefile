.PHONY: dev dev-down test logs

dev:
	@test -f backend/.env || cp backend/.env.example backend/.env
	docker compose up --build -d

dev-down:
	docker compose down

test:
	docker compose run --rm api npm run test

logs:
	docker compose logs -f api
