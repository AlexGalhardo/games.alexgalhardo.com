<h1 align="center"><a href="https://games.alexgalhardo.com" target="_blank">games.alexgalhardo.com v2</a></h1>


## Introduction

- Legacy v1: <https://github.com/AlexGalhardo/legacy-games.alexgalhardo.com>
- A personal project I created to learn and improve my skills in:
   - [ReactJS](https://react.dev/) with Typescript
   - Single Page Applicaiton (SPA)
   - Stateless Authentication & Authorization using [JWT](https://jwt.io/)
   - localStorage
   - Webhooks
   - Product development (UI/UX, SEO, etc)
   - SaaS (Software as a Service) FrontEnd Development

## Tools & Features

- [Vite v5](https://vitejs.dev/)
- [Boostrap v5](https://getbootstrap.com/)
- [ReactJS + TypeScript](https://react.dev/)
- [Bun](https://bun.sh/docs/installation)
- Prettier & [Husky](https://www.npmjs.com/package/husky)
- Pagination & Search
- Contact Forms
- Subscriptions
- Google & Github Social Login
- Deploy: <https://vercel.com/>
- Emails: <https://resend.com/>
- Payments: <https://stripe.com/>
- Frontend Global State Management:
   - [React Hooks: useContext, useContext, useMemo, useReducer, useCallback](https://react.dev/reference/react)

## ToDo v3
- [ ] Refactor using [TailwindCSS](https://tailwindcss.com/)
- [ ] Use <https://ui.shadcn.com/>
- [ ] Refactor using [NextJS and SSR](https://nextjs.org/)
- [ ] Create unit tests using [Jest for React](https://jestjs.io/docs/tutorial-react)
- [ ] Create End to End Tests using [Playwright](https://playwright.dev/)
- [ ] CI/CD using Github Actions to format code, run unit and end to end tests and deploy to [Vercel](https://vercel.com/)

## API
- BackEnd Source Code: <https://github.com/AlexGalhardo/api.games.alexgalhardo.com>
- Documentation Source code: <https://github.com/AlexGalhardo/docs.games.alexgalhardo.com>
- Docs Live: <https://docs.games.alexgalhardo.com>

## Development Setup Local

1. Clone this repository
```bash
git clone git@github.com:AlexGalhardo/games.alexgalhardo.com.git
```

2. Enter repository
```bash
cd games.alexgalhardo.com/
```

3. Install dependencies
```bash
npm install
```

4. Setup your environment variables
```bash
cp .env.example .env
```

5. Start local server
```bash
npm run dev
```

## Build for deploy

a. Creating build
```bash
bun run build
```

b. Preview build server
```bash
bun run start
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2023-present, [Alex Galhardo](https://github.com/AlexGalhardo)
