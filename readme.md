# Setup Guide

## 1. Install dependencies
```bash
npm install
```

## 2. Fill in cypress.env.json
```json
{
  "DARAZ_EMAIL"   : "email",
  "DARAZ_PASSWORD": "password",
  "SEARCH_TERM"   : "laptop",
  "BRAND_FILTER"  : "Apple"
}
```
|
> **Note:** `cypress.env.json` is in `.gitignore` — credentials stay off version control.

---

## 3. Run the tests

```bash
npm test
```