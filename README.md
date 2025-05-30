# Taller 2 IDWM - Web Application

## Description

This project implements a frontend using Angular to consume a backend located at [IDWM/project-dotnet-api](https://github.com/IDWM/project-dotnet-api).

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Angular CLI: This project uses Angular CLI version 18.0.1. You can install it by following the instructions at [Angular CLI Setup](https://angular.dev/tools/cli/setup-local).
- Node.js: This project requires Node.js version 20.10.0. You can download and install it from [Node.js](https://nodejs.org/).

## Installation

Follow these steps to set up your development environment:

1. Clone the repository:

```bash
git clone https://github.com/GSGEdgardo/OrtizE_Taller2Web/tree/edgardo
```

2. Enter the project folder:
   ```
   cd Taller2
   ```
3. Install dependencies:

```bash
npm install
```

4. (Optional) For the backend and database, clone and set up the backend repository by following the same process:

```
(Optional) For the backend and database, clone and set up the backend repository by following the same process:
```

## Usage

To run the frontend project, use the following command:

```
ng serve
```

This will start the application and it will be available at `http://localhost:4200` by default.

## Project Structure

```


/Taller2/src/app
|-- /components
|   |-- /admin
|   |   |-- /manage-clients
|   |   |   |-- manage-clients.component.css
|   |   |   |-- manage-clients.component.html
|   |   |   |-- manage-clients.component.spec.ts
|   |   |   |-- manage-clients.component.ts
|   |   |-- /manage-products
|   |   |   |-- manage-products.component.css
|   |   |   |-- manage-products.component.html
|   |   |   |-- manage-products.component.spec.ts
|   |   |   |-- manage-products.component.ts
|   |   |-- /user-profile
|   |   |   |-- /change-password
|   |   |   |   |-- change-password.component.css
|   |   |   |   |-- change-password.component.html
|   |   |   |   |-- change-password.component.spec.ts
|   |   |   |   |-- change-password.component.ts
|   |   |   |-- user-profile.component.css
|   |   |   |-- user-profile.component.html
|   |   |   |-- user-profile.component.spec.ts
|   |   |   |-- user-profile.component.ts
|   |   |-- /view-sales
|   |   |   |-- view-sales.component.css
|   |   |   |-- view-sales.component.html
|   |   |   |-- view-sales.component.spec.ts
|   |   |   |-- view-sales.component.ts
|   |   |-- admin-routing.module.ts
|   |   |-- admin.component.css
|   |   |-- admin.component.html
|   |   |-- admin.component.spec.ts
|   |   |-- admin.component.ts
|   |   |-- admin.module.ts
|   |-- /login
|   |   |-- login.component.css
|   |   |-- login.component.html
|   |   |-- login.component.spec.ts
|   |   |-- login.component.ts
|   |-- /register
|   |   |-- register.component.css
|   |   |-- register.component.html
|   |   |-- register.component.spec.ts
|   |   |-- register.component.ts
|   |-- /user
|   |   |-- /purchase-modal
|   |   |-- /view-invoice
|   |   |-- /view-products
|   |   |   |-- view-products.component.css
|   |   |   |-- view-products.component.html
|   |   |   |-- view-products.component.spec.ts
|   |   |   |-- view-products.component.ts
|   |   |-- user-nav.component.html
|   |   |-- user-nav.component.ts
|   |   |-- user-routing.module.ts
|   |   |-- user.module.ts
|-- /guards
|   |-- auth.guard.ts
|-- /interceptors
|   |-- auth.interceptor.ts
|-- /models
|   |-- account.ts
|   |-- client.ts
|   |-- product-type.ts
|   |-- product.ts
|   |-- purchase.ts
|   |-- register-user.ts
|-- /services
|   |-- account.service.ts
|   |-- client.service.ts
|   |-- product.service.ts
|   |-- purchase.service.ts
|   |-- sales.service.ts
|-- app-routing.module.ts
|-- app.component.css
|-- app.component.html
|-- app.component.spec.ts
|-- app.component.ts
|-- app.module.ts
/assets
|-- .gitkeep
/environments
|-- environment.ts
|-- environment.prod.ts
|-- favicon.ico
|-- index.html
|-- main.ts
|-- styles.css
|-- .editorconfig
|-- .gitignore
|-- angular.json
|-- package.json
|-- package-lock.json
|-- tsconfig.json
|-- tsconfig.app.json
|-- tsconfig.spec.json
|-- README.md
|-- tailwind.config.js

```

## Contact

Students:

* Edgardo Ortiz - [edgardo.ortiz@alumnos.ucn.cl
  ]()
