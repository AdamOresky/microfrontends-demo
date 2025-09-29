# Microfrontends Demo

**Work in Progress**

This repository demonstrates different approaches to building **microfrontends**.  
The demos showcase integration via **HTML links, Iframes, AJAX, and Web Components**.

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
npm install
```

Then run one of the available demos with `npm run`:
```bash
npm run 01_pages_links
```
```bash
npm run 02_iframe
```
```bash
npm run 03_ajax
```
```bash
npm run 04_web_components
```

---

## ✅ TODO

- [ ] Make **01–03** fetch data from JSON instead of static content.
- [ ] Finalize **04 (web components + cart)** demo.
- [ ] Clean up CSS files and give teams consistent, descriptive names.
- [ ] Add toggleable outlines to visually highlight the boundaries of each microfrontend.

---

## 📌 Notes

- Each demo runs its own microfrontend servers (`team-decide`, `team-inspire`, `storage`).
- Static assets (images, JSON, etc.) are served on a separate storage port.
- Designed as part of a **bachelor thesis project on microfrontends**.  