# Feature Specification: SpinlockLabs Website

**Feature Branch**: `[001-spinlocklabs-site]`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Can you write a spec for my website" — website for SpinlockLabs, a research lab under ZTA Security (ztasecurity.com) specializing in AI for cybersecurity. Research-oriented content, current project is local LLMs on the radiance inference engine with a pair of 9700 AI PRO GPUs, a blog section (empty at launch), contact at contact@ztasecurity.com.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand the lab from the home page (Priority: P1)

A visitor arrives at the site from a search result or from the ZTA Security website. The home page states in a few sentences what SpinlockLabs is (a research lab under ZTA Security studying AI for cybersecurity), links to current research, links to the blog, and provides a way to contact the lab.

**Why this priority**: The home page is the entry point. If a visitor cannot tell what the lab does and where to go next, nothing else on the site is reachable or credible.

**Independent Test**: Load the home page on a desktop and a mobile width. Verify the mission statement, a link to the research section, a link to the blog, and the contact address are all visible without scrolling past the first screen.

**Acceptance Scenarios**:

1. **Given** a first-time visitor, **When** they load the home page, **Then** they see the lab name, its relationship to ZTA Security, and a plain-language mission statement about studying local AI models for security.
2. **Given** a visitor who read the mission, **When** they look for next steps, **Then** they find clearly labeled links to current research, the blog, and the contact address.
3. **Given** the home page, **When** it is rendered at a narrow mobile width, **Then** all navigation and links remain reachable and no content overlaps or is cut off.

---

### User Story 2 - Read the radiance research project (Priority: P1)

A researcher or security practitioner wants to know what the lab is actually doing. They open the research section and read the radiance project page: the question being asked, the setup (radiance inference engine, two Radeon AI PRO R9700 GPUs, local LLMs), what is being measured, and the current status.

**Why this priority**: This is the reason the site exists. The site must be able to show one real project with a factual structure instead of marketing copy.

**Independent Test**: Open the research section, then the radiance project page. Verify the page contains a stated research question, a named setup (engine, hardware, models), described work, and a status that does not claim results that have not been measured.

**Acceptance Scenarios**:

1. **Given** the research section, **When** it contains at least one project, **Then** the project is listed with its title, a one-line summary, its status, and its last-updated date.
2. **Given** the radiance project page, **When** a reader compares it to the lab's actual setup, **Then** the engine (radiance), the hardware (two Radeon AI PRO R9700 GPUs), and the model class (local 27B-class LLMs) are stated accurately.
3. **Given** the radiance project page before any measured results exist, **When** a reader looks for findings, **Then** the page says no results have been published yet instead of showing draft or placeholder numbers.

---

### User Story 3 - Publish a new research project (Priority: P2)

The lab team finishes setting up a new experiment. They add one document describing it (question, setup, work, status) to the research content. The site then lists it and serves its page.

**Why this priority**: The lab will run more than one project. Publishing a new project without changing site code is what makes the research section a durable structure rather than a one-off page.

**Independent Test**: Add a second project document with a new title, status, and body. Rebuild or refresh the site. Verify the project appears in the research list and its page is reachable with the correct title and content.

**Acceptance Scenarios**:

1. **Given** the site with one research project, **When** a second project document is added, **Then** the research list shows both projects, ordered by most recently updated first.
2. **Given** a project document with a missing required field (for example, no status), **When** the site is built, **Then** the build fails with a message that names the problem instead of producing a broken page.
3. **Given** an existing project, **When** its update date is changed, **Then** the research list reorders and the project page shows the new date.

---

### User Story 4 - Check the blog (Priority: P2)

A returning visitor checks the blog for write-ups of methods and findings. At launch the blog has no posts; the page must say so plainly.

**Why this priority**: The blog is a named part of the site. An empty blog must not look broken, and the first post must be publishable the same way as a research project.

**Independent Test**: Open the blog index with no posts. Verify an explicit "no posts yet" state is shown. Then add a first post and verify it appears in the index and its page renders.

**Acceptance Scenarios**:

1. **Given** the blog with zero posts, **When** a visitor opens the blog index, **Then** they see a clear "no posts yet" notice and no broken or empty list rows.
2. **Given** the blog with one or more posts, **When** a visitor opens the blog index, **Then** posts are listed with their title, a short description, and publication date, ordered newest first.
3. **Given** a published post, **When** a visitor opens it, **Then** the page shows the title, description, publication date, and full body, with a path back to the blog index.

---

### User Story 5 - Recover from a bad link (Priority: P3)

A visitor follows a stale link or mistypes an address. The site shows a not-found page with a path back to the home page.

**Why this priority**: Cheap to provide and it prevents dead ends for readers of shared links.

**Independent Test**: Request a URL that does not exist. Verify a not-found page renders with a link to the home page.

**Acceptance Scenarios**:

1. **Given** a URL that matches no page, **When** it is requested, **Then** the visitor sees a not-found page with a link to the home page.

