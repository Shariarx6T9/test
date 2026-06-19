# RailMate Bangladesh

## App Flow & Implementation Source of Truth

Version: 1.0

This document is the implementation source of truth for the RailMate Bangladesh mobile application.

The UI screenshots provided to the project are FINAL APPROVED DESIGNS.

The application must be implemented to match those screenshots as closely as possible.

This document defines product behavior, navigation, screen responsibilities, implementation priorities, and development rules.

---

# PRODUCT POSITIONING

RailMate Bangladesh is a railway companion application.

RailMate is NOT a ticket booking platform.

RailMate helps users:

* Search trains
* Explore routes
* View schedules
* Check fares
* Monitor delays
* View crowding reports
* Participate in community reporting
* Manage journeys
* Receive alerts
* Track reputation and contributions

Ticket purchasing is redirected externally to Rail Sheba.

---

# CORE PRODUCT PROMISE

Travel Smarter. Travel RailMate.

The application becomes the trusted railway companion before, during, and after every train journey.

---

# DESIGN AUTHORITY

The uploaded UI screenshots are final approved designs.

The screenshots override design decisions.

Implementation must follow screenshots.

Do not redesign.

Do not simplify.

Do not replace layouts.

Do not remove sections.

Do not introduce personal design preferences.

Goal:
Pixel-perfect implementation matching screenshots.

---

# PRIMARY NAVIGATION

The application contains exactly five bottom tabs.

1. Home
2. Search
3. Live Updates
4. Community
5. Profile

No additional bottom tabs may be added.

---

# USER FLOW

First Launch
→ Onboarding
→ Language Selection
→ Authentication
→ Home

Train Search Flow
→ Home
→ Search
→ Search Results
→ Train Detail
→ Route Information
→ Seat Availability

Live Information Flow
→ Home
→ Live Updates
→ Report Detail
→ Community Discussion

Community Flow
→ Community
→ Report Detail
→ Comments
→ User Reputation
→ Leaderboard

Journey Flow
→ Profile
→ My Trips
→ Saved Routes
→ Alerts
→ Notifications

---

# SCREEN INVENTORY

01 Onboarding

Purpose:
Introduce product value and guide user into app.

Requirements:

* Welcome slides
* Language selection
* Authentication options
* Skip option

---

02 Home

Purpose:
Primary dashboard.

Requirements:

* Greeting section
* Search widget
* Quick actions
* Saved routes
* Live updates preview
* Community summary

---

03 Search

Purpose:
Search trains.

Requirements:

* Origin
* Destination
* Date
* Class
* Search action
* Recent searches

---

04 Search Results

Purpose:
Display train options.

Requirements:

* Train list
* Schedule
* Community status
* Delay status
* Availability indicators

---

05 Train Detail

Purpose:
Detailed train information.

Requirements:

* Timeline
* Stops
* Community reports
* Delay status
* Alerts
* Route information

---

06 Seat Availability

Purpose:
Coach and seat information.

Requirements:

* Coach information
* Availability
* Occupancy status
* Fare information

No internal payment system.

Ticket purchasing redirects externally.

---

07 Journey Tools

Purpose:
Journey management.

Requirements:

* Trips
* Saved routes
* Alerts
* Travel history

---

08 Community

Purpose:
Community reporting system.

Requirements:

* Feed
* Votes
* Discussions
* Report verification

---

09 Live Updates

Purpose:
Real-time railway intelligence.

Requirements:

* Delays
* Crowding
* Platform changes
* Alerts
* Recent reports

---

10 Profile

Purpose:
User profile.

Requirements:

* User information
* Statistics
* Reputation
* Badges
* Settings access

---

11 Notifications

Purpose:
Important updates.

Requirements:

* Delay alerts
* Community activity
* System updates

---

12 Report Detail

Purpose:
Detailed report review.

Requirements:

* Votes
* Verification
* Comments
* Reporter information

---

13 Submit Report

Purpose:
Create community reports.

Workflow:
Select Train
→ Select Type
→ Enter Details
→ Review
→ Submit

---

14 Comments

Purpose:
Community discussion.

Requirements:

* Replies
* Voting
* Mentions
* Verification indicators

---

15 Reputation

Purpose:
Trust system.

Requirements:

* Score
* Contribution history
* Badges
* Levels

---

16 Leaderboard

Purpose:
Contributor ranking.

Requirements:

* Weekly
* Monthly
* All Time

---

17 Settings

Purpose:
Application configuration.

Requirements:

* Language
* Notifications
* Privacy
* Appearance

---

18 Station Information

Purpose:
Station details.

Requirements:

* Facilities
* Trains
* Directions
* Contacts

---

19 Route Information

Purpose:
Route visualization.

Requirements:

* Route map
* Stops
* Duration
* Delay indicators

---

20 Delay Analytics

Purpose:
Historical delay insights.

Requirements:

* Reliability metrics
* Delay trends
* Community data

---

# BRAND ASSETS

Assets already exist.

Location:

assets/images/

Available:

* logo
* icon
* adaptive icon
* splash screen
* favicon

Always reuse existing assets.

Never replace brand assets.

Never generate alternative logos.

Never generate replacement splash screens.

---

# IMPLEMENTATION RULES

If functionality is missing:

Create:

* Components
* Hooks
* Stores
* Services
* Types
* Utilities
* API integrations

If a file is missing:

Create it.

If code is broken:

Fix it.

Preserve architecture.

Preserve navigation.

Preserve functionality.

---

# OUTPUT REQUIREMENTS

When implementing screens:

1. Analyze existing implementation.
2. Compare against screenshot.
3. Compare against this document.
4. Identify missing functionality.
5. Implement functionality.
6. Return complete files.

Never return snippets.

Never return pseudo code.

Never return placeholders.

Always return production-ready code.
