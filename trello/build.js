#!/usr/bin/env node

const fs = require('fs')

const bundle = fs.readFileSync('./trello/bundle.js', 'utf8');

const bookmarklet = `javascript:{${bundle}};void(0);`

fs.writeFileSync('./trello/bookmarklet.json', JSON.stringify(bookmarklet));
