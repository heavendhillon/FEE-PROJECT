# Forge Athletic Club Website

A responsive, single-page website project for Forge Athletic Club in Ludhiana. It brings training programmes, class schedules, coach profiles, membership plans, fitness tools and free-trial enquiries into one experience.

## Features

- Browse and filter training programmes by goal.
- Filter the weekly timetable by day and class type.
- Explore coach profiles and programme details in interactive dialogs.
- Compare membership plans and switch between monthly and yearly billing.
- Use a BMI estimator, calorie and macro calculator, food tracker and water tracker.
- Submit a free-trial enquiry and receive on-page feedback.
- Use the newsletter sign-up form for an on-page subscription confirmation.
- Switch the site theme, browse FAQs and testimonials, and navigate between page sections.

## Built With

- HTML5
- CSS3, including responsive layouts
- Vanilla JavaScript
- Browser `localStorage` for demo data and saved preferences

The project does not use a JavaScript framework or require a package installation.

## Run Locally

1. Clone or download the repository.
2. Open a terminal in the project folder.
3. Start a simple local server:

   ```bash
   python -m http.server 8000
   ```

4. Open [http://localhost:8000/forgefitness.html](http://localhost:8000/forgefitness.html) in a browser.

You can also open `forgefitness.html` directly. A local server is recommended for more consistent browser behavior.

## Project Structure

```text
forgefitness.html    # Page structure, styles and JavaScript interactions
README.md            # Project documentation
```

The current implementation keeps the HTML, CSS and JavaScript in one file. Programme, timetable, coach, testimonial and food data are defined in the page's script.

## Data and Privacy

This is a front-end demo. Enquiries, newsletter sign-ups, meal selections and selected preferences are stored in the visitor's browser using `localStorage`. These forms do not send data to a server or notify the gym. Clearing the browser's site data removes locally saved entries and preferences.

## Before Publishing

- The enquiry form displays validation feedback, but the current submit handler does not stop invalid entries from being saved. Add a check that exits the handler when validation fails.
- Connect the enquiry form to a secure backend before using it to receive real customer information.
- Review the phone, WhatsApp, map and social links, and confirm the address and opening hours.
- Confirm the accuracy and permission to publish all coach details, testimonials, prices and fitness claims.
- The page loads fonts, images and the map from external services, so those elements require an internet connection. Confirm that externally hosted images are suitable for your use.

## Deployment

The site is static and can be hosted on GitHub Pages or another static hosting service. For a repository root URL, rename `forgefitness.html` to `index.html` or configure the host to use it as the entry page.

## License

No license has been specified for this project.
