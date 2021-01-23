## Install

```bash
# with npm
npm install dotenv

# or with Yarn
yarn add dotenv
```

## Usage

As early as possible in your application, require and configure dotenv.

```javascript
require('dotenv').config()
```

Create a `.env` file in the root directory of your project. Add
environment-specific variables on new lines in the form of `NAME=VALUE`.
For example:

```dosini
DB_HOST=localhost
DB_USER=root
DB_PASS=s1mpl3
```

`process.env` now has the keys and values you defined in your `.env` file.

```javascript
const db = require('db')
db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
})
```

## Frontend frameworks:
- React
- Vue
- Angular