---

### Edge Cases

- **Empty research section**: If the research section contains no projects (for example, before the first project is added), it shows an explicit empty state instead of a blank section or an error.
- **Long titles and tags**: A project or post with a very long title wraps without breaking the list layout. A project with many tags does not push the summary text off-screen.
- **External links**: Links to external resources (the radiance project repository, the ZTA Security site) open in a new browsing context and are marked as external.
- **Status vocabulary**: A project's status is drawn from a fixed small set (for example, Active, Ongoing, Public call). An unknown status value fails the build instead of rendering silently.
- **Site domain**: The site is served at spinlocklabs.com. A single configuration point holds the site address used in links, the sitemap, and shared-page metadata, so a domain change is a one-line edit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST present the lab's identity: the name SpinlockLabs, its status as a research lab under ZTA Security, and its focus on AI for cybersecurity.
- **FR-002**: The home page MUST show a concise mission statement, a link to the research section, a link to the blog, and the contact address.
- **FR-003**: The research section MUST list all research projects with title, one-line summary, status, and last-updated date, ordered by most recently updated first.
- **FR-004**: Each research project page MUST present, in order: the research question, the setup (engine, hardware, models), the work being done, and the current status.
- **FR-005**: The radiance project page MUST accurately describe the current experiment: local large language models served by the radiance inference engine on a pair of Radeon AI PRO R9700 GPUs, with links to the radiance project repository.
- **FR-006**: Research project pages MUST NOT present measured results that have not actually been measured. Before results exist, the page MUST state that none have been published.
- **FR-007**: A new research project MUST be publishable by adding a single structured content document, with no changes to site code.
- **FR-008**: The blog index MUST list published posts with title, description, and publication date, ordered newest first.
- **FR-009**: When the blog has no posts, the blog index MUST display an explicit "no posts yet" state.
- **FR-010**: A new blog post MUST be publishable by adding a single structured content document, with no changes to site code.
- **FR-011**: The contact address contact@ztasecurity.com MUST be shown on the home page and in the site footer, and MUST be directly usable as an email link.
- **FR-012**: The site MUST be deployable to GitHub Pages from the repository on every push to the main branch.
- **FR-013**: Every page MUST carry a page title and a short description suitable for search results and social sharing, and the site MUST publish a sitemap.
- **FR-014**: A request for a non-existent page MUST return a not-found page that links to the home page.
- **FR-015**: The site MUST be usable at both narrow mobile and standard desktop widths without horizontal scrolling or overlapping content.
- **FR-016**: The site MUST NOT run analytics, tracking scripts, or set cookies.
- **FR-017**: All content MUST be factual and research-oriented. The site MUST NOT use marketing superlatives or claims that are not supported by a project page.
- **FR-018**: The site MUST be a static site: every page is fully generated at build time, with no server-side processing or user accounts.

### Key Entities

- **Research project**: One lab experiment. Attributes: title, status (from a fixed set), one-line summary, last-updated date, tags, external resource links, and a body structured as question, setup, work, status.
- **Blog post**: One published write-up. Attributes: title, short description, publication date, optional update date, tags, and full body.
- **Site metadata**: Lab name, mission statement, contact email, link to the parent organization (ZTA Security), and the site address used in links and shared-page metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can state, after 10 seconds on the home page, what the lab does and where to find current research.
- **SC-002**: A visitor reaches any research project page from the home page in at most two clicks.
- **SC-003**: A new research project or blog post is published by adding exactly one content document. Verification by review confirms no site code changed.
- **SC-004**: Every page loads in under 3 seconds on a standard broadband connection, measured from first request to full page.
- **SC-005**: The radiance project page names the engine, the exact GPU model and count, and the model class, and contains zero performance numbers that have not been measured and published by the lab.
- **SC-006**: Every page renders correctly at a 320 px viewport and at a 1280 px viewport, with no horizontal scrolling, overlap, or hidden controls.
- **SC-007**: A request to a non-existent path shows the not-found page with a working link to the home page, 100% of the time.
- **SC-008**: A page shared from the site displays a sensible title, description, and image in a standard link-preview context.

## Assumptions

- The site is static. There are no accounts, no forms, and no server-side data processing.
- The site is served at spinlocklabs.com (GitHub Pages custom domain). The address is set in one place.
- No analytics or tracking is used on the site.
- The contact email belongs to the parent organization (ZTA Security) and is the single contact channel for the lab.
- At launch the site carries exactly one research project (radiance) and zero blog posts. The structure must support more of both without code changes.
- Content is authored by the lab operator in English. A multi-author workflow is out of scope at launch.
- The user specified Astro as the site framework and GitHub Pages as the deployment target. These are recorded here as user constraints; the functional requirements above are stated independently of them.
- The radiance project's hardware is a pair of Radeon AI PRO R9700 GPUs, as stated by the lab.
